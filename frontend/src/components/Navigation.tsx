import { motion } from "motion/react";
import { NavLink } from "react-router-dom";
import { Link } from "lucide-react";
import { 
  LayoutDashboard, 
  Upload, 
  Brain, 
  Clock, 
  FolderKanban, 
  Shield, 
  FileText, 
  Settings,
  Link2
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/intake", label: "Evidence Intake", icon: Upload },
  { to: "/analysis", label: "AI Analysis", icon: Brain },
  { to: "/timeline", label: "Timeline", icon: Clock },
  { to: "/cases", label: "Cases", icon: FolderKanban },
  // Threat Intel nav item removed
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/custody", label: "Custody", icon: Link2 },
];

export function Navigation() {
  return (
    <motion.nav
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border-r border-[rgba(0,255,255,0.2)] w-64 p-4"
    >
      <div className="flex flex-col h-full">
        <div className="space-y-2 flex-grow">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[rgba(0,255,255,0.2)] to-[rgba(122,92,255,0.2)] border border-[#00FFFF] shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                      : "hover:bg-[rgba(0,255,255,0.05)] border border-transparent"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 ${isActive ? "text-[#00FFFF]" : "text-[#8B92A0]"}`} />
                    <span className={`text-sm ${isActive ? "text-[#00FFFF]" : "text-[#E6E8EB]"}`}>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
