
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassDialog } from '../ui/GlassDialog';
import { GlassButton } from '../ui/GlassButton';
import { useAuthStore } from '../../stores/useAuthStore';
import { supabase } from '../../lib/supabase';
import { User, LogOut } from 'lucide-react';

interface SettingsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
    const { user, signOut } = useAuthStore();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            await signOut(); // Clear store state
            onClose();
            console.log('Redirecting to login...');
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <GlassDialog
            isOpen={isOpen}
            onClose={onClose}
            title="Settings"
            footer={
                <div className="flex justify-end gap-2">
                    <GlassButton variant="ghost" onClick={onClose}>
                        Cancel
                    </GlassButton>
                    <GlassButton variant="danger" onClick={handleSignOut} className="flex items-center gap-2">
                        <LogOut size={16} />
                        Sign Out
                    </GlassButton>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Profile Section */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-white/50">
                        {/* Placeholder for Avatar */}
                        <User size={32} />
                    </div>
                    <div>
                        <h3 className="text-white font-medium text-lg">
                            {(user as any)?.user_metadata?.username || 'User'}
                        </h3>
                        <p className="text-white/50 text-sm">
                            {user?.email}
                        </p>
                    </div>
                </div>

                <div className="h-px bg-white/10" />

                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white/70 uppercase tracking-wider">Preferences</h4>
                    <p className="text-white/40 text-sm italic">
                        Theme and notification settings coming soon.
                    </p>
                </div>
            </div>
        </GlassDialog>
    );
};
