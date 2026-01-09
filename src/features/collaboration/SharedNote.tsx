import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import { Loader2, Cloud, CheckCircle2 } from 'lucide-react';

interface SharedNoteProps {
    roomId: string;
}

export function SharedNote({ roomId }: SharedNoteProps) {
    const { user } = useAuthStore();
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lastSavedContent, setLastSavedContent] = useState('');

    // Load initial content
    useEffect(() => {
        if (!roomId) return;

        const loadNote = async () => {
            setIsLoading(true);
            try {
                // Try to find existing note
                let { data, error } = await (supabase
                    .from('room_notes') as any)
                    .select('content')
                    .eq('room_id', roomId)
                    .single();

                if (error && error.code === 'PGRST116') {
                    // Not found, create one
                    const { data: newData, error: createError } = await (supabase
                        .from('room_notes') as any)
                        .insert({ room_id: roomId, content: '' })
                        .select()
                        .single();

                    if (createError) throw createError;
                    data = newData;
                }

                if (data) {
                    setContent(data.content || '');
                    setLastSavedContent(data.content || '');
                }
            } catch (error) {
                console.error('Error loading note:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadNote();
    }, [roomId]);

    // Real-time Subscription
    useEffect(() => {
        if (!roomId) return;

        const channel = supabase.channel(`note:${roomId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'room_notes',
                    filter: `room_id=eq.${roomId}`
                },
                (payload: any) => {
                    const newContent = payload.new.content;
                    if (newContent !== content) {
                        setContent(newContent);
                        setLastSavedContent(newContent);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, content]);

    // Autosave Logic (Debounced)
    useEffect(() => {
        if (content === lastSavedContent) return;
        if (!user) return;

        const timer = setTimeout(async () => {
            setIsSaving(true);
            try {
                await (supabase
                    .from('room_notes') as any)
                    .update({ content, updated_at: new Date().toISOString() })
                    .eq('room_id', roomId);
                setLastSavedContent(content);
            } catch (error) {
                console.error('Error saving note:', error);
            } finally {
                setIsSaving(false);
            }
        }, 1000); // 1s debounce

        return () => clearTimeout(timer);
    }, [content, lastSavedContent, roomId, user]);

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[var(--accent-primary)]" /></div>;
    }

    return (
        <div className="flex flex-col h-full bg-[var(--bg-elevated)]/20">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type here to collaborate with your team..."
                className="flex-1 w-full bg-transparent p-6 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] resize-none focus:outline-none font-mono text-sm leading-relaxed custom-scrollbar"
            />

            {/* Status Bar */}
            <div className="px-4 py-2 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]/50 flex items-center justification-between text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider font-mono">
                <div className="flex items-center gap-2">
                    {isSaving ? (
                        <>
                            <Loader2 size={10} className="animate-spin text-[var(--accent-primary)]" />
                            <span>Syncing to Neural Core...</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle2 size={10} className="text-[var(--success)]" />
                            <span>Synced</span>
                        </>
                    )}
                </div>
                <div className="ml-auto flex items-center gap-1 opacity-50">
                    <Cloud size={10} />
                    <span>Real-time</span>
                </div>
            </div>
        </div>
    );
}
