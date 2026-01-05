import { motion } from "framer-motion";
import { type InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
    ({ label, error, icon, className, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium text-gray-400 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <motion.div
                        className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"
                    />
                    <div className="relative flex items-center">
                        {icon && (
                            <div className="absolute left-4 text-gray-400 pointer-events-none">
                                {icon}
                            </div>
                        )}
                        <input
                            ref={ref}
                            className={twMerge(
                                "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-200 backdrop-blur-xl",
                                icon && "pl-11",
                                error && "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50",
                                className
                            )}
                            {...props}
                        />
                    </div>
                </div>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm ml-1"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        );
    }
);

GlassInput.displayName = "GlassInput";
