import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LLMState {
    // BYOK (Bring Your Own Key) settings
    byokEnabled: boolean;
    byokApiKey: string | null;
    selectedModel: string;
    
    // Actions
    setByokEnabled: (enabled: boolean) => void;
    setByokApiKey: (key: string | null) => void;
    setSelectedModel: (model: string) => void;
    clearByokKey: () => void;
}

export const useLLMStore = create<LLMState>()(
    persist(
        (set) => ({
            byokEnabled: false,
            byokApiKey: null,
            selectedModel: 'google/gemini-2.0-flash-exp:free',

            setByokEnabled: (enabled) => set({ byokEnabled: enabled }),
            setByokApiKey: (key) => set({ byokApiKey: key }),
            setSelectedModel: (model) => set({ selectedModel: model }),
            clearByokKey: () => set({ byokApiKey: null, byokEnabled: false }),
        }),
        {
            name: 'synapse-llm-settings',
            // Only persist these fields
            partialize: (state) => ({
                byokEnabled: state.byokEnabled,
                byokApiKey: state.byokApiKey,
                selectedModel: state.selectedModel,
            }),
        }
    )
);

// Available models for selection
export const AVAILABLE_MODELS = [
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (Free)', provider: 'Google' },
    { id: 'nex-agi/deepseek-v3.1-nex-n1:free', name: 'DeepSeek V3.1 (Free)', provider: 'Nex AGI' },
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (Free)', provider: 'Meta' },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
];
