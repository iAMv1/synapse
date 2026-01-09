import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Globe, Lock } from 'lucide-react';
import { SynapseCard } from '../../components/ui/SynapseCard';
import { SynapseButton } from '../../components/ui/SynapseButton';
import { SynapseInput } from '../../components/ui/SynapseInput';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';

interface RoomCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRoomCreated?: (roomId: string) => void;
}

export function RoomCreateModal({ isOpen, onClose, onRoomCreated }: RoomCreateModalProps) {
    const { user } = useAuthStore();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !name.trim()) return;

        setIsCreating(true);
        setError(null);

        try {
            const { data, error: createError } = await (supabase
                .from('rooms') as any)
                .insert({
                    name: name.trim(),
                    description: description.trim() || null,
                    created_by: user.id,
                    is_public: isPublic,
                })
                .select()
                .single();

            if (createError) throw createError;

            // Reset form
            setName('');
            setDescription('');
            setIsPublic(true);

            onClose();
            if (onRoomCreated && data?.id) {
                onRoomCreated(data.id);
            }
        } catch (err: any) {
            console.error('Error creating room:', err);
            setError(err.message || 'Failed to create room');
        } finally {
            setIsCreating(false);
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
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Create Room</h2>
                                        <p className="text-sm text-gray-400">Start a new collaboration space</p>
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
                            <form onSubmit={handleCreate} className="space-y-5">
                                <SynapseInput
                                    label="Room Name"
                                    placeholder="e.g. React Study Group"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    maxLength={50}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Description (optional)
                                    </label>
                                    <textarea
                                        placeholder="What will this room be about?"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        maxLength={200}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                                    />
                                </div>

                                {/* Visibility Toggle */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                        Visibility
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsPublic(true)}
                                            className={`p-4 rounded-xl border-2 transition-all ${isPublic
                                                ? 'border-emerald-500 bg-emerald-500/10'
                                                : 'border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <Globe className={`w-5 h-5 mx-auto mb-2 ${isPublic ? 'text-emerald-400' : 'text-gray-400'}`} />
                                            <p className={`text-sm font-medium ${isPublic ? 'text-white' : 'text-gray-400'}`}>Public</p>
                                            <p className="text-xs text-gray-500 mt-1">Anyone can join</p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsPublic(false)}
                                            className={`p-4 rounded-xl border-2 transition-all ${!isPublic
                                                ? 'border-amber-500 bg-amber-500/10'
                                                : 'border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <Lock className={`w-5 h-5 mx-auto mb-2 ${!isPublic ? 'text-amber-400' : 'text-gray-400'}`} />
                                            <p className={`text-sm font-medium ${!isPublic ? 'text-white' : 'text-gray-400'}`}>Private</p>
                                            <p className="text-xs text-gray-500 mt-1">Invite only</p>
                                        </button>
                                    </div>
                                </div>

                                {/* Info about invite code */}
                                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <p className="text-xs text-blue-300">
                                        💡 A unique invite code will be generated automatically. Share it to invite members.
                                    </p>
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
                                        loading={isCreating}
                                        disabled={!name.trim()}
                                        className="flex-1"
                                    >
                                        Create Room
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
