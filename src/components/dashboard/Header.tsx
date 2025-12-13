import { Flame, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const Header = () => {
    // Mock data for now
    const day = 1;
    const streak = 0;
    const { logout } = useAuth();

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    return (
        <div className="w-full flex items-end justify-between py-6 border-b border-white/5 mb-8">
            <div>
                <h2 className="text-zinc-500 text-sm tracking-widest uppercase mb-1">Protocol Status</h2>
                <h1 className="text-4xl md:text-5xl font-thin text-white tracking-tight">
                    Day <span className="font-normal">{String(day).padStart(2, '0')}</span>
                </h1>
                <p className="text-zinc-500 font-mono text-sm mt-2">{today}</p>
            </div>

            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                <div className="p-1.5 bg-orange-500/10 rounded-full">
                    <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-lg font-bold text-white tabular-nums">{streak}</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Streak</span>
                </div>
            </div>

            <button
                onClick={() => logout()}
                className="ml-4 p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                title="Log Out"
            >
                <LogOut className="w-5 h-5" />
            </button>
        </div>
    );
};
