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
        related_goal_name?: string;
    }[];
    energyLevel: "High" | "Medium" | "Low";
    completed: boolean;
    generatedGoalCount?: number;
}

export interface HistoryEntry extends ActiveSession {
    id: string; // usually YYYY-MM-DD
    score: number; // 0-100
    completedAt: string; // ISO Timestamp
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
