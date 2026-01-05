import OpenAI from 'openai';

// OpenRouter client - OpenAI SDK compatible
const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
const openRouterModel = import.meta.env.VITE_OPENROUTER_MODEL || 'nex-agi/deepseek-v3.1-nex-n1:free';

if (!openRouterApiKey) {
    console.warn('Missing VITE_OPENROUTER_API_KEY environment variable');
}

export const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: openRouterApiKey || '',
    defaultHeaders: {
        'HTTP-Referer': 'https://synapse.app',
        'X-Title': 'Synapse Learning Platform',
    },
    dangerouslyAllowBrowser: true, // Required for browser-side usage
});

export const LLM_MODEL = openRouterModel;

// Types for chat messages
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// Generate a chat completion
export async function generateChatCompletion(
    messages: ChatMessage[],
    options?: {
        temperature?: number;
        maxTokens?: number;
        stream?: boolean;
    }
): Promise<string> {
    try {
        const completion = await openai.chat.completions.create({
            model: LLM_MODEL,
            messages: messages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 2048,
            stream: false,
        });

        return completion.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('OpenRouter API error:', error);
        throw new Error('Failed to generate response. Please try again.');
    }
}

// Generate streaming chat completion
export async function* generateStreamingCompletion(
    messages: ChatMessage[],
    options?: {
        temperature?: number;
        maxTokens?: number;
    }
): AsyncGenerator<string, void, unknown> {
    try {
        const stream = await openai.chat.completions.create({
            model: LLM_MODEL,
            messages: messages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens ?? 2048,
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield content;
            }
        }
    } catch (error) {
        console.error('OpenRouter streaming error:', error);
        throw new Error('Failed to generate streaming response.');
    }
}
