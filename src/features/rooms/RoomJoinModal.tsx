import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Users } from 'lucide-react';
import { SynapseCard } from '../../components/ui/SynapseCard';
import { SynapseButton } from '../../components/ui/SynapseButton';
import { SynapseInput } from '../../components/ui/SynapseInput';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';

interface RoomJoinModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRoomJoined?: (roomId: string) => void;
}

export function RoomJoinModal({ isOpen, onClose, onRoomJoined }: RoomJoinModalProps) {
    const { user } = useAuthStore();
    const [inviteCode, setInviteCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !inviteCode.trim()) return;

        setIsJoining(true);
        setError(null);

        try {
            // Find room by invite code
            const { data: room, error: findError } = await supabase
                .from('rooms')
                .select('id, name')
                .eq('invite_code', inviteCode.trim().toUpperCase())
                .single();

            if (findError || !room) {
                throw new Error('Room not found. Please check the invite code.');
            }

            // Add user as member
            const { error: joinError } = await (supabase
                .from('room_members') as any)
                .insert({
                    room_id: room.id,
                    user_id: user.id,
                    role: 'member',
                });

            if (joinError) {
                if (joinError.code === '23505') {
                    // Already a member
                    setError('You are already a member of this room');
                } else {
                    throw joinError;
                }
            } else {
                setInviteCode('');
                onClose();
                if (onRoomJoined) {
                    onRoomJoined(room.id);
                }
            }
        } catch (err: any) {
            console.error('Error joining room:', err);
            setError(err.message || 'Failed to join room');
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SynapseCard className="relative">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
                                        <Key className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Join Room</h2>
                                        <p className="text-sm text-gray-400">Enter an invite code</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleJoin} className="space-y-5">
                                <SynapseInput
                                    label="Invite Code"
                                    placeholder="e.g. SYN-X4K"
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                    required
                                    maxLength={10}
                                    className="text-center tracking-widest font-mono text-lg"
                                />

                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Users className="w-4 h-4" />
                                        <span>Ask the room owner for their invite code</span>
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <SynapseButton
                                        type="button"
                                        variant="ghost"
                                        onClick={onClose}
                                        className="flex-1"
                                    >
                                        Cancel
                                    </SynapseButton>
                                    <SynapseButton
                                        type="submit"
                                        loading={isJoining}
                                        disabled={!inviteCode.trim()}
                                        className="flex-1"
                                    >
                                        Join Room
                                    </SynapseButton>
                                </div>
                            </form>
                        </SynapseCard>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
