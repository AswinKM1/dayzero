import { motion } from "framer-motion";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
    const { user, signInWithGoogle, loading } = useAuth();
    const navigate = useNavigate();

    // If already logged in, redirect to dashboard
    if (!loading && user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full relative z-10 px-4">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="glass-panel p-8 rounded-3xl w-full max-w-md flex flex-col items-center text-center shadow-2xl"
            >
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter text-white">DayZero</h1>
                    <p className="text-zinc-400 font-light text-sm tracking-wide">INITIALIZE SEQUENCE</p>
                </div>

                <button
                    onClick={handleLogin}
                    className="group w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300"
                >
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                        />
                    </svg>
                    <span className="text-zinc-200 group-hover:text-white font-medium">Continue with Google</span>
                </button>
            </motion.div>
        </div>
    );
};
