import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Lock, Star, Loader2, RefreshCw } from "lucide-react";
import { clsx } from "clsx";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../stores/useAuthStore";
import type { Skill, UserSkill } from "../../types/database";

interface SkillNode extends Skill {
    status: 'locked' | 'unlocked' | 'mastered';
}

// Default seed data with layout positions (UUIDs match database)
const DEFAULT_SKILLS = [
    { id: "f47ac10b-58cc-4372-a567-0e02b2c3d401", label: "Web Basics", category: "frontend", parents: [], x: 50, y: 10 },
    { id: "f47ac10b-58cc-4372-a567-0e02b2c3d402", label: "React", category: "frontend", parents: ["f47ac10b-58cc-4372-a567-0e02b2c3d401"], x: 30, y: 30 },
    { id: "f47ac10b-58cc-4372-a567-0e02b2c3d403", label: "TypeScript", category: "frontend", parents: ["f47ac10b-58cc-4372-a567-0e02b2c3d401"], x: 70, y: 30 },
    { id: "f47ac10b-58cc-4372-a567-0e02b2c3d404", label: "Tailwind", category: "frontend", parents: ["f47ac10b-58cc-4372-a567-0e02b2c3d402"], x: 20, y: 50 },
    { id: "f47ac10b-58cc-4372-a567-0e02b2c3d405", label: "Node.js", category: "backend", parents: ["f47ac10b-58cc-4372-a567-0e02b2c3d403"], x: 60, y: 50 },
    { id: "f47ac10b-58cc-4372-a567-0e02b2c3d406", label: "Database", category: "backend", parents: ["f47ac10b-58cc-4372-a567-0e02b2c3d405"], x: 80, y: 50 },
    { id: "f47ac10b-58cc-4372-a567-0e02b2c3d407", label: "Supabase", category: "backend", parents: ["f47ac10b-58cc-4372-a567-0e02b2c3d406"], x: 80, y: 70 },
    { id: "f47ac10b-58cc-4372-a567-0e02b2c3d408", label: "AI Fundamentals", category: "ai", parents: ["f47ac10b-58cc-4372-a567-0e02b2c3d403"], x: 50, y: 60 },
    { id: "f47ac10b-58cc-4372-a567-0e02b2c3d409", label: "Embeddings", category: "ai", parents: ["f47ac10b-58cc-4372-a567-0e02b2c3d408"], x: 40, y: 80 },
    { id: "f47ac10b-58cc-4372-a567-0e02b2c3d410", label: "RAG", category: "ai", parents: ["f47ac10b-58cc-4372-a567-0e02b2c3d409", "f47ac10b-58cc-4372-a567-0e02b2c3d407"], x: 60, y: 80 },
];

export function SkillTree() {
    const { user } = useAuthStore();
    const [nodes, setNodes] = useState<SkillNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>({});

    useEffect(() => {
        if (user) loadData();
    }, [user]);

    const loadData = async () => {
        try {
            // 1. Fetch Skills
            let { data: fetchedSkills, error: skillsError } = await supabase.from('skills').select('*');
            if (skillsError) throw skillsError;

            let skillsData: Skill[] = (fetchedSkills as Skill[]) || [];

            // 2. Seed if empty
            if (skillsData.length === 0) {
                console.log("Seeding skills...");
                const seedData = DEFAULT_SKILLS.map(({ id, label, category, parents }) => ({
                    id, label, category, parents: parents
                }));
                // Using 'any' cast to bypass strict typing issues with generated types
                const { data: newSkills, error: seedError } = await (supabase.from('skills') as any).insert(seedData).select();
                if (seedError) throw seedError;
                skillsData = (newSkills as Skill[]) || [];
            }

            // 3. Fetch User Progress
            const { data: userSkillsData } = await supabase
                .from('user_skills')
                .select('*')
                .eq('user_id', user!.id);

            // 4. Merge
            const userSkillsMap = new Map(userSkillsData?.map((us: UserSkill) => [us.skill_id, us.status]));

            const mergedNodes: SkillNode[] = (skillsData || []).map((skill: Skill) => {
                // Determine status
                let status: SkillNode['status'] = userSkillsMap.get(skill.id) as any || 'locked';

                // Auto-unlock logic: if not Mastered/Unlocked, check if parents are Mastered
                if (status === 'locked') {
                    // Roots are always unlocked (or if parents empty)
                    if (!skill.parents || skill.parents.length === 0) {
                        status = 'unlocked';
                    } else {
                        // Check if ALL parents are mastered (or just present/unlocked depending on strictness)
                        // For now: require parents to be at least UNLOCKED to see this one, or MASTERED to unlock?
                        // Simplified: If parent is Mastered, child is Unlocked.
                        const parents = (skillsData || []).filter(s => (skill.parents || []).includes(s.id));
                        const allParentsMastered = parents.every(p => userSkillsMap.get(p.id) === 'mastered');
                        if (allParentsMastered) status = 'unlocked';
                    }
                }
                return { ...skill, status };
            });

            setNodes(mergedNodes);

            // Set positions (map from ID to DEFAULT_SKILLS pos or calculate)
            const newPositions: Record<string, { x: number, y: number }> = {};
            mergedNodes.forEach(node => {
                const defaultPos = DEFAULT_SKILLS.find(d => d.id === node.id);
                newPositions[node.id] = defaultPos ? { x: defaultPos.x, y: defaultPos.y } : { x: 50, y: 50 };
            });
            setPositions(newPositions);

        } catch (error) {
            console.error("Error loading skill tree:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnlock = async (id: string) => {
        const node = nodes.find(n => n.id === id);
        if (!node || node.status === 'locked' || node.status === 'mastered' || !user) return;

        // Optimistic update
        setNodes(prev => prev.map(n => n.id === id ? { ...n, status: 'mastered' } : n));

        // Trigger Confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#3b82f6', '#ffffff']
        });

        // Persist
        try {
            await (supabase.from('user_skills') as any).upsert({
                user_id: user.id,
                skill_id: id,
                status: 'mastered',
                xp: 100 // Award XP
            });

            // Reload to unlock children
            loadData();
        } catch (error) {
            console.error("Error saving progress:", error);
        }
    };

    const handleReset = async () => {
        if (!confirm("Reset all skill progress?")) return;
        if (!user) return;
        await supabase.from('user_skills').delete().eq('user_id', user.id);
        loadData();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[600px] bg-black/40 rounded-3xl border border-white/5">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative w-full h-[600px] bg-black/40 rounded-3xl overflow-hidden border border-white/5 group">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

            {/* Reset Button (Hidden unless hover) */}
            <button
                onClick={handleReset}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/20 hover:text-white/60 transition-colors opacity-0 group-hover:opacity-100"
                title="Reset Progress"
            >
                <RefreshCw size={14} />
            </button>

            {/* SVG Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {nodes.map(node =>
                    (node.parents || []).map(parentId => {
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
