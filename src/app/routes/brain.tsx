import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, BookOpen, MessageSquare, PenTool, ChevronLeft, ChevronRight, PanelRightClose, PanelRight } from "lucide-react";

import { ChatInterface } from "../../features/brain/ChatInterface";
import { DocumentUpload } from "../../features/documents/upload/DocumentUpload";
import { SharedNote } from "../../features/collaboration/SharedNote";
import { RoomSelector } from "../../components/ui/RoomSelector";
import { usePresence } from "../../hooks/usePresence";
import { useLLMStore, AVAILABLE_MODELS } from "../../stores/useLLMStore";

export default function BrainPage() {
    const [searchParams] = useSearchParams();
    const roomId = searchParams.get('roomId');
    const onlineUsers = usePresence(roomId || '');
    const { selectedModel } = useLLMStore();
    const activeModelName = AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name || 'Synapse AI';

    // Collapsible panel states
    const [isSourcesOpen, setIsSourcesOpen] = useState(true);
    const [isStudioOpen, setIsStudioOpen] = useState(true);

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col gap-3">
            {/* Header Pod - Glassmorphic HUD */}
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--border-subtle)] rounded-2xl shadow-xl shadow-black/20">
                <div className="flex items-center gap-4">
                    {/* Session Indicator */}
                    <div className="flex items-center gap-3 pr-4 border-r border-[var(--border-subtle)]">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center shadow-inner">
                            <Users size={14} className="text-[var(--text-secondary)]" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
                                {roomId ? 'NEURAL_SESSION' : 'WORKSPACE_LOCAL'}
                            </h2>
                            <span className="text-[10px] text-[var(--accent-success)] font-mono flex items-center gap-1.5 uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] shadow-[0_0_8px_var(--success)] animate-pulse" />
                                {onlineUsers.length > 0 ? `${onlineUsers.length} NODES_ACTIVE` : 'STANDBY'}
                            </span>
                        </div>
                    </div>

                    {/* Model Indicator */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-secondary)]" />
                        <span className="text-xs font-mono text-[var(--text-secondary)]">MODEL:</span>
                        <span className="text-xs font-bold text-[var(--text-primary)]">{activeModelName}</span>
                    </div>
                </div>

                {/* User Avatars & Controls */}
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {roomId && onlineUsers.slice(0, 3).map((u) => (
                            <div
                                key={u.user_id}
                                className="w-8 h-8 rounded-full border-2 border-[var(--bg-secondary)] bg-[var(--bg-elevated)] flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)] shadow-sm"
                                title={u.username}
                            >
                                {u.avatar_url ? (
                                    <img src={u.avatar_url} alt={u.username} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    u.username.charAt(0).toUpperCase()
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="h-8 w-[1px] bg-[var(--border-subtle)] mx-2" />
                    <RoomSelector
                        currentRoomId={roomId}
                        onSelectRoom={(id) => {
                            const params = new URLSearchParams(searchParams);
                            if (id) params.set('roomId', id);
                            else params.delete('roomId');
                            window.location.search = params.toString();
                        }}
                    />
                </div>
            </div>

            {/* Main Workspace - Flexbox Layout */}
            <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">

                {/* Sources Panel - Collapsible Left */}
                <AnimatePresence initial={false}>
                    {isSourcesOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 240, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="flex-shrink-0 h-full bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)] rounded-xl overflow-hidden flex flex-col"
                        >
                            <div className="px-3 py-2 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-secondary)]">
                                <div className="flex items-center gap-2">
                                    <BookOpen size={14} className="text-[var(--accent-secondary)]" />
                                    <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Sources</h3>
                                </div>
                                <button onClick={() => setIsSourcesOpen(false)} className="p-1 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-tertiary)]">
                                    <ChevronLeft size={14} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                                <DocumentUpload />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toggle Button for Sources (when collapsed) */}
                {!isSourcesOpen && (
                    <button
                        onClick={() => setIsSourcesOpen(true)}
                        className="flex-shrink-0 w-10 h-full bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)] rounded-xl flex items-center justify-center hover:bg-[var(--bg-elevated)] transition-colors group"
                    >
                        <ChevronRight size={16} className="text-[var(--text-tertiary)] group-hover:text-[var(--accent-secondary)]" />
                    </button>
                )}

                {/* Chat Panel - Expands to fill available space */}
                <div className="flex-1 min-w-0 bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)] rounded-xl overflow-hidden flex flex-col">
                    <div className="px-4 py-2 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-secondary)]">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={14} className="text-[var(--accent-primary)]" />
                            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Neural Chat</h3>
                        </div>
                        <div className="flex items-center gap-1">
                            {!isSourcesOpen && (
                                <button onClick={() => setIsSourcesOpen(true)} className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-tertiary)] hover:text-[var(--accent-secondary)]" title="Show Sources">
                                    <BookOpen size={14} />
                                </button>
                            )}
                            <button
                                onClick={() => setIsStudioOpen(!isStudioOpen)}
                                className="p-1.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-tertiary)] hover:text-[var(--accent-tertiary)]"
                                title={isStudioOpen ? "Hide Studio" : "Show Studio"}
                            >
                                {isStudioOpen ? <PanelRightClose size={14} /> : <PanelRight size={14} />}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <ChatInterface />
                    </div>
                </div>

                {/* Studio Panel - Collapsible Right */}
                <AnimatePresence initial={false}>
                    {isStudioOpen && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 320, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="flex-shrink-0 h-full bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)] rounded-xl overflow-hidden flex flex-col"
                        >
                            <div className="px-3 py-2 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-secondary)]">
                                <div className="flex items-center gap-2">
                                    <PenTool size={14} className="text-[var(--accent-tertiary)]" />
                                    <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Studio</h3>
                                </div>
                                <button onClick={() => setIsStudioOpen(false)} className="p-1 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-tertiary)]">
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {roomId ? (
                                    <SharedNote roomId={roomId} />
                                ) : (
                                    <div className="p-6 text-center flex flex-col items-center justify-center h-full text-[var(--text-tertiary)]">
                                        <PenTool size={32} className="mb-3 opacity-20" />
                                        <p className="text-sm">Select a room for notes</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
