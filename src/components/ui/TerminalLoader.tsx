import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TerminalLoaderProps {
    text?: string;
    variant?: "fullscreen" | "inset";
}

const LOADING_STATES = [
    "INITIALIZING_NEURAL_LINK...",
    "SYNCHRONIZING_DATABASES...",
    "GENERATING_TOKENS...",
    "CALIBRATING_SENSORS...",
    "ESTABLISHING_SECURE_CHANNEL...",
];

export const TerminalLoader = ({ text, variant = "fullscreen" }: TerminalLoaderProps) => {
    const [currentText, setCurrentText] = useState(text || LOADING_STATES[0]);
    const [dots, setDots] = useState("");

    // Cycle through loading states if no static text provided
    useEffect(() => {
        if (text) return;

        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % LOADING_STATES.length;
            setCurrentText(LOADING_STATES[index]);
        }, 2000);

        return () => clearInterval(interval);
    }, [text]);

    // Typing effect for dots
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? "" : prev + ".");
        }, 400);
        return () => clearInterval(interval);
    }, []);

    const content = (
        <div className="flex flex-col items-center justify-center font-mono relative z-10">
            {/* Glitchy Text Effect */}
            <motion.div
                key={currentText}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[var(--accent-primary)] text-sm md:text-base tracking-widest font-bold uppercase flex items-center gap-2"
            >
                <span className="w-2 h-2 bg-[var(--accent-primary)] animate-pulse" />
                {currentText.replace('...', '')}{dots}
                <span className="animate-pulse">_</span>
            </motion.div>

            {/* Sub-status (tech decoration) */}
            <div className="mt-2 flex gap-1 items-center opacity-50 text-[10px] text-[var(--text-tertiary)]">
                <span>MEM: {Math.floor(Math.random() * 1000)}MB</span>
                <span>|</span>
                <span>CPU: {Math.floor(Math.random() * 100)}%</span>
            </div>
        </div>
    );

    if (variant === "inset") {
        return (
            <div className="flex items-center justify-center p-8 bg-black/20 rounded-xl border border-[var(--border-subtle)] backdrop-blur-sm">
                {content}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-secondary)] rounded-full blur-[300px] opacity-10 animate-pulse" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>
            {content}
        </div>
    );
};
