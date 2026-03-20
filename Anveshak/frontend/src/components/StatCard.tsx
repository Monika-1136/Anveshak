import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "cyan" | "violet" | "green" | "red";
}

export function StatCard({ title, value, icon: Icon, trend, color = "cyan" }: StatCardProps) {
  const colors = {
    cyan: {
      border: "border-[rgba(0,255,255,0.3)]",
      iconBg: "bg-[rgba(0,255,255,0.1)]",
      iconColor: "text-[#00FFFF]",
      glow: "shadow-[0_0_20px_rgba(0,255,255,0.2)]",
    },
    violet: {
      border: "border-[rgba(122,92,255,0.3)]",
      iconBg: "bg-[rgba(122,92,255,0.1)]",
      iconColor: "text-[#7A5CFF]",
      glow: "shadow-[0_0_20px_rgba(122,92,255,0.2)]",
    },
    green: {
      border: "border-[rgba(0,255,179,0.3)]",
      iconBg: "bg-[rgba(0,255,179,0.1)]",
      iconColor: "text-[#00FFB3]",
      glow: "shadow-[0_0_20px_rgba(0,255,179,0.2)]",
    },
    red: {
      border: "border-[rgba(255,56,100,0.3)]",
      iconBg: "bg-[rgba(255,56,100,0.1)]",
      iconColor: "text-[#FF3864]",
      glow: "shadow-[0_0_20px_rgba(255,56,100,0.2)]",
    },
  };

  const style = colors[color];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className={`bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border ${style.border} ${style.glow} rounded-2xl p-6 cursor-pointer transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${style.iconBg} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${style.iconColor}`} />
        </div>
        {trend && (
          <span className="text-xs text-[#00FFB3]">{trend}</span>
        )}
      </div>
      <p className="text-sm text-[#8B92A0] mb-1">{title}</p>
      <h3 className={`${style.iconColor}`}>{value}</h3>
    </motion.div>
  );
}
