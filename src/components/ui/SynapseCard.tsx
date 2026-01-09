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
                "synapse-card relative overflow-hidden backdrop-blur-sm p-6",
                active && "border-[var(--accent-primary)] shadow-lg shadow-orange-900/20",
                className
            )}
            whileHover={
                hoverEffect
                    ? {
                        y: -4,
                        scale: 1.005,
                        borderColor: "var(--border-strong)",
                        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
                    }
                    : undefined
            }
            {...props}
        >
            {/* Subtle Noise Texture Overlay */}
            <div className="absolute inset-0 bg-paper pointer-events-none opacity-50 mix-blend-overlay" />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};
