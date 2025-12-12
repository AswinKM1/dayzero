import type { ReactNode } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface LayoutProps {
    children: ReactNode;
    className?: string;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export const Layout = ({ children, className }: LayoutProps) => {
    return (
        <div className={cn("min-h-screen w-full flex flex-col items-center justify-center font-sans text-white relative", className)}>
            {/* Background is handled by body but we can add a subtle gradient here if needed */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

            <main className="w-full max-w-7xl mx-auto px-4 z-10 relative">
                {children}
            </main>
        </div>
    );
};
