import { motion, type HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

interface SynapseCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
    active?: boolean;
}

export const SynapseCard = ({
    children,
    className,
    hoverEffect = false,
    active = false,
    ...props
}: SynapseCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
                "synapse-card relative overflow-hidden backdrop-blur-sm p-6 group",
                active ? "border-[var(--accent-primary)] shadow-lg shadow-cyan-900/20" : "hover:border-[var(--border-default)]",
                className
            )}
            whileHover={
                hoverEffect
                    ? {
                        y: -4,
                        scale: 1.005,
                        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
                    }
                    : undefined
            }
            {...props}
        >
            {/* Sci-Fi Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[var(--text-tertiary)] opacity-0 group-hover:opacity-50 transition-opacity rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[var(--text-tertiary)] opacity-0 group-hover:opacity-50 transition-opacity rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[var(--text-tertiary)] opacity-0 group-hover:opacity-50 transition-opacity rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[var(--text-tertiary)] opacity-0 group-hover:opacity-50 transition-opacity rounded-br-lg" />

            {/* Subtle Noise Texture Overlay */}
            <div className="absolute inset-0 bg-paper pointer-events-none opacity-50 mix-blend-overlay" />

            {/* Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};
