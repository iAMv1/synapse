import { motion } from "framer-motion";

import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassCard({ children, className, hoverEffect = false }: GlassCardProps) {
    return (
        <motion.div
            className={twMerge(
                "glass rounded-2xl p-6 border border-white/10",
                hoverEffect && "glass-hover cursor-pointer",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={hoverEffect ? { scale: 1.02 } : {}}
        >
            {children}
        </motion.div>
    );
}
