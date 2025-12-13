import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
    type User,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { UserData, Goal } from "../types";

interface AuthContextType {
    user: User | null;
    userData: UserData | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    addGoal: (goal: Goal) => Promise<void>;
    updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Real-time listener for User Data
                const docRef = doc(db, "users", currentUser.uid);
                const unsubscribeSnapshot = onSnapshot(docRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        let data = docSnap.data() as UserData;

                        // --- LAZY MIGRATION START ---
                        if (!data.goals && data.goal) {
                            console.log("Migrating Legacy User...");
                            const newGoalObject = {
                                id: crypto.randomUUID(),
                                title: data.goal,
                                priority: "High" as const,
                                status: "Active" as const,
                                createdAt: new Date().toISOString(),
                                deadline: data.timeline
                            };
                            // Write back immediately
                            await setDoc(docRef, { goals: [newGoalObject] }, { merge: true });
                            // No need to manually update 'data', snapshot will fire again!
                            return;
                        }
                        // --- LAZY MIGRATION END ---

                        setUserData(data);
                    } else {
                        setUserData(null);
                    }
                }, (error) => {
                    console.error("Error listening to user data:", error);
                });

                return () => {
                    unsubscribeSnapshot();
                };
            } else {
                setUserData(null);
            }
            setLoading(false);
        });
        return () => unsubscribeAuth();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUserData(null);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const addGoal = async (goal: Goal) => {
        if (!user || !userData) return;
        const newGoals = [...(userData.goals || []), goal];
        const updatedUserData = { ...userData, goals: newGoals };
        setUserData(updatedUserData);
        await setDoc(doc(db, "users", user.uid), { goals: newGoals }, { merge: true });
    };

    const updateGoal = async (id: string, updates: Partial<Goal>) => {
        if (!user || !userData) return;
        const newGoals = (userData.goals || []).map(g => g.id === id ? { ...g, ...updates } : g);
        const updatedUserData = { ...userData, goals: newGoals };
        setUserData(updatedUserData);
        await setDoc(doc(db, "users", user.uid), { goals: newGoals }, { merge: true });
    };

    const deleteGoal = async (id: string) => {
        if (!user || !userData) return;
        if ((userData.goals || []).length <= 1) {
            alert("You must have at least one active mission.");
            return;
        }
        const newGoals = (userData.goals || []).filter(g => g.id !== id);
        const updatedUserData = { ...userData, goals: newGoals };
        setUserData(updatedUserData);
        await setDoc(doc(db, "users", user.uid), { goals: newGoals }, { merge: true });
    };

    return (
        <AuthContext.Provider value={{
            user,
            userData,
            loading,
            signInWithGoogle,
            logout,
            addGoal,
            updateGoal,
            deleteGoal
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

