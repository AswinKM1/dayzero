import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";

export interface Task {
    time: string;
    task: string;
    type: "work" | "break" | "boss_fight";
    completed?: boolean;
}

interface TaskLedgerProps {
    onGenerate: () => void;
    loading?: boolean;
    tasks?: Task[];
    onTaskComplete?: (index: number) => void;
}

export const TaskLedger = ({ onGenerate, loading = false, tasks = [], onTaskComplete }: TaskLedgerProps) => {

    if (!tasks || tasks.length === 0) {
        return (
            <div className="glass-panel p-8 rounded-3xl w-full h-[500px] flex flex-col items-center justify-center text-center relative overflow-hidden">

                {/* Background decorative elements */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                </div>

                <div className="z-10 space-y-6 max-w-md">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10 shadow-lg">
                        <Terminal className="w-8 h-8 text-indigo-400" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-light text-white">Your Schedule is Offline</h3>
                        <p className="text-zinc-400">Initialize the AI to generate your daily protocol based on your current energy flux.</p>
                    </div>

                    <motion.button
                        onClick={onGenerate}
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className={clsx(
                            "group relative px-8 py-4 rounded-xl font-medium tracking-wide shadow-xl transition-all overflow-hidden",
                            loading ? "bg-zinc-700 cursor-not-allowed text-zinc-400" : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20"
                        )}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-zinc-400 border-t-transparent" />
                                    Generating Sequence...
                                </>
                            ) : (
                                <>
                                    <Cpu className="w-4 h-4" />
                                    Initialize Protocol
                                </>
                            )}
                        </span>
                        {/* Shimmer effect only when not loading */}
                        {!loading && <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />}
                    </motion.button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <AnimatePresence mode="popLayout">
                {tasks.map((task, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        layout
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={clsx(
                            "group relative p-5 rounded-2xl border backdrop-blur-md transition-all duration-300",
                            task.type === "boss_fight"
                                ? "bg-red-500/5 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10"
                                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10",
                            task.completed && "opacity-50 grayscale"
                        )}
                    >
                        {/* Boss Mode Glow */}
                        {task.type === "boss_fight" && !task.completed && (
                            <div className="absolute inset-0 bg-red-500/5 rounded-2xl animate-pulse pointer-events-none" />
                        )}

                        <div className="flex items-center gap-4 relative z-10">
                            <button
                                onClick={() => onTaskComplete?.(index)}
                                className={clsx(
                                    "p-1 rounded-full transition-colors",
                                    task.type === "boss_fight" ? "text-red-400 hover:text-red-300" : "text-zinc-500 hover:text-indigo-400"
                                )}
                            >
                                {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                            </button>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono text-zinc-500 tracking-wider bg-black/20 px-2 py-0.5 rounded">
                                        {task.time}
                                    </span>
                                    {task.type === "boss_fight" && (
                                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-400 tracking-widest bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                            <AlertTriangle className="w-3 h-3" />
                                            Boss Fight
                                        </span>
                                    )}
                                </div>
                                <h3 className={clsx(
                                    "text-lg font-light transition-all",
                                    task.completed ? "text-zinc-600 line-through" : "text-white"
                                )}>
                                    {task.task}
                                </h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
