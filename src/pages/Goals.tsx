import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Goal } from "../types";
import { Plus, X, Save, Target, Trash2, Edit2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export default function Goals() {
    const { userData, addGoal, updateGoal, deleteGoal } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Development");
    const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High");

    const categories = ["Development", "Design", "Business", "Health", "Learning", "Other"];

    const handleOpenModal = (goal?: Goal) => {
        if (goal) {
            setEditingGoal(goal);
            setTitle(goal.title);
            setCategory(goal.category || "Development");
            setPriority(goal.priority);
        } else {
            setEditingGoal(null);
            setTitle("");
            setCategory("Development");
            setPriority("High");
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!title.trim()) return;

        if (editingGoal) {
            await updateGoal(editingGoal.id, {
                title,
                category,
                priority
            });
        } else {
            const newGoal: Goal = {
                id: crypto.randomUUID(),
                title,
                category,
                priority,
                status: "Active",
                createdAt: new Date().toISOString()
            };
            await addGoal(newGoal);
        }
        setIsModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this mission?")) {
            await deleteGoal(id);
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Target className="w-8 h-8 text-indigo-400" />
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Mission Control
                        </h1>
                    </div>
                    <p className="text-zinc-400">Manage your active protocols and objectives.</p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-5 py-3 bg-white text-black font-semibold rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-white/10"
                >
                    <Plus className="w-5 h-5" />
                    New Objective
                </button>
            </header>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {userData?.goals?.map((goal) => (
                        <motion.div
                            key={goal.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors backdrop-blur-sm"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className={clsx(
                                            "text-xs font-medium px-2 py-0.5 rounded-full border",
                                            goal.priority === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                                                goal.priority === "Medium" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        )}>
                                            {goal.priority} Priority
                                        </span>
                                        <span className="text-xs text-zinc-500 font-medium px-2 py-0.5 rounded-full border border-white/5 bg-white/5">
                                            {goal.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">{goal.title}</h3>
                                </div>
                                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenModal(goal)}
                                        className="p-2 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(goal.id)}
                                        className="p-2 hover:bg-rose-500/20 rounded-lg text-zinc-400 hover:text-rose-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {(!userData?.goals || userData.goals.length === 0) && (
                    <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-white/10 rounded-2xl">
                        <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No active missions. Initialize a new objective.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 z-50 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingGoal ? "Edit Objective" : "New Objective"}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full text-zinc-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Mission Title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="e.g. Master Python Backend"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        autoFocus
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Category</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                        >
                                            {categories.map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Priority</label>
                                        <select
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value as any)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                        >
                                            <option value="High" className="bg-zinc-900">High</option>
                                            <option value="Medium" className="bg-zinc-900">Medium</option>
                                            <option value="Low" className="bg-zinc-900">Low</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-3 rounded-xl hover:bg-white/5 text-zinc-400 transition-colors font-medium border border-transparent"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 px-4 py-3 rounded-xl bg-white text-black font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Mission
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
