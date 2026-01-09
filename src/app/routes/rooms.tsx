import { useEffect, useState } from "react";
import { SynapseCard } from "../../components/ui/SynapseCard";
import { SynapseButton } from "../../components/ui/SynapseButton";
import { Plus, Users, Loader2, Key, Copy, Check, Globe, Lock, Sparkles } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import type { Room } from "../../types/database";
import { formatDistanceToNow } from "date-fns";
import { RoomCreateModal } from "../../features/rooms/RoomCreateModal";
import { RoomJoinModal } from "../../features/rooms/RoomJoinModal";

export default function RoomsPage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        fetchRooms();

        // Subscribe to changes
        const subscription = supabase
            .channel('public:rooms')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, fetchRooms)
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchRooms = async () => {
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRooms(data || []);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinRoom = (roomId: string) => {
        navigate(`/app/brain?roomId=${roomId}`);
    };

    const handleCopyCode = async (code: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-[var(--border-subtle)] pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Users size={16} className="text-[var(--text-tertiary)]" />
                        <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-mono">Collaboration</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)]">
                        Neural <span className="text-gradient-brand italic">Rooms</span>
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-2 font-light text-lg">
                        Join or create shared spaces for collective intelligence.
                    </p>
                </div>
                <div className="flex gap-3">
                    <SynapseButton variant="secondary" onClick={() => setShowJoinModal(true)} icon={Key}>
                        Join with Code
                    </SynapseButton>
                    <SynapseButton onClick={() => setShowCreateModal(true)} icon={Plus}>
                        Create Room
                    </SynapseButton>
                </div>
            </div>

            {rooms.length === 0 ? (
                <SynapseCard className="text-center py-20 flex flex-col items-center justify-center border-dashed border-[var(--border-default)] bg-[var(--bg-secondary)]/50">
                    <div className="w-20 h-20 mb-6 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-[var(--text-tertiary)]" />
                    </div>
                    <h3 className="text-2xl font-serif text-[var(--text-primary)] mb-2">No Signal Detected</h3>
                    <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                        The neural network is quiet. Initialize a new communication protocol to begin collaborating.
                    </p>
                    <SynapseButton onClick={() => setShowCreateModal(true)} icon={Plus}>
                        Initialize Room
                    </SynapseButton>
                </SynapseCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <SynapseCard
                            key={room.id}
                            hoverEffect
                            className="cursor-pointer group relative h-full flex flex-col"
                            onClick={() => handleJoinRoom(room.id)}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:border-[var(--accent-primary)]/50">
                                    <Users className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors" />
                                </div>

                                {room.is_public ? (
                                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1.5">
                                        <Globe size={10} />
                                        Public Network
                                    </span>
                                ) : (
                                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20 flex items-center gap-1.5">
                                        <Lock size={10} />
                                        Encrypted
                                    </span>
                                )}
                            </div>

                            <h3 className="text-2xl font-serif text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                                {room.name}
                            </h3>

                            {room.description && (
                                <p className="text-[var(--text-secondary)] text-sm mb-6 line-clamp-2 leading-relaxed font-light">
                                    {room.description}
                                </p>
                            )}

                            <div className="mt-auto pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                                <span className="text-xs text-[var(--text-tertiary)] font-mono">
                                    {formatDistanceToNow(new Date(room.created_at), { addSuffix: true })}
                                </span>

                                {room.invite_code && (
                                    <button
                                        onClick={(e) => handleCopyCode(room.invite_code!, e)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--border-default)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] hover:text-white transition-all group/copy"
                                    >
                                        {copiedCode === room.invite_code ? (
                                            <>
                                                <Check size={12} className="text-[var(--success)]" />
                                                <span className="text-[var(--success)] font-medium">Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={12} className="group-hover/copy:text-[var(--accent-secondary)] transition-colors" />
                                                <span className="font-mono tracking-wider">{room.invite_code}</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </SynapseCard>
                    ))}
                </div>
            )}

            {/* Modals */}
            <RoomCreateModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onRoomCreated={(roomId) => handleJoinRoom(roomId)}
            />
            <RoomJoinModal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                onRoomJoined={(roomId) => handleJoinRoom(roomId)}
            />
        </div>
    );
}

