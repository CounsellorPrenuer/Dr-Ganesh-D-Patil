import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative backdrop-blur-xl bg-card/40 border border-border/40 rounded-2xl p-6 sm:p-8 shadow-2xl",
        "before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-white/5 before:-z-10",
        hover && "transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-[1.02] hover:border-border/60 hover:bg-card/50",
        className
      )}
    >
      {children}
    </div>
  );
}
