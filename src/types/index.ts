export interface Goal {
    id: string;
    title: string;
    priority: "High" | "Medium" | "Low";
    deadline?: string;
    category?: string;
    status: "Active" | "Paused" | "Completed";
    createdAt: string;
}

export interface ActiveSession {
    date: string; // ISO Date String
    tasks: {
        time: string;
        task: string;
        type: "work" | "break" | "boss_fight";
        completed: boolean;
    }[];
    energyLevel: "High" | "Medium" | "Low";
    completed: boolean;
}

export interface UserData {
    // New Fields
    goals: Goal[];
    activeSession?: ActiveSession; // Persisted daily plan

    // Legacy Fields (kept for Type safety during migration)
    goal?: string;
    timeline?: string;

    // Core Fields
    dailyBandwidth: number;
    proficiency: string;
    onboardingCompleted: boolean;
}
