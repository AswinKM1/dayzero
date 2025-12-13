import { Calendar, Clock, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { HistoryEntry } from "../types";

export default function History() {
    const { user } = useAuth();
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(db, "users", user.uid, "history"),
                    orderBy("date", "desc")
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => doc.data() as HistoryEntry);
                setHistory(data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    if (loading) {
        return <div className="p-12 text-center text-zinc-500 animate-pulse">Loading Archives...</div>;
    }

    return (
        <div className="p-6 md:p-12 space-y-8 max-w-5xl mx-auto">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-rose-400" />
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Temporal Log
                    </h1>
                </div>
                <p className="text-zinc-400">Review past performance and timeline.</p>
            </header>

            {history.length === 0 ? (
                <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto">
                        <Clock className="w-8 h-8 text-rose-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white">No Archives Found</h3>
                    <p className="text-zinc-400">Complete your first daily mission to start building your legacy.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {history.map((entry, index) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all flex items-center justify-between"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-medium text-white">
                                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </h3>
                                    <span className={`text-xs px-2 py-0.5 rounded border ${entry.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        entry.score >= 50 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                            'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                        {entry.score >= 80 ? 'EXCELLENT' : entry.score >= 50 ? 'GOOD' : 'CRITICAL'}
                                    </span>
                                </div>
                                <p className="text-zinc-400 text-sm">
                                    {entry.tasks.length} Missions Assigned • {entry.energyLevel} Energy
                                </p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-white">{entry.score}%</div>
                                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Success Rate</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <Trophy className={`w-5 h-5 ${entry.score >= 80 ? 'text-amber-400' : 'text-zinc-600'
                                        }`} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
