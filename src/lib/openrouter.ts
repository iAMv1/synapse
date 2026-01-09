import OpenAI from 'openai';
import { useLLMStore } from '../stores/useLLMStore';
import { supabase } from './supabase';

// Types for chat messages
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// Get the Supabase Edge Function URL
const getEdgeFunctionUrl = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) return null;
    return `${supabaseUrl}/functions/v1/llm-proxy`;
};

// Create OpenAI client for BYOK mode
const createByokClient = (apiKey: string) => {
    return new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: apiKey,
        defaultHeaders: {
            'HTTP-Referer': 'https://synapse.app',
            'X-Title': 'Synapse Learning Platform',
        },
        dangerouslyAllowBrowser: true,
    });
};

// Generate a chat completion (uses Edge Function by default, BYOK if enabled)
export async function generateChatCompletion(
    messages: ChatMessage[],
    options?: {
        temperature?: number;
        maxTokens?: number;
    }
): Promise<string> {
    const { byokEnabled, byokApiKey, selectedModel } = useLLMStore.getState();

    // If BYOK is enabled and key is set, use direct OpenRouter call
    if (byokEnabled && byokApiKey) {
        try {
            const client = createByokClient(byokApiKey);
            const completion = await client.chat.completions.create({
                model: selectedModel,
                messages: messages,
                temperature: options?.temperature ?? 0.7,
                max_tokens: options?.maxTokens ?? 2048,
                stream: false,
            });
            return completion.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('BYOK OpenRouter API error:', error);
            throw new Error('Failed to generate response with your API key. Please check your key.');
        }
    }

    // Otherwise, use Supabase Edge Function (secure proxy)
    const edgeFunctionUrl = getEdgeFunctionUrl();
    if (!edgeFunctionUrl) {
        throw new Error('Server not configured. Please use your own API key in Settings.');
    }

    try {
        // Get the current session for auth
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            throw new Error('Please log in to use the AI assistant.');
        }

        const response = await fetch(edgeFunctionUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages,
                model: selectedModel,
                temperature: options?.temperature ?? 0.7,
                maxTokens: options?.maxTokens ?? 2048,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to generate response');
        }

        const data = await response.json();
        return data.content || '';
    } catch (error) {
        console.error('Edge function error:', error);
        throw error instanceof Error ? error : new Error('Failed to generate response. Please try again.');
    }
}

// Generate streaming chat completion (BYOK only for now)
export async function* generateStreamingCompletion(
    messages: ChatMessage[],
    options?: {
        temperature?: number;
        maxTokens?: number;
    }
): AsyncGenerator<string, void, unknown> {
    const { byokEnabled, byokApiKey, selectedModel } = useLLMStore.getState();

    if (!byokEnabled || !byokApiKey) {
        // Fallback to non-streaming for Edge Function
        const content = await generateChatCompletion(messages, options);
        yield content;
        return;
    }

    try {
        const client = createByokClient(byokApiKey);
        const stream = await client.chat.completions.create({
            model: selectedModel,
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
        console.error('BYOK streaming error:', error);
        throw new Error('Failed to generate streaming response.');
    }
}

// Export model for backward compatibility
export const LLM_MODEL = 'google/gemini-2.0-flash-exp:free';
