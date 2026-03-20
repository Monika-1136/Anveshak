import { motion } from "motion/react";
import { ReactNode, forwardRef } from "react";

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ children, onClick, variant = "primary", className = "", type = "button", disabled = false, ...rest }, ref) => {
    const variants = {
      primary: "bg-[#00FFFF] text-[#0D1117] shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:shadow-[0_0_30px_rgba(0,255,255,0.8)]",
      secondary: "bg-[#7A5CFF] text-white shadow-[0_0_20px_rgba(122,92,255,0.5)] hover:shadow-[0_0_30px_rgba(122,92,255,0.8)]",
      accent: "bg-[#00FFB3] text-[#0D1117] shadow-[0_0_20px_rgba(0,255,179,0.5)] hover:shadow-[0_0_30px_rgba(0,255,179,0.8)]"
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        onClick={onClick}
        className={`px-6 py-3 rounded-lg transition-all duration-300 ${variants[variant]} ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...rest}
      >
        {children}
      </motion.button>
    );
  }
);
