import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronDown, Users, Wifi } from 'lucide-react';
import { clsx } from 'clsx';
import type { Room } from '../../types/database';

interface RoomSelectorProps {
    currentRoomId: string | null;
    onSelectRoom: (roomId: string | null) => void;
}

export function RoomSelector({ currentRoomId, onSelectRoom }: RoomSelectorProps) {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchRooms() {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .order('name', { ascending: true });

            if (!error && data) {
                setRooms(data);
            }
            setIsLoading(false);
        }
        fetchRooms();
    }, []);

    const currentRoom = rooms.find(r => r.id === currentRoomId);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] text-xs text-[var(--text-secondary)] hover:text-white transition-all"
            >
                {currentRoom ? (
                    <>
                        <Wifi size={12} className="text-[var(--success)]" />
                        <span className="font-mono">{currentRoom.name}</span>
                    </>
                ) : (
                    <>
                        <Users size={12} />
                        <span>Select Room</span>
                    </>
                )}
                <ChevronDown size={12} className={clsx("transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-[var(--border-subtle)]">
                        <p className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)] font-bold px-2">Connect to Room</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1">
                        {/* Personal Workspace Option */}
                        <button
                            onClick={() => { onSelectRoom(null); setIsOpen(false); }}
                            className={clsx(
                                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors",
                                !currentRoomId
                                    ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-white"
                            )}
                        >
                            <Users size={14} />
                            <span>Personal Workspace</span>
                        </button>

                        {/* Divider */}
                        <div className="h-px bg-[var(--border-subtle)] my-1" />

                        {isLoading ? (
                            <p className="text-xs text-[var(--text-tertiary)] px-3 py-2">Loading rooms...</p>
                        ) : rooms.length === 0 ? (
                            <p className="text-xs text-[var(--text-tertiary)] px-3 py-2">No rooms available.</p>
                        ) : (
                            rooms.map((room) => (
                                <button
                                    key={room.id}
                                    onClick={() => { onSelectRoom(room.id); setIsOpen(false); }}
                                    className={clsx(
                                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors",
                                        currentRoomId === room.id
                                            ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]"
                                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-white"
                                    )}
                                >
                                    <Wifi size={14} className={currentRoomId === room.id ? "text-[var(--success)]" : ""} />
                                    <span className="truncate">{room.name}</span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
