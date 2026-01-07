import { GlassCard } from "../../components/ui/GlassCard";
import { ChatInterface } from "../../features/brain/ChatInterface";
import { DocumentUpload } from "../../features/documents/upload/DocumentUpload";

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
                {/* Knowledge Graph / Documents Space */}
                <div className="lg:col-span-1 h-[600px]">
                    <DocumentUpload />
                </div>

                {/* Chat Interface */}
                <GlassCard className="lg:col-span-2 h-[600px] flex flex-col">
                    <ChatInterface />
                </GlassCard>
            </div>
        </div>
    );
}
