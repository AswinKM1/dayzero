import { Header } from "../components/dashboard/Header";
import { EnergySelector } from "../components/dashboard/EnergySelector";
import { TaskLedger } from "../components/dashboard/TaskLedger";
import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Dashboard = () => {
    const { userData, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Protect: If loaded but no data, go to onboarding
    useEffect(() => {
        if (!authLoading && !userData) {
            navigate("/onboarding");
        }
    }, [authLoading, userData, navigate]);

    const [loading, setLoading] = useState(false);
    // Use 'any' for now to avoid rapid type import issues, or import Task type if we exported it
    const [tasks, setTasks] = useState<any[]>([]);

    const handleGenerate = async () => {
        if (!userData) return;
        setLoading(true);

        const requestData = {
            userGoal: userData.goal,
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

            // DIAGNOSTIC ALERT: Show us the data!
            alert("DIAGNOSTIC DATA:\n" + JSON.stringify(data, null, 2));

            if (data.tasks) setTasks(data.tasks);

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

    const handleTaskComplete = (index: number) => {
        const newTasks = [...tasks];
        newTasks[index].completed = !newTasks[index].completed;
        setTasks(newTasks);
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
        </div>
    );
};
