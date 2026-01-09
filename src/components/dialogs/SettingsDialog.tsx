import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/useAuthStore';
import { supabase } from '../../lib/supabase';
import { User, LogOut, X, Save, Keyboard } from 'lucide-react';
import { SynapseButton } from '../ui/SynapseButton';

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
    const { user, signOut } = useAuthStore();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'shortcuts'>('profile');

    useEffect(() => {
        if (user) {
            setUsername((user as any)?.user_metadata?.username || '');
        }
    }, [user]);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            await signOut();
            onClose();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await supabase.auth.updateUser({
                data: { username }
            });
            // Also update profiles table
            await supabase.from('profiles').update({ username }).eq('id', user.id);
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    key="settings-dialog"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

                    {/* Dialog */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
                            <h2 className="text-xl font-serif text-[var(--text-primary)]">Settings</h2>
                            <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-[var(--border-subtle)]">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'profile' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                <User size={14} className="inline mr-2" />
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('shortcuts')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'shortcuts' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                <Keyboard size={14} className="inline mr-2" />
                                Shortcuts
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {activeTab === 'profile' && (
                                <>
                                    {/* Avatar & Username */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-tertiary)] overflow-hidden">
                                            <User size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-1">Username</label>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-4 py-2 text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                                                placeholder="Enter username"
                                            />
                                        </div>
                                    </div>

                                    {/* Email (Read-only) */}
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-1">Email</label>
                                        <p className="text-[var(--text-secondary)] font-mono text-sm">{user?.email}</p>
                                    </div>

                                    {/* Save Button */}
                                    <SynapseButton onClick={handleSaveProfile} disabled={isSaving} className="w-full" icon={Save}>
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </SynapseButton>
                                </>
                            )}

                            {activeTab === 'shortcuts' && (
                                <div className="space-y-3">
                                    <ShortcutItem keys={['⌘', 'K']} label="Quick Search" />
                                    <ShortcutItem keys={['⌘', '/']} label="Toggle Sidebar" />
                                    <ShortcutItem keys={['⌘', 'B']} label="Open Brain" />
                                    <ShortcutItem keys={['⌘', 'N']} label="New Document" />
                                    <ShortcutItem keys={['Esc']} label="Close Modal" />
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-[var(--border-subtle)] flex justify-between items-center">
                            <p className="text-xs text-[var(--text-tertiary)] font-mono">v2.0.0 • SYNAPSE_CORE</p>
                            <SynapseButton variant="secondary" onClick={handleSignOut} icon={LogOut}>
                                Sign Out
                            </SynapseButton>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

function ShortcutItem({ keys, label }: { keys: string[], label: string }) {
    return (
        <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors">
            <span className="text-sm text-[var(--text-secondary)]">{label}</span>
            <div className="flex gap-1">
                {keys.map((key, i) => (
                    <kbd key={i} className="px-2 py-1 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-tertiary)]">
                        {key}
                    </kbd>
                ))}
            </div>
        </div>
    );
}
