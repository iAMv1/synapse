import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/navigation/Sidebar";

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Sidebar />
            <main className="pl-64 min-h-screen relative">
                {/* Background Beams/Effects could go here */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                <div className="p-8 max-w-7xl mx-auto pt-12">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
