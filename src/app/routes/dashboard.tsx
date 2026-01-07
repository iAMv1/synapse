
import { motion } from "framer-motion";
import { GlassCard } from "../../components/ui/GlassCard";
import { useAuthStore } from "../../stores/useAuthStore";
import {
    LayoutDashboard,
    Upload,
    Brain,
    Trophy,
    Clock,
    ArrowRight,
    FileText
} from "lucide-react";
import { GlassButton } from "../../components/ui/GlassButton";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    // Placeholder data
    const stats = [
        { label: "Knowledge Base", value: "12 Docs", icon: FileText, color: "text-blue-400" },
        { label: "Brain Power", value: "Level 3", icon: Brain, color: "text-purple-400" },
        { label: "XP Gained", value: "1,250", icon: Trophy, color: "text-amber-400" },
    ];

    const recentActivity = [
        { id: 1, action: "Uploaded Document", target: "React_Patterns.pdf", time: "2 hours ago", icon: Upload },
        { id: 2, action: "Completed Quiz", target: "System Design Basics", time: "5 hours ago", icon: Trophy },
        { id: 3, action: "Chat Session", target: "Understanding RAG", time: "Yesterday", icon: Brain },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Header */}
            <motion.div variants={item} className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, <span className="text-emerald-400">{(user as any)?.user_metadata?.username || 'Architect'}</span>
                    </h1>
                    <p className="text-gray-400">Here's what's happening in your neural network today.</p>
                </div>
                <div className="flex gap-3">
                    <GlassButton
                        variant="primary"
                        onClick={() => navigate('/app/brain')}
                        className="flex items-center gap-2"
                    >
                        <Brain size={18} />
                        Open Brain
                    </GlassButton>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div key={index} variants={item}>
                        <GlassCard className="p-6 flex items-center gap-4 group hover:bg-white/10 transition-colors">
                            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <motion.div variants={item} className="lg:col-span-2">
                    <GlassCard className="h-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-emerald-400" />
                                Recent Activity
                            </h3>
                            <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                    <div className="w-10 h-10 rounded-full bg-black/20 flex items-center justify-center text-gray-400">
                                        <activity.icon size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium text-sm">{activity.action}</p>
                                        <p className="text-gray-400 text-xs">{activity.target}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/10 text-center">
                            <p className="text-xs text-gray-500 italic">Synchronizing neural pathways...</p>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Quick Actions / Suggestions */}
                <motion.div variants={item}>
                    <GlassCard className="h-full p-6 flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <LayoutDashboard className="w-5 h-5 text-emerald-400" />
                            Quick Actions
                        </h3>
                        <div className="space-y-3 flex-1">
                            <GlassButton variant="secondary" className="w-full justify-between group" onClick={() => navigate('/app/brain')}>
                                <span>Upload Document</span>
                                <Upload size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                            </GlassButton>
                            <GlassButton variant="secondary" className="w-full justify-between group" onClick={() => navigate('/app/skills')}>
                                <span>Take a Quiz</span>
                                <Trophy size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                            </GlassButton>
                            <GlassButton variant="secondary" className="w-full justify-between group" onClick={() => navigate('/app/rooms')}>
                                <span>Join Room</span>
                                <ArrowRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                            </GlassButton>
                        </div>

                        <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10">
                            <p className="text-xs text-emerald-200 font-medium mb-1">Daily Tip</p>
                            <p className="text-sm text-white/80">Connect your knowledge nodes by linking documents in the Brain view.</p>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </motion.div>
    );
}
