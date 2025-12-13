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

    const handleGenerate = async () => {
        if (!userData || !user) return;
        setLoading(true);

        const requestData = {
            // Phase 2.3b TODO: Use 'goals' array instead of singular 'goal'
            userGoal: userData.goals?.[0]?.title || userData.goal,
            energyLevel: "High", // In future, use the EnergySelector state
            currentDay: 1 // In future, calculate day difference from createdAt
        };

        try {
            const response = await fetch('/api/generate-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                alert(`System Error: ${response.status} - ${errorText}`);
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Protocol Generated:", data);

            if (data.tasks) {
                const newTasks = data.tasks.map((t: any) => ({ ...t, completed: false }));
                setTasks(newTasks);

                // PERSIST: Save to Firestore immediately
                const today = new Date().toISOString().split('T')[0];
                const cleanTasks = newTasks.map((t: any) => ({
                    time: t.time,
                    task: t.task,
                    type: t.type,
                    completed: false
                }));

                await setDoc(doc(db, "users", user.uid), {
                    activeSession: {
                        date: today,
                        tasks: cleanTasks,
                        energyLevel: "High",
                        completed: false
                    }
                }, { merge: true });
            }

        } catch (error) {
            console.error("Protocol Failure:", error);

            // Only fallback to mock if it's explicitly desired (e.g. dev mode),
            // but for debugging deployment we want to crash/alert.
            // setMockData() // Commented out to force debugging

            alert("Protocol Initialization Failed. Check Console for details.");
            setLoading(false);
            return;


        }

        setLoading(false);
    };

    const handleTaskComplete = async (index: number) => {
        if (!user || !userData) return;
        const newTasks = [...tasks];
        newTasks[index].completed = !newTasks[index].completed;
        setTasks(newTasks);

        // PERSIST: Update Firestore immediately
        // We use the current tasks state but with the one update applied
        // To be safe, we construct the object to match ActiveSession type
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
        console.log("Energy selected:", level);
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-6 md:p-8">
            <Header />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Column - Logic / Inputs (4 cols) */}
                <div className="md:col-span-4 space-y-6">
                    <EnergySelector onSelect={handleEnergySelect} />

                    {/* Placeholder for Goals or other widgets */}
                    <div className="glass-panel p-6 rounded-3xl min-h-[200px] flex items-center justify-center text-zinc-500 border-dashed">
                        <span className="text-xs uppercase tracking-widest">Active Goals Widget</span>
                    </div>
                </div>

                {/* Right Column - Tasks (8 cols) */}
                <div className="md:col-span-8">
                    <TaskLedger
                        onGenerate={handleGenerate}
                        loading={loading}
                        tasks={tasks}
                        onTaskComplete={handleTaskComplete}
                    />
                </div>
            </div>

            {/* DEBUG PANEL - REMOVE AFTER FIXING */}
            <div className="mt-8 p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-400 break-all">
                <p className="text-white font-bold mb-2">DEBUG STATE V2.4</p>
                <p>User ID: {user?.uid}</p>
                <p>Has UserData: {userData ? "YES" : "NO"}</p>
                <p>Has ActiveSession: {userData?.activeSession ? "YES" : "NO"}</p>
                <p>Goals: {userData?.goals?.length || 0}</p>
                <p>Session Date: {userData?.activeSession?.date || "N/A"}</p>
                <p>Task Count: {userData?.activeSession?.tasks?.length || 0}</p>
            </div>
        </div>
    );
};
