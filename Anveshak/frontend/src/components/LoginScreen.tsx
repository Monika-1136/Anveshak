import { useState } from "react";
import { CircuitBackground } from "./CircuitBackground";
import { GlowButton } from "./GlowButton";
import { GlassCard } from "./GlassCard";
import { motion } from "motion/react";
import { Shield, Lock, Mail } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0D1117]">
      <CircuitBackground />
      
      <GlassCard className="w-full max-w-md p-8 relative z-10" glow>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#7A5CFF] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,255,0.6)]">
            <Shield className="w-10 h-10 text-[#0D1117]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2 bg-gradient-to-r from-[#00FFFF] to-[#7A5CFF] bg-clip-text text-transparent"
        >
          AI-Powered Cyber Forensic Triage Tool
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-[#8B92A0] mb-8 text-sm"
        >
          Next-Generation Investigation Control Room
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm mb-2 text-[#E6E8EB]">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00FFFF]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[rgba(28,31,38,0.8)] border border-[rgba(0,255,255,0.3)] rounded-lg focus:border-[#00FFFF] focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all text-[#E6E8EB]"
                placeholder="investigator@forensic.lab"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm mb-2 text-[#E6E8EB]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A5CFF]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[rgba(28,31,38,0.8)] border border-[rgba(122,92,255,0.3)] rounded-lg focus:border-[#7A5CFF] focus:outline-none focus:shadow-[0_0_15px_rgba(122,92,255,0.3)] transition-all text-[#E6E8EB]"
                placeholder="••••••••"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="pt-4"
          >
            <GlowButton type="submit" className="w-full">
              Login
            </GlowButton>
          </motion.div>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-[#8B92A0] mt-8"
        >
          © 2025 FOSS Mysore – Secure Access
        </motion.p>
      </GlassCard>
    </div>
  );
}
