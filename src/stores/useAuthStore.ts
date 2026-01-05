import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    setSession: (session: Session | null) => void;
    setUser: (user: User | null) => void;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: true,
    setSession: (session) => set({ session, user: session?.user ?? null, isLoading: false }),
    setUser: (user) => set({ user }),
    signOut: async () => {
        // We'll inject the supabase client in the provider to avoid circular deps or keep it simple
        // For now just update state, actual signout happens in the component/thunk
        set({ user: null, session: null });
    }
}));
