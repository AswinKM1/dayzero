import { Header } from "../components/dashboard/Header";
import { EnergySelector } from "../components/dashboard/EnergySelector";
import { TaskLedger } from "../components/dashboard/TaskLedger";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export const Dashboard = () => {
    const { userData, loading: authLoading, user } = useAuth();
    const navigate = useNavigate();

    // Protect: If loaded but no data, go to onboarding
    useEffect(() => {
        if (!authLoading && !userData) {
            navigate("/onboarding");
        }
    }, [authLoading, userData, navigate]);

    // Load persisted session on mount
    useEffect(() => {
        if (userData?.activeSession) {
            console.log("Restoring active session from Firestore...");
            // Force load the session derived from Firestore
            // We strip the date check to ensure it always loads for debugging
            setTasks(userData.activeSession.tasks);
        }
    }, [userData]);

    const [loading, setLoading] = useState(false);
    // Use 'any' for now to avoid rapid type import issues, or import Task type if we exported it
    const [tasks, setTasks] = useState<any[]>([]);

    // New State for Time Slider
    const [availableTime, setAvailableTime] = useState(4);
    const [energyLevel, setEnergyLevel] = useState("medium");

    // Computed property: Do we have an active session for TODAY?
    // We check if 'tasks' has length > 0, which implies a session is active.
    // (In a perfect world we check date, but we rely on the useEffect logic to load only valid sessions)
    const hasActiveSession = tasks.length > 0;

    const handleGenerate = async (isAutoRefresh = false) => {
        if (!userData || !user) return;
        setLoading(true);

        const goalsPayload = userData.goals?.map(g => ({
            title: g.title,
            priority: g.priority,
            category: g.category
        })) || (userData.goal ? [{ title: userData.goal, priority: "High", category: "Core" }] : []);

        const requestData = {
            userGoals: goalsPayload,
            energyLevel: energyLevel,
            availableTime: availableTime,
            currentDay: 1
        };

        try {
            const response = await fetch('/api/generate-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                // If auto-refresh fails, silent fail better than alerting?
                // For now, let's keep it visible so user knows why it didn't update.
                if (!isAutoRefresh) {
                    const errorText = await response.text();
                    alert(`System Error: ${response.status} - ${errorText}`);
                }
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();

            if (data.tasks) {
                const newTasks = data.tasks.map((t: any) => ({ ...t, completed: false }));
                setTasks(newTasks);

                // PERSIST: Save to Firestore immediately
                const today = new Date().toISOString().split('T')[0];
                const cleanTasks = newTasks.map((t: any) => ({
                    time: t.time,
                    task: t.task,
                    type: t.type,
                    completed: false,
                    related_goal_name: t.related_goal_name // Preserve AI context
                }));

                await setDoc(doc(db, "users", user.uid), {
                    activeSession: {
                        date: today,
                        tasks: cleanTasks,
                        energyLevel: energyLevel,
                        completed: false,
                        generatedGoalCount: goalsPayload.length // Save count to detect changes later
                    }
                }, { merge: true });
            }

        } catch (error) {
            console.error("Protocol Failure:", error);
            if (!isAutoRefresh) {
                alert("Protocol Initialization Failed. Check Console for details.");
            }
            setLoading(false);
            return;
        }

        setLoading(false);
    };

    // Auto-Regenerate on Mount if Goal Count has changed
    useEffect(() => {
        if (userData?.activeSession && userData?.goals) {
            const lastCount = userData.activeSession.generatedGoalCount || 0;
            const currentCount = userData.goals.length;

            if (currentCount > lastCount && !loading) {
                console.log("New Mission Detected: Auto-Optimizing Protocol...");
                // Trigger update
                handleGenerate(true);
            }
        }
    }, [userData]); // Check whenever userData updates (which happens on nav back from goals)

    const handleTaskComplete = async (index: number) => {
        if (!user || !userData) return;
        const newTasks = [...tasks];
        newTasks[index].completed = !newTasks[index].completed;
        setTasks(newTasks);

        // PERSIST: Update Firestore immediately
        if (userData.activeSession) {
            await setDoc(doc(db, "users", user.uid), {
                activeSession: {
                    ...userData.activeSession,
                    tasks: newTasks
                }
            }, { merge: true });
        }
    };

    const handleEnergySelect = (level: string) => {
        setEnergyLevel(level);
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6 md:p-8">
            <Header />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Left Column - Logic / Inputs (4 cols) */}
                {/* HIDE this column if we already have an active session to save space */}
                {!hasActiveSession && (
                    <div className="md:col-span-4 space-y-6">
                        <EnergySelector
                            onSelect={handleEnergySelect}
                            onTimeSelect={setAvailableTime}
                            initialHours={availableTime}
                        />

                        {/* Placeholder for Goals or other widgets */}
                        <div className="glass-panel p-6 rounded-3xl min-h-[200px] flex items-center justify-center text-zinc-500 border-dashed">
                            <span className="text-xs uppercase tracking-widest">Active Goals Widget</span>
                        </div>
                    </div>
                )}

                {/* Right Column - Tasks (8 cols) - Expand to full width if logic is hidden */}
                <div className={!hasActiveSession ? "md:col-span-8" : "md:col-span-12"}>
                    <TaskLedger
                        onGenerate={handleGenerate}
                        loading={loading}
                        tasks={tasks}
                        onTaskComplete={handleTaskComplete}
                    />
                </div>
            </div>

            {/* DEBUG PANEL REMOVED */}
        </div>
    );
};
