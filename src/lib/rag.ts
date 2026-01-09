import { supabase } from './supabase';
import { generateChatCompletion, type ChatMessage } from './openrouter';
import type { DocumentMatch } from '../types/database';

// RAG System prompt for Synapse
const SYSTEM_PROMPT = `You are Synapse, an intelligent learning companion. You help students understand complex topics through:

1. **Clear explanations** using the Feynman technique (explain like teaching someone else)
2. **Visual thinking** - when appropriate, generate Mermaid diagrams for concepts.
   - Use \`\`\`mermaid code blocks.
   - **IMPORTANT**: Use strictly valid Mermaid syntax. For flowcharts, use simple node IDs (A, B, C) and clear labels.
   - Example:
     \`\`\`mermaid
     flowchart TD
       A[Start] --> B{Decision}
       B -->|Yes| C[Process]
       B -->|No| D[End]
     \`\`\`

3. **Pop Quizzes** - check understanding by generating a single multiple-choice question.
   - **IMPORTANT**: Output the quiz primarily as a RAW JSON object inside a \`\`\`json code block.
   - **Do NOT** include comments inside the JSON.
   - Schema:
     \`\`\`json
     {
       "id": "quiz-1",
       "question": "What is the main purpose of Redux?",
       "options": ["UI Styling", "State Management", "Database Access", "API Routing"],
       "correctIndex": 1,
       "explanation": "Redux is a predictable state container for JavaScript apps."
     }
     \`\`\`

4. **Code examples** - provide working code with syntax highlighting (e.g. \`\`\`typescript).

When you have context from the user's documents, cite them and build upon that knowledge.
Be concise, helpful, and encourage deeper understanding rather than just giving answers.`;

// Generate embedding using Web Worker
export async function generateEmbedding(text: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
        const worker = new Worker(
            new URL('./worker.ts', import.meta.url),
            { type: 'module' }
        );

        worker.onmessage = (event) => {
            if (event.data.status === 'complete') {
                resolve(event.data.embedding);
                worker.terminate();
            } else if (event.data.status === 'error') {
                reject(new Error(event.data.error));
                worker.terminate();
            }
        };

        worker.onerror = (error) => {
            reject(error);
            worker.terminate();
        };

        worker.postMessage({ id: Date.now().toString(), text });
    });
}

// Search for similar documents using vector similarity
export async function searchDocuments(
    query: string,
    userId?: string,
    options?: {
        matchThreshold?: number;
        matchCount?: number;
    }
): Promise<DocumentMatch[]> {
    try {
        // Generate embedding for the query
        const queryEmbedding = await generateEmbedding(query);

        // Call the match_documents function in Supabase
        // Using type assertion since the function exists in DB but may not be in generated types
        const { data, error } = await (supabase.rpc as any)('match_documents', {
            query_embedding: queryEmbedding,
            match_threshold: options?.matchThreshold ?? 0.5,
            match_count: options?.matchCount ?? 5,
            filter_user_id: userId ?? null,
        });

        if (error) {
            console.error('Vector search error:', error);
            return [];
        }

        return (data || []) as DocumentMatch[];
    } catch (error) {
        console.error('Error searching documents:', error);
        return [];
    }
}

// Build context from matched documents
function buildContext(matches: DocumentMatch[]): string {
    if (matches.length === 0) return '';

    const contextParts = matches.map((match, index) =>
        `[Document ${index + 1}] (similarity: ${(match.similarity * 100).toFixed(1)}%)\n${match.content}`
    );

    return `\n\nRelevant context from your documents:\n\n${contextParts.join('\n\n---\n\n')}`;
}

// Fetch user context (Level + Skills)
async function getUserContext(userId: string): Promise<string> {
    try {
        // Fetch Profile for Level
        const { data: profile } = await supabase
            .from('profiles')
            .select('level, total_xp')
            .eq('id', userId)
            .single();

        // Fetch User Skills (Mastered/Unlocked)
        // Using 'any' cast as usual for convenience with joins if needed, but simple select is fine
        const { data: skills } = await (supabase
            .from('user_skills') as any)
            .select(`
                status,
                xp,
                skills ( label, category )
            `)
            .eq('user_id', userId)
            .in('status', ['mastered', 'unlocked']);

        if (!profile && !skills?.length) return '';

        let context = `\n\n[USER CONTEXT]\nLevel: ${(profile as any)?.level || 1}`;

        if (skills && skills.length > 0) {
            const mastered = skills.filter((s: any) => s.status === 'mastered').map((s: any) => s.skills.label).join(', ');
            const learning = skills.filter((s: any) => s.status === 'unlocked').map((s: any) => s.skills.label).join(', ');

            if (mastered) context += `\nMastered Skills: ${mastered}`;
            if (learning) context += `\nCurrently Learning: ${learning}`;
        }

        context += `\n\nINSTRUCTION: Adapt your explanation to this user's level. If they have mastered a topic, go deeper. If they are learning it, be supportive and foundational.`;

        return context;
    } catch (error) {
        console.error('Error fetching user context:', error);
        return '';
    }
}

// Main RAG function - combines retrieval and generation
export async function ragQuery(
    userMessage: string,
    userId?: string,
    conversationHistory: ChatMessage[] = []
): Promise<string> {
    try {
        // 1. Search for relevant documents
        const matches = await searchDocuments(userMessage, userId);
        const docContext = buildContext(matches);

        // 2. Fetch User Skill Context (Adaptive Learning)
        let systemContext = SYSTEM_PROMPT + docContext;
        if (userId) {
            const userSkillContext = await getUserContext(userId);
            systemContext += userSkillContext;
        }

        // 3. Build messages array with system prompt, context, and history
        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: systemContext,
            },
            ...conversationHistory.slice(-10), // Keep last 10 messages for context
            {
                role: 'user',
                content: userMessage,
            },
        ];

        // 4. Generate response using LLM
        const response = await generateChatCompletion(messages, {
            temperature: 0.7,
            maxTokens: 2048,
        });

        return response;
    } catch (error) {
        console.error('RAG query error:', error);
        throw new Error('Failed to process your question. Please try again.');
    }
}

// Store a document section with its embedding
export async function storeDocumentSection(
    documentId: string,
    content: string,
    metadata?: Record<string, unknown>
): Promise<boolean> {
    try {
        // Generate embedding for the content
        const embedding = await generateEmbedding(content);

        // Store in Supabase - using explicit type for runtime table
        const { error } = await (supabase
            .from('document_sections') as any)
            .insert({
                document_id: documentId,
                content,
                embedding,
                metadata: metadata || {},
            });

        if (error) {
            console.error('Error storing document section:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error processing document section:', error);
        return false;
    }
}

// Save chat message to history
export async function saveChatMessage(
    userId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    roomId?: string,
    metadata?: Record<string, unknown>
): Promise<boolean> {
    try {
        const { error } = await (supabase
            .from('chat_messages') as any)
            .insert({
                user_id: userId,
                role,
                content,
                room_id: roomId ?? null,
                metadata: metadata || {},
            });

        if (error) {
            console.error('Error saving chat message:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error saving chat message:', error);
        return false;
    }
}

// Get chat history for a user
export async function getChatHistory(
    userId: string,
    roomId?: string,
    limit: number = 50
): Promise<ChatMessage[]> {
    try {
        let query = (supabase
            .from('chat_messages') as any)
            .select('role, content, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: true })
            .limit(limit);

        if (roomId) {
            query = query.eq('room_id', roomId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching chat history:', error);
            return [];
        }

        return (data || []).map((msg: any) => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content,
        }));
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return [];
    }
}
