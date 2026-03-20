import { useState, useEffect } from "react";
import { CircuitBackground } from "./CircuitBackground";
import { GlowButton } from "./GlowButton";
import { GlassCard } from "./GlassCard";
import { motion } from "motion/react";
import { ShieldCheck, Key, CheckCircle, Loader, Usb } from "lucide-react";

interface MFAScreenProps {
  onMfaSuccess: () => void;
}

type MfaMethod = "authenticator" | "yubikey" | null;
type YubiKeyStatus = "idle" | "detecting" | "verifying" | "verified";

export function MFAScreen({ onMfaSuccess }: MFAScreenProps) {
  const [mfaMethod, setMfaMethod] = useState<MfaMethod>(null);
  const [authenticatorCode, setAuthenticatorCode] = useState("");
  const [yubiKeyStatus, setYubiKeyStatus] = useState<YubiKeyStatus>("idle");

  const handleAuthenticatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticatorCode.length === 6) {
      onMfaSuccess();
    }
  };

  const handleYubiKeySelect = () => {
    setMfaMethod("yubikey");
    setYubiKeyStatus("detecting");
  };

  useEffect(() => {
    if (yubiKeyStatus === "detecting") {
      const timer = setTimeout(() => setYubiKeyStatus("verifying"), 2000);
      return () => clearTimeout(timer);
    }
    if (yubiKeyStatus === "verifying") {
      const timer = setTimeout(() => setYubiKeyStatus("verified"), 2000);
      return () => clearTimeout(timer);
    }
    if (yubiKeyStatus === "verified") {
      const timer = setTimeout(() => onMfaSuccess(), 1500);
      return () => clearTimeout(timer);
    }
  }, [yubiKeyStatus, onMfaSuccess]);

  const renderInitialOptions = () => (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <GlowButton type="button" className="w-full flex items-center justify-center" onClick={() => setMfaMethod("authenticator")}>
          <ShieldCheck className="w-5 h-5 mr-3" />
          Use Authenticator App
        </GlowButton>
      </motion.div>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <GlowButton type="button" className="w-full flex items-center justify-center" onClick={handleYubiKeySelect}>
          <Key className="w-5 h-5 mr-3" />
          Use YubiKey
        </GlowButton>
      </motion.div>
    </div>
  );

  const renderAuthenticator = () => (
    <form onSubmit={handleAuthenticatorSubmit} className="space-y-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <label className="block text-sm mb-2 text-[#E6E8EB]">Authenticator Code</label>
        <div className="relative">
          <input
            type="text"
            value={authenticatorCode}
            onChange={(e) => setAuthenticatorCode(e.target.value)}
            className="w-full text-center tracking-[0.5em] text-2xl py-3 bg-[rgba(28,31,38,0.8)] border border-[rgba(0,255,255,0.3)] rounded-lg focus:border-[#00FFFF] focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all text-[#E6E8EB]"
            placeholder="_ _ _ _ _ _"
            maxLength={6}
            required
          />
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="pt-4">
        <GlowButton type="submit" className="w-full">
          Verify
        </GlowButton>
      </motion.div>
    </form>
  );

  const renderYubiKey = () => (
    <div className="text-center text-[#E6E8EB]">
      {yubiKeyStatus === "detecting" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center space-y-4">
          <Usb className="w-12 h-12 text-[#00FFFF] animate-pulse" />
          <p>Please insert your YubiKey...</p>
        </motion.div>
      )}
      {yubiKeyStatus === "verifying" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 text-[#7A5CFF] animate-spin" />
          <p>Verifying YubiKey...</p>
        </motion.div>
      )}
      {yubiKeyStatus === "verified" && (
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center space-y-4">
          <CheckCircle className="w-12 h-12 text-green-400" />
          <p className="text-green-400">YubiKey Verified!</p>
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0D1117]">
      <CircuitBackground />
      <GlassCard className="w-full max-w-md p-8 relative z-10" glow>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }} className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00FFFF] to-[#7A5CFF] flex items-center justify-center shadow-[0_0_40px_rgba(0,255,255,0.6)]">
            <ShieldCheck className="w-10 h-10 text-[#0D1117]" />
          </div>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 bg-gradient-to-r from-[#00FFFF] to-[#7A5CFF] bg-clip-text text-transparent">
          Multi-Factor Authentication
        </motion.h1>
        
        {mfaMethod === null && renderInitialOptions()}
        {mfaMethod === "authenticator" && renderAuthenticator()}
        {mfaMethod === "yubikey" && renderYubiKey()}

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center text-xs text-[#8B92A0] mt-8">
          © 2025 FOSS Mysore – Secure Access
        </motion.p>
      </GlassCard>
    </div>
  );
}
