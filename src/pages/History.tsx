import { Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function History() {
    return (
        <div className="p-6 md:p-12 space-y-8">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-rose-400" />
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        Temporal Log
                    </h1>
                </div>
                <p className="text-zinc-400">Review past performance and timeline.</p>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4"
            >
                <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 text-rose-400" />
                </div>
                <h3 className="text-xl font-medium text-white">The Time Machine</h3>
                <p className="text-zinc-400 max-w-sm mx-auto">
                    This module is currently under construction. Soon you will be able to time-travel through your past daily protocols.
                </p>
                <div className="inline-block px-4 py-1 rounded-full bg-rose-500/20 text-rose-400 text-sm border border-rose-500/20">
                    Phase 2.4 Coming Soon
                </div>
            </motion.div>
        </div>
    );
}
