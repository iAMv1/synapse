import { GlassCard } from "../../components/ui/GlassCard";
import { GlassButton } from "../../components/ui/GlassButton";
import { Plus } from "lucide-react";

export default function RoomsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                        Rooms
                    </h1>
                    <p className="text-gray-400">Join active collaboration spaces.</p>
                </div>
                <GlassButton>
                    <Plus className="w-4 h-4 mr-2" /> New Room
                </GlassButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <GlassCard key={i} hoverEffect className="cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10" />
                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Active
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">
                            Engineering Huddle {i}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Discussing the new architecture and pillars.
                        </p>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(u => (
                                <div key={u} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-black" />
                            ))}
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
}
