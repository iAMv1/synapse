import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Lock, Star } from "lucide-react";
import { clsx } from "clsx";

// Mock Data (in real app, fetch from DB)
const skills = [
    { id: "1", label: "React Basics", category: "frontend", parents: [], status: "mastered" },
    { id: "2", label: "State Management", category: "frontend", parents: ["1"], status: "unlocked" },
    { id: "3", label: "Supabase", category: "backend", parents: ["1"], status: "locked" },
    { id: "4", label: "Vector Embeddings", category: "ai", parents: ["3"], status: "locked" },
];

export function SkillTree() {
    const [nodes, setNodes] = useState(skills);

    const handleUnlock = (id: string) => {
        const node = nodes.find(n => n.id === id);
        if (!node || node.status === 'locked' || node.status === 'mastered') return;

        // Trigger Confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#3b82f6', '#ffffff']
        });

        // Update Status
        setNodes(prev => prev.map(n => {
            if (n.id === id) return { ...n, status: 'mastered' };
            // Unlock children if all parents mastered (simplified logic)
            if (n.parents.includes(id)) return { ...n, status: 'unlocked' };
            return n;
        }));
    };

    // Simple layout calculation (hardcoded for demo, normally use Dagre)
    const positions: Record<string, { x: number, y: number }> = {
        "1": { x: 50, y: 10 },
        "2": { x: 30, y: 40 },
        "3": { x: 70, y: 40 },
        "4": { x: 70, y: 70 },
    };

    return (
        <div className="relative w-full h-[600px] bg-black/40 rounded-3xl overflow-hidden border border-white/5">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

            {/* SVG Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {nodes.map(node =>
                    node.parents.map(parentId => {
                        const start = positions[parentId];
                        const end = positions[node.id];
                        if (!start || !end) return null;
                        return (
                            <motion.line
                                key={`${parentId}-${node.id}`}
                                x1={`${start.x}%`}
                                y1={`${start.y}%`}
                                x2={`${end.x}%`}
                                y2={`${end.y}%`}
                                stroke={node.status === 'locked' ? '#333' : '#10b981'}
                                strokeWidth="2"
                                strokeDasharray={node.status === 'locked' ? "5,5" : "0"}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        );
                    })
                )}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
                const pos = positions[node.id];
                if (!pos) return null;

                return (
                    <motion.div
                        key={node.id}
                        className={clsx(
                            "absolute w-32 h-32 -ml-16 -mt-16 flex flex-col items-center justify-center rounded-full border-2 transition-colors duration-300 cursor-pointer backdrop-blur-md",
                            node.status === 'mastered' && "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]",
                            node.status === 'unlocked' && "bg-white/5 border-white/50 text-white hover:border-emerald-400 hover:text-emerald-400",
                            node.status === 'locked' && "bg-black/60 border-white/10 text-gray-600 grayscale"
                        )}
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        onClick={() => handleUnlock(node.id)}
                        whileHover={node.status !== 'locked' ? { scale: 1.1 } : {}}
                        whileTap={node.status !== 'locked' ? { scale: 0.95 } : {}}
                    >
                        <div className="mb-2">
                            {node.status === 'mastered' ? <Star className="fill-current w-6 h-6" /> :
                                node.status === 'locked' ? <Lock className="w-6 h-6" /> :
                                    <div className="w-4 h-4 rounded-full bg-white/20 animate-pulse" />}
                        </div>
                        <span className="text-xs font-bold text-center px-2">{node.label}</span>
                    </motion.div>
                );
            })}
        </div>
    );
}
