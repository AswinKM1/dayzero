import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Battery, BatteryCharging, BatteryFull } from "lucide-react";
import { clsx } from "clsx";

type EnergyLevel = "low" | "medium" | "high";

interface EnergySelectorProps {
    onSelect: (level: EnergyLevel) => void;
}

export const EnergySelector = ({ onSelect }: EnergySelectorProps) => {
    const [selected, setSelected] = useState<EnergyLevel>("medium");

    const levels: { id: EnergyLevel; label: string; icon: React.ReactNode; desc: string }[] = [
        { id: "low", label: "Recovery", icon: <Battery className="w-5 h-5" />, desc: "Light load." },
        { id: "medium", label: "Focus", icon: <BatteryCharging className="w-5 h-5" />, desc: "Standard flow." },
        { id: "high", label: "Dominion", icon: <BatteryFull className="w-5 h-5" />, desc: "Max intensity." },
    ];

    const handleSelect = (id: EnergyLevel) => {
        setSelected(id);
        onSelect(id);
    };

    return (
        <div className="glass-panel p-6 rounded-3xl w-full">
            <div className="flex items-center gap-2 mb-6 text-zinc-400">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium tracking-wide uppercase">Energy Flux</span>
            </div>

            <div className="flex flex-col gap-3">
                {levels.map((level) => (
                    <div
                        key={level.id}
                        onClick={() => handleSelect(level.id)}
                        className="relative cursor-pointer group"
                    >
                        {selected === level.id && (
                            <motion.div
                                layoutId="active-energy"
                                className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/30 rounded-xl"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}

                        <div className={clsx(
                            "relative z-10 p-4 flex items-center justify-between rounded-xl border border-transparent transition-all duration-300",
                            selected !== level.id && "bg-white/5 hover:bg-white/10 border-white/5",
                        )}>
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "p-2 rounded-lg transition-colors duration-300",
                                    selected === level.id ? "text-indigo-400 bg-indigo-500/20" : "text-zinc-500 bg-white/5 group-hover:text-zinc-300"
                                )}>
                                    {level.icon}
                                </div>
                                <div>
                                    <h3 className={clsx(
                                        "font-medium transition-colors duration-300",
                                        selected === level.id ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                                    )}>
                                        {level.label}
                                    </h3>
                                    <p className="text-xs text-zinc-500">{level.desc}</p>
                                </div>
                            </div>

                            {selected === level.id && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
