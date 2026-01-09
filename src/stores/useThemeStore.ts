import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const backgroundOptions = [
    { id: 'neural-blue', name: 'Neural Blue', path: '/backgrounds/background_neural_blue_1767893709073.png' },
    { id: 'cyber-emerald', name: 'Cyber Emerald', path: '/backgrounds/background_cyber_emerald_1767893730849.png' },
    { id: 'cosmic-plexus', name: 'Cosmic Plexus', path: '/backgrounds/background_cosmic_plexus_1767893751603.png' },
    { id: 'liquid-gold', name: 'Liquid Gold', path: '/backgrounds/background_liquid_gold_1767893768827.png' },
] as const;

export type BackgroundId = typeof backgroundOptions[number]['id'];

interface ThemeStore {
    backgroundId: BackgroundId;
    setBackground: (id: BackgroundId) => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            backgroundId: 'cosmic-plexus',
            setBackground: (id) => set({ backgroundId: id }),
        }),
        {
            name: 'synapse-theme-storage',
        }
    )
);
