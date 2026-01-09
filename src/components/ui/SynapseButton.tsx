import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface SynapseButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ElementType;
    children?: ReactNode;
}

export const SynapseButton = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    disabled,
    ...props
}: SynapseButtonProps) => {

    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl overflow-hidden";

    const variants = {
        primary: "btn-primary border border-white/10",
        secondary: "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white",
        ghost: "hover:bg-white/5 text-gray-400 hover:text-white",
        danger: "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs gap-1.5",
        md: "px-5 py-2.5 text-sm gap-2",
        lg: "px-8 py-3.5 text-base gap-3"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className={clsx(
                baseStyles,
                variants[variant],
                sizes[size],
                (disabled || loading) && "opacity-50 cursor-not-allowed",
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!loading && Icon && <Icon className="w-4 h-4" />}
            <span>{children}</span>
        </motion.button>
    );
};
