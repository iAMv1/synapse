import { motion, type HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";

interface GlassButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "danger" | "ghost";
    className?: string;
    icon?: ReactNode;
}

export function GlassButton({
    children,
    variant = "primary",
    className,
    icon,
    ...props
}: GlassButtonProps) {
    const variants = {
        primary: "bg-emerald-500/80 hover:bg-emerald-500 text-white shadow-emerald-500/20",
        secondary: "bg-white/10 hover:bg-white/20 text-white",
        danger: "bg-red-500/80 hover:bg-red-500 text-white",
        ghost: "bg-transparent hover:bg-white/5 text-gray-300 hover:text-white border-0 shadow-none backdrop-blur-none",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={twMerge(
                "relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-white/5 shadow-lg backdrop-blur-md",
                variants[variant],
                className
            )}
            {...props}
        >
            {icon && <span className="w-5 h-5">{icon}</span>}
            {children}
        </motion.button>
    );
}
