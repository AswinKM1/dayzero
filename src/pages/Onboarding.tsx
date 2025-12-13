import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Check, Target, Clock, Zap, Award } from "lucide-react";
import { clsx } from "clsx";

type Step = 1 | 2 | 3 | 4;

export const Onboarding = () => {
    const { user } = useAuth();
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        goal: "",
        timeline: "3 Months",
        dailyBandwidth: 2,
        proficiency: "Novice"
    });

    const handleNext = async () => {
        if (step < 4) {
            setStep((prev) => (prev + 1) as Step);
        } else {
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await setDoc(doc(db, "users", user.uid), {
                ...formData,
                onboardingCompleted: true,
                createdAt: new Date().toISOString()
            });
            // Force reload to refresh AuthContext
            window.location.href = "/dashboard";
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("System Malfunction: Could not save profile.");
        } finally {
            setLoading(false);
        }
    };

    const variants = {
        enter: { x: 100, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 overflow-x-hidden relative">
            {/* Decorative Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full w-[90%] max-w-sm mx-auto relative glass-panel rounded-3xl p-6 md:p-8 z-10 overflow-hidden">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-xl font-light tracking-widest uppercase text-zinc-400">System Calibration</h1>
                    <span className="text-sm font-mono text-indigo-400">Step {step} / 4</span>
                </div>

                <div className="relative min-h-[300px]">
                    <AnimatePresence mode="popLayout" custom={step}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <Target className="w-8 h-8 text-white mb-4" />
                                    <h2 className="text-3xl font-bold text-white">Identify Main Objective</h2>
                                    <p className="text-zinc-400">What is the singular goal you wish to achieve?</p>
                                </div>
                                <input
                                    type="text"
                                    value={formData.goal}
                                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                    placeholder="e.g. Learn React Native"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                                    autoFocus
                                />
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <Clock className="w-8 h-8 text-white mb-4" />
                                    <h2 className="text-3xl font-bold text-white">Time Dilation Protocol</h2>
                                    <p className="text-zinc-400">Set your expected timeline for completion.</p>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {["1 Month", "3 Months", "6 Months", "1 Year"].map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => setFormData({ ...formData, timeline: opt })}
                                            className={clsx(
                                                "p-4 rounded-xl border text-left transition-all",
                                                formData.timeline === opt ? "bg-indigo-500/20 border-indigo-500/50 text-white" : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10"
                                            )}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <Zap className="w-8 h-8 text-white mb-4" />
                                    <h2 className="text-3xl font-bold text-white">Daily Bandwidth</h2>
                                    <p className="text-zinc-400">Check your available energy capacity: {formData.dailyBandwidth} hours/day.</p>
                                </div>
                                <div className="py-8 px-2">
                                    <input
                                        type="range"
                                        min="1"
                                        max="12"
                                        step="1"
                                        value={formData.dailyBandwidth}
                                        onChange={(e) => setFormData({ ...formData, dailyBandwidth: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <div className="flex justify-between mt-2 text-xs text-zinc-500 font-mono">
                                        <span>1 HR</span>
                                        <span>6 HRS</span>
                                        <span>12 HRS</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <Award className="w-8 h-8 text-white mb-4" />
                                    <h2 className="text-3xl font-bold text-white">Current Proficiency</h2>
                                    <p className="text-zinc-400">Calibrate the AI's difficulty settings.</p>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {["Novice", "Adept", "Elite"].map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => setFormData({ ...formData, proficiency: opt })}
                                            className={clsx(
                                                "p-4 rounded-xl border text-left transition-all",
                                                formData.proficiency === opt ? "bg-indigo-500/20 border-indigo-500/50 text-white" : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10"
                                            )}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span>{opt}</span>
                                                {formData.proficiency === opt && <Check className="w-4 h-4 text-indigo-400" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={step === 1 && !formData.goal}
                        className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Initializing..." : (step === 4 ? "Initialize DayZero" : "Next Protocol")}
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
