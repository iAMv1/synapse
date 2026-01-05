import { GlassCard } from "../../components/ui/GlassCard";
import { ChatInterface } from "../../features/brain/ChatInterface";

export default function BrainPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                        The Brain
                    </h1>
                    <p className="text-gray-400">Collaborative Knowledge Base & AI Assistant</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Knowledge Graph / Documents Space (Placeholder for now) */}
                <GlassCard className="lg:col-span-1 h-[600px] flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4">Knowledge Base</h3>
                    <div className="flex-1 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 border-dashed">
                        <p className="text-gray-500 text-sm">Document RAG Index (Empty)</p>
                    </div>
                </GlassCard>

                {/* Chat Interface */}
                <GlassCard className="lg:col-span-2">
                    <ChatInterface />
                </GlassCard>
            </div>
        </div>
    );
}
