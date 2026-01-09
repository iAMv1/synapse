import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Brain,
    Users,
    Swords,
    Settings,
    PanelLeftClose,
    PanelLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { SettingsDialog } from "../dialogs/SettingsDialog";
import { useState } from "react";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/app/dashboard" },
    { icon: Brain, label: "Brain", href: "/app/brain" },
    { icon: Users, label: "Rooms", href: "/app/rooms" },
    { icon: Swords, label: "Skills", href: "/app/skills" },
];

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <>
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 72 : 256 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 h-screen bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-r border-[var(--border-subtle)] flex flex-col z-50 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)]">
                    <AnimatePresence mode="popLayout">
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-3"
                            >
                                <img src="/assets/logo.png" alt="Synapse" className="w-8 h-8 rounded-full border border-[var(--accent-primary)]/30" />
                                <span className="text-lg font-bold tracking-tighter text-[var(--text-primary)]">
                                    SYNAPSE
                                </span>
                            </motion.div>
                        )}
                        {isCollapsed && (
                            <img src="/assets/logo.png" alt="Synapse" className="w-8 h-8 rounded-full border border-[var(--accent-primary)]/30" />
                        )}
                    </AnimatePresence>

                    <button
                        onClick={onToggle}
                        className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "text-[var(--text-primary)] bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[var(--accent-primary)] rounded-r-full"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className={clsx("w-5 h-5 flex-shrink-0", isActive && "text-[var(--accent-primary)]")} />
                                    <AnimatePresence mode="popLayout">
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: "auto" }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="font-medium text-sm whitespace-nowrap overflow-hidden"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-[var(--border-subtle)]">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                    >
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        <AnimatePresence mode="popLayout">
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="font-medium text-sm whitespace-nowrap overflow-hidden"
                                >
                                    Settings
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.aside>

            <SettingsDialog
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />
        </>
    );
}
