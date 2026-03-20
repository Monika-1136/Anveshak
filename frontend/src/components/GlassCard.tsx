import { motion } from "motion/react";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({ children, className = "", glow = false }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-[rgba(28,31,38,0.6)] 
        backdrop-blur-xl 
        border border-[rgba(0,255,255,0.2)] 
        rounded-2xl 
        ${glow ? 'shadow-[0_0_30px_rgba(0,255,255,0.15)]' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
