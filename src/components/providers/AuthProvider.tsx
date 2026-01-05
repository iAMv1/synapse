import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../stores/useAuthStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setSession, setUser } = useAuthStore();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [setSession, setUser]);

    return <>{children}</>;
}
