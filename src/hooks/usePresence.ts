import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';

export interface PresenceState {
    [key: string]: any;
    user_id: string;
    username: string;
    avatar_url?: string;
    online_at: string;
}

export function usePresence(roomId: string) {
    const { user } = useAuthStore();
    const [onlineUsers, setOnlineUsers] = useState<PresenceState[]>([]);

    useEffect(() => {
        if (!user || !roomId) return;

        const channel = supabase.channel(`room:${roomId}`, {
            config: {
                presence: {
                    key: user.id,
                },
            },
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const newState = channel.presenceState<PresenceState>();
                const users = Object.values(newState).flat();
                // Deduplicate by user_id
                const uniqueUsers = Array.from(new Map(users.map(u => [u.user_id, u])).values());
                setOnlineUsers(uniqueUsers);
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                console.log('User joined:', key, newPresences);
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                console.log('User left:', key, leftPresences);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        user_id: user.id,
                        username: (user.user_metadata as any)?.username || 'Anonymous',
                        avatar_url: (user.user_metadata as any)?.avatar_url,
                        online_at: new Date().toISOString(),
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, [user, roomId]);

    return onlineUsers;
}
