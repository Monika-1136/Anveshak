import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { ForensAIChat } from "./ForensAIChat";

interface DashboardLayoutProps {
  onLogout: () => void;
}

export function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const location = useLocation();

  // Store the current page in localStorage whenever the location changes
  useEffect(() => {
    localStorage.setItem('currentPage', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col overflow-hidden">
      <Header onLogout={onLogout} />
      <div className="flex-1 flex overflow-hidden">
        <Navigation />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname} // Use pathname for unique key
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} // This exit prop works inside AnimatePresence
              transition={{ duration: 0.3 }}
            >
              <Outlet /> {/* Child routes will render here */}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <ForensAIChat />
    </div>
  );
}