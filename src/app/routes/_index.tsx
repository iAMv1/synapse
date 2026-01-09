import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Brain, Share2, Zap, Sparkles, BookOpen, Users, Target } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { SynapseButton } from "../../components/ui/SynapseButton";

export default function LandingPage() {
    const { session } = useAuthStore();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
    const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

    // Smooth parallax with spring physics
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const heroBlur = useTransform(scrollYProgress, [0, 0.3], [0, 10]);

    return (
        <div ref={containerRef} className="relative bg-[var(--bg-primary)] overflow-hidden font-sans text-[var(--text-primary)]">

            {/* Animated Background Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[var(--accent-primary)] rounded-full blur-[200px] opacity-10 animate-pulse" />
                <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-[var(--accent-secondary)] rounded-full blur-[250px] opacity-10 animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] bg-[var(--accent-tertiary)] rounded-full blur-[180px] opacity-8 animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between backdrop-blur-xl bg-[rgba(5,5,5,0.7)] border border-[var(--border-subtle)] rounded-2xl px-6 py-3">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl blur opacity-40" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Synapse</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Features</a>
                        <a href="#stats" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Why Synapse</a>
                    </div>

                    {session ? (
                        <SynapseButton onClick={() => navigate("/app/dashboard")} className="px-6">
                            Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                        </SynapseButton>
                    ) : (
                        <SynapseButton onClick={() => navigate("/login")} className="px-6">
                            Get Started <ArrowRight className="w-4 h-4 ml-2" />
                        </SynapseButton>
                    )}
                </div>
            </nav>

            {/* HERO SECTION */}
            <motion.section
                style={{ scale: heroScale, opacity: heroOpacity, filter: `blur(${heroBlur}px)` }}
                className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6"
            >
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5 mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span className="text-sm font-medium text-[var(--accent-primary)]">AI-Powered Learning Platform</span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight leading-[1.1] mb-8"
                    >
                        <span className="block text-white">Your Second Brain</span>
                        <span className="block bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-tertiary)] bg-clip-text text-transparent">
                            for Deep Learning
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 font-light leading-relaxed"
                    >
                        Connect documents, build knowledge graphs, and learn with an AI companion that understands your unique context.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <SynapseButton
                            onClick={() => navigate(session ? "/app/dashboard" : "/login")}
                            className="h-14 px-10 text-lg shadow-[0_0_60px_rgba(0,240,255,0.4)] hover:shadow-[0_0_80px_rgba(0,240,255,0.6)] transition-all duration-500"
                        >
                            {session ? "Enter Workspace" : "Start for Free"}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </SynapseButton>

                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className="h-14 px-8 rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-default)] transition-all duration-300"
                        >
                            See How It Works
                        </button>
                    </motion.div>

                    {/* Floating 3D Element */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mt-20 relative"
                    >
                        <div className="relative mx-auto w-full max-w-3xl rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[#0D1117] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] font-mono text-sm leading-relaxed">
                            {/* Terminal Header */}
                            <div className="h-10 bg-[#161B22] border-b border-[var(--border-subtle)] flex items-center px-4 justify-between">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                                </div>
                                <div className="text-xs text-[var(--text-tertiary)] flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                                    synapse.config.ts
                                </div>
                            </div>

                            {/* Code Content */}
                            <div className="p-6 overflow-x-auto relative group">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D1117]/50 pointer-events-none" />
                                <pre className="text-[var(--text-secondary)]">
                                    <code>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">1</span><span className="text-[#FF7B72]">import</span> <span className="text-[#C9D1D9]">{'{'}</span> <span className="text-[#D2A8FF]">NeuralNetwork</span> <span className="text-[#C9D1D9]">{'}'}</span> <span className="text-[#FF7B72]">from</span> <span className="text-[#A5D6FF]">'@synapse/core'</span><span className="text-[#C9D1D9];">;</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">2</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">3</span><span className="text-[#8B949E]">// Initialize Second Brain</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">4</span><span className="text-[#FF7B72]">const</span> <span className="text-[#79C0FF]">brain</span> <span className="text-[#FF7B72]">=</span> <span className="text-[#FF7B72]">new</span> <span className="text-[#D2A8FF]">NeuralNetwork</span><span className="text-[#C9D1D9]">(</span><span className="text-[#C9D1D9]">{'{'}</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">5</span>    <span className="text-[#79C0FF]">learningRate</span><span className="text-[#FF7B72]">:</span> <span className="text-[#A5D6FF]">'continuous'</span><span className="text-[#C9D1D9]">,</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">6</span>    <span className="text-[#79C0FF]">memory</span><span className="text-[#FF7B72]">:</span> <span className="text-[#A5D6FF]">'infinite'</span><span className="text-[#C9D1D9]">,</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">7</span>    <span className="text-[#79C0FF]">synapses</span><span className="text-[#FF7B72]">:</span> <span className="text-[#79C0FF]">1_000_000_000</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">8</span><span className="text-[#C9D1D9]">{'}'}</span><span className="text-[#C9D1D9]">)</span><span className="text-[#C9D1D9];">;</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">9</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">10</span><span className="text-[#8B949E]">// Connect to knowledge sources</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">11</span><span className="text-[#FF7B72]">await</span> <span className="text-[#79C0FF]">brain</span><span className="text-[#C9D1D9]">.</span><span className="text-[#D2A8FF]">connect</span><span className="text-[#C9D1D9]">(</span><span className="text-[#C9D1D9]">[</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">12</span>    <span className="text-[#A5D6FF]">'documents/*.pdf'</span><span className="text-[#C9D1D9]">,</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">13</span>    <span className="text-[#A5D6FF]">'notes/**/*.md'</span><span className="text-[#C9D1D9]">,</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">14</span>    <span className="text-[#A5D6FF]">'team/chats'</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">15</span><span className="text-[#C9D1D9]">]</span><span className="text-[#C9D1D9]">)</span><span className="text-[#C9D1D9];">;</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">16</span></div>
                                        <div className="flex"><span className="text-[#8B949E] w-6 select-none">17</span><span className="text-[#79C0FF]">console</span><span className="text-[#C9D1D9]">.</span><span className="text-[#D2A8FF]">log</span><span className="text-[#C9D1D9]">(</span><span className="text-[#A5D6FF]">'Second Brain Online 🧠'</span><span className="text-[#C9D1D9]">)</span><span className="text-[#C9D1D9];">;</span><span className="inline-block w-2.5 h-4 ml-1 align-middle bg-[var(--accent-primary)] animate-pulse" /></div>
                                    </code>
                                </pre>
                            </div>
                        </div>
                        {/* Ambient glow under preview */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[var(--accent-primary)] blur-[100px] opacity-20" />
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="w-6 h-10 rounded-full border-2 border-[var(--border-subtle)] flex items-start justify-center p-2"
                    >
                        <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="w-1 h-2 bg-[var(--accent-primary)] rounded-full"
                        />
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* FEATURES SECTION */}
            <section id="features" ref={featuresRef} className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <span className="text-sm font-mono text-[var(--accent-primary)] tracking-widest uppercase mb-4 block">
                            Supercharge Your Learning
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif mb-6">
                            Everything You Need to <span className="italic">Excel</span>
                        </h2>
                        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                            A complete ecosystem for transforming how you absorb, retain, and apply knowledge.
                        </p>
                    </motion.div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Brain className="w-6 h-6" />}
                            title="Neural Chat"
                            description="Ask questions about your documents and get AI-powered answers grounded in your content."
                            gradient="from-cyan-500 to-blue-500"
                            delay={0}
                            inView={featuresInView}
                        />
                        <FeatureCard
                            icon={<BookOpen className="w-6 h-6" />}
                            title="Smart Documents"
                            description="Upload PDFs, notes, and text. We chunk, embed, and index everything for instant retrieval."
                            gradient="from-purple-500 to-pink-500"
                            delay={0.1}
                            inView={featuresInView}
                        />
                        <FeatureCard
                            icon={<Target className="w-6 h-6" />}
                            title="Skill Tree"
                            description="Track your learning journey with a gamified skill tree. Earn XP and level up your expertise."
                            gradient="from-orange-500 to-red-500"
                            delay={0.2}
                            inView={featuresInView}
                        />
                        <FeatureCard
                            icon={<Users className="w-6 h-6" />}
                            title="Collaborative Rooms"
                            description="Study together in real-time. Share contexts, notes, and insights with your team."
                            gradient="from-green-500 to-emerald-500"
                            delay={0.3}
                            inView={featuresInView}
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Instant Quizzes"
                            description="Auto-generated quizzes from your content. Active recall meets spaced repetition."
                            gradient="from-yellow-500 to-orange-500"
                            delay={0.4}
                            inView={featuresInView}
                        />
                        <FeatureCard
                            icon={<Share2 className="w-6 h-6" />}
                            title="Knowledge Graph"
                            description="See connections between concepts. Build a web of knowledge that grows with you."
                            gradient="from-indigo-500 to-purple-500"
                            delay={0.5}
                            inView={featuresInView}
                        />
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section id="stats" ref={statsRef} className="relative py-32 px-6 bg-gradient-to-b from-transparent via-[var(--bg-secondary)] to-transparent">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={statsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        <StatCard number="10x" label="Faster Learning" delay={0} inView={statsInView} />
                        <StatCard number="∞" label="Document Storage" delay={0.1} inView={statsInView} />
                        <StatCard number="30%" label="Better Retention" delay={0.2} inView={statsInView} />
                        <StatCard number="24/7" label="AI Availability" delay={0.3} inView={statsInView} />
                    </motion.div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="relative py-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative p-12 md:p-20 rounded-3xl border border-[var(--border-subtle)] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] overflow-hidden"
                    >
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.1),transparent_70%)]" />

                        <h2 className="relative text-4xl md:text-5xl font-serif mb-6">
                            Ready to <span className="text-gradient-brand">Transform</span> Your Learning?
                        </h2>
                        <p className="relative text-xl text-[var(--text-secondary)] mb-10 max-w-xl mx-auto">
                            Join thousands of learners building their second brain with Synapse.
                        </p>
                        <SynapseButton
                            onClick={() => navigate(session ? "/app/dashboard" : "/login")}
                            className="relative h-16 px-12 text-xl shadow-[0_0_80px_rgba(0,240,255,0.5)]"
                        >
                            {session ? "Go to Dashboard" : "Get Started Free"}
                            <ArrowRight className="w-6 h-6 ml-3" />
                        </SynapseButton>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-[var(--border-subtle)]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                            <Brain className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold">Synapse</span>
                    </div>
                    <p className="text-sm text-[var(--text-tertiary)]">
                        © 2026 Synapse. Built for learners, by learners.
                    </p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description, gradient, delay, inView }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    gradient: string;
    delay: number;
    inView: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            className="group relative p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-all duration-500 overflow-hidden"
        >
            {/* Hover gradient overlay */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${gradient} mix-blend-soft-light blur-xl`} />

            <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-6 shadow-lg`}>
                    <div className="text-white">{icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
}

function StatCard({ number, label, delay, inView }: { number: string; label: string; delay: number; inView: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay }}
            className="text-center"
        >
            <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent mb-2">
                {number}
            </div>
            <div className="text-[var(--text-secondary)] font-medium">{label}</div>
        </motion.div>
    );
}
