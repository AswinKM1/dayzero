import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const LandingPage = () => {
    return (
        <div className="flex flex-col items-center text-center space-y-8 py-20">

            {/* Hero Text */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-6xl md:text-8xl font-thin tracking-tight"
            >
                Focus is a <span className="font-normal text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">Luxury</span>.
            </motion.h1>

            {/* Subtitle / Description - Optional but adds to vibe */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="text-zinc-400 max-w-lg text-lg font-light"
            >
                Reclaim your time with intelligent scheduling.
            </motion.p>

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
            >
                <Link to="/login" className="group relative px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] backdrop-blur-md overflow-hidden inline-flex">
                    <span className="relative z-10 flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-zinc-200 group-hover:text-white">
                        Get Started
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Link>
            </motion.div>

        </div>
    );
};
