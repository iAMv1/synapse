import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ArrowRight, Loader2 } from "lucide-react";
import { GlassCard } from "../../components/ui/GlassCard";
import { GlassInput } from "../../components/ui/GlassInput";
import { GlassButton } from "../../components/ui/GlassButton";
import { supabase } from "../../lib/supabase";


export function Login() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Use Magic Link for "Magical" feel and simplicity
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            },
        });

        if (error) {
            alert(error.message);
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] animate-pulse" />

            <GlassCard className="w-full max-w-md relative z-10 mx-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Synapse
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Enter the neural network.
                    </p>
                </motion.div>

                {sent ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-4"
                    >
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            Check your email for the magic link.
                        </div>
                        <GlassButton
                            variant="ghost"
                            onClick={() => setSent(false)}
                            className="w-full"
                        >
                            Back to Login
                        </GlassButton>
                    </motion.div>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <GlassInput
                            label="Email"
                            type="email"
                            placeholder="architect@synapse.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <GlassButton
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Connect <ArrowRight className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </GlassButton>
                    </form>
                )}
            </GlassCard>
        </div>
    );
}
