import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Target, Calendar } from "lucide-react";
import { clsx } from "clsx";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const location = useLocation();

    const tabs = [
        { name: "Command", path: "/dashboard", icon: Home },
        { name: "Missions", path: "/goals", icon: Target },
        { name: "Log", path: "/history", icon: Calendar },
    ];

    return (
        <div className="min-h-screen bg-black text-white relative flex">
            {/* Desktop Sidebar (Hidden on Mobile) */}
            <aside className="hidden md:flex flex-col w-64 border-r border-white/10 h-screen sticky top-0 bg-black/50 backdrop-blur-xl p-6">
                <div className="mb-12">
                    <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
                        DAYZERO
                    </h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {tabs.map((tab) => {
                        const isActive = location.pathname === tab.path;
                        return (
                            <Link
                                key={tab.path}
                                to={tab.path}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                    isActive
                                        ? "bg-white/10 text-white"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                                )}
                            >
                                <tab.icon className={clsx("w-5 h-5", isActive ? "text-indigo-400" : "text-current")} />
                                <span className="font-medium">{tab.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen pb-24 md:pb-0 relative overflow-x-hidden">
                {children}
            </main>

            {/* Mobile Bottom Navigation (Hidden on Desktop) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-900 border-t border-indigo-500 pb-2 pt-2 px-6 flex justify-between items-center z-[99999] shadow-2xl">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={clsx(
                                "flex flex-col items-center gap-1 p-2 transition-colors min-w-[64px]",
                                isActive ? "text-indigo-400" : "text-zinc-600 hover:text-zinc-400"
                            )}
                        >
                            <tab.icon className={clsx("w-6 h-6 transition-transform", isActive && "scale-110")} />
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
