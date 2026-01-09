import { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sidebar } from "../../components/navigation/Sidebar";
import { useAuthStore } from "../../stores/useAuthStore";
import { TerminalLoader } from "../../components/ui/TerminalLoader";

export default function AppLayout() {
    const { session, isLoading } = useAuthStore();
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    if (isLoading) {
        return <TerminalLoader text="AUTHENTICATING_USER..." />;
    }

    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[var(--accent-primary)] selection:text-white relative overflow-hidden">
            {/* Ambient Background Gradient (Subtle) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent-primary)] opacity-[0.03] blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--accent-tertiary)] opacity-[0.03] blur-[120px]" />
            </div>

            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <motion.main
                initial={false}
                animate={{ paddingLeft: isSidebarCollapsed ? 72 : 256 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="min-h-screen relative z-10"
            >
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 bg-paper opacity-50 pointer-events-none mix-blend-overlay" />

                <div className="p-8 max-w-7xl mx-auto pt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Outlet />
                </div>
            </motion.main>
        </div>
    );
}
