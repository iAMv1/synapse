import { motion } from "framer-motion";
import { type InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface SynapseInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const SynapseInput = forwardRef<HTMLInputElement, SynapseInputProps>(
    ({ label, error, icon, className, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-xs font-bold text-[var(--text-secondary)] ml-1 uppercase tracking-wider">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <div className="relative flex items-center">
                        {icon && (
                            <div className="absolute left-4 text-[var(--text-tertiary)] pointer-events-none group-focus-within:text-[var(--accent-primary)] transition-colors">
                                {icon}
                            </div>
                        )}
                        <input
                            ref={ref}
                            className={twMerge(
                                "w-full bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition-all duration-200",
                                icon && "pl-11",
                                error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]",
                                className
                            )}
                            {...props}
                        />
                    </div>
                </div>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[var(--error)] text-xs ml-1 font-medium"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        );
    }
);

SynapseInput.displayName = "SynapseInput";
