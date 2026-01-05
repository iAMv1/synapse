import { Link } from "react-router-dom";
import { ArrowRight, Brain, Zap, Users } from "lucide-react";
import { GlassButton } from "../../components/ui/GlassButton";
import { GlassCard } from "../../components/ui/GlassCard";
import { motion } from "framer-motion";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-hidden relative">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Nav */}
            <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">Synapse</span>
                </div>
                <div className="flex gap-4">
                    <Link to="/login">
                        <GlassButton variant="ghost">Log In</GlassButton>
                    </Link>
                    <Link to="/app">
                        <GlassButton variant="primary">Launch App</GlassButton>
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <main className="relative z-10 max-w-7xl mx-auto mt-20 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600">
                            Collaborative Intelligence
                        </span>
                        <span className="block mt-2">for the Next Generation.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                        Synapse isn't just a platform. It's a local-first neural network where data, skills, and intelligence converge.
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <Link to="/app">
                            <GlassButton className="px-8 py-4 text-lg">
                                Enter the Network <ArrowRight className="ml-2 w-5 h-5" />
                            </GlassButton>
                        </Link>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mt-32 text-left">
                    {[
                        { icon: Brain, title: "Local AI Brain", desc: "Private RAG running directly in your browser via WebWorkers." },
                        { icon: Users, title: "Real-time Sync", desc: "Collaborate on documents and whiteboards with zero latency." },
                        { icon: Zap, title: "Skill Tree", desc: "Gamified progression system to master new technologies." }
                    ].map((item, i) => (
                        <GlassCard key={i} hoverEffect>
                            <item.icon className="w-10 h-10 text-emerald-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-gray-400">{item.desc}</p>
                        </GlassCard>
                    ))}
                </div>
            </main>
        </div>
    );
}
