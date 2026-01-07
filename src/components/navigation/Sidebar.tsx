import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Brain,
    Users,
    Swords,
    Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { SettingsDialog } from "../dialogs/SettingsDialog";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/app/dashboard" },
    { icon: Brain, label: "Brain", href: "/app/brain" },
    { icon: Users, label: "Rooms", href: "/app/rooms" },
    { icon: Swords, label: "Skills", href: "/app/skills" },
];

export function Sidebar() {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <>
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="fixed left-0 top-0 h-screen w-64 bg-black/60 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col z-50"
            >
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Synapse
                    </span>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "text-white bg-white/10"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white/10 rounded-xl"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className="w-5 h-5 z-10" />
                                    <span className="font-medium z-10">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="pt-6 border-t border-white/10 space-y-2">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
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

