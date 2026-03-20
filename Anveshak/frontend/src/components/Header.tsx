import { Shield, Bell, Settings, User, ChevronRight, LogOut, Brain, FileText } from "lucide-react";
import { motion } from "motion/react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

const breadcrumbNameMap: Record<string, string> = {
  "/dashboard": "Dashboard Overview",
  "/intake": "Evidence Intake",
  "/analysis": "AI-Powered Analysis",
  "/timeline": "Timeline Reconstruction",
  "/cases": "Case Management",
  "/threats": "Threat Intelligence",
  "/reports": "Report Generator",
  "/custody": "Chain of Custody & Settings",
  "/settings": "Personal Settings",
};

// Custom hook to detect clicks outside a component
const useClickOutside = (ref: React.RefObject<HTMLElement>, handler: () => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const [notifications, setNotifications] = useState([
    { id: 1, read: false, text: "AI Analysis completed for Case #FR-2025-1045", time: "5m ago", icon: Brain, link: "/analysis" },
    { id: 2, read: false, text: "New evidence uploaded to Case #FR-2025-1044", time: "32m ago", icon: FileText, link: "/intake" },
    { id: 3, read: true, text: "Report generated for Case #FR-1040", time: "2h ago", icon: FileText, link: "/reports" },
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  useClickOutside(profileRef, () => setIsProfileOpen(false));
  useClickOutside(notificationsRef, () => setIsNotificationsOpen(false));

  const handleLogoutClick = () => {
    setIsProfileOpen(false);
    onLogout();
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const toggleProfileDropdown = useCallback(() => {
    if (profileButtonRef.current) {
      const rect = profileButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px gap
        right: window.innerWidth - rect.right,
      });
    }
    setIsProfileOpen(prev => !prev);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border-b border-[rgba(0,255,255,0.2)] px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00FFFF] to-[#7A5CFF] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.4)]">
            <Shield className="w-6 h-6 text-[#0D1117]" />
          </div>
          <div>
            <h2 className="text-[#E6E8EB]">Cyber Forensic Command</h2>
            <nav aria-label="breadcrumb" className="text-xs text-[#8B92A0] flex items-center">
              <Link to="/dashboard" className="hover:text-[#00FFFF]">Dashboard</Link>
              {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;
                const name = breadcrumbNameMap[to] || value.charAt(0).toUpperCase() + value.slice(1);

                if (to === '/dashboard') return null;

                return (
                  <span key={to} className="flex items-center">
                    <ChevronRight className="w-3 h-3 mx-1" />
                    {isLast ? (
                      <span className="text-[#E6E8EB]">{name}</span>
                    ) : (
                      <Link to={to} className="hover:text-[#00FFFF]">{name}</Link>
                    )}
                  </span>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setIsNotificationsOpen(prev => !prev)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-lg bg-[rgba(0,255,255,0.1)] border border-[rgba(0,255,255,0.2)] hover:border-[#00FFFF] transition-colors"
            >
              <Bell className="w-5 h-5 text-[#00FFFF]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF3864] rounded-full text-[10px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </motion.button>
            {isNotificationsOpen && createPortal(
              <motion.div
                ref={notificationsRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 bg-[#1a1d24] border border-cyan-400/50 rounded-xl shadow-lg z-[1000] overflow-hidden"
                style={{ top: '60px', right: '80px' }} // Adjust position as needed
              >
                <div className="p-4 border-b border-cyan-400/20 flex justify-between items-center">
                  <h4 className="text-white">Notifications</h4>
                  {unreadCount > 0 && <button onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))} className="text-xs text-cyan-400 hover:underline">Mark all as read</button>}
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? notifications.map(n => {
                    const Icon = n.icon;
                    return (
                      <div key={n.id} onClick={() => { navigate(n.link); setIsNotificationsOpen(false); }} className={`flex gap-3 p-4 hover:bg-cyan-900/30 cursor-pointer transition-colors ${!n.read ? 'bg-cyan-900/10' : ''}`}>
                        <Icon className="w-5 h-5 text-cyan-400 mt-1 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-200">{n.text}</p>
                          <p className="text-xs text-gray-500">{n.time}</p>
                        </div>
                      </div>
                    )
                  }) : <p className="p-8 text-center text-sm text-gray-500">No new notifications</p>}
                </div>
                <div className="p-2 text-center border-t border-cyan-400/20">
                  <button className="text-sm text-cyan-400 hover:text-white w-full">View all notifications</button>
                </div>
              </motion.div>,
              document.body
            )}
          </div>

          <motion.button
            onClick={() => navigate('/settings')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-[rgba(122,92,255,0.1)] border border-[rgba(122,92,255,0.2)] hover:border-[#7A5CFF] transition-colors"
          >
            <Settings className="w-5 h-5 text-[#7A5CFF]" />
          </motion.button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button ref={profileButtonRef} onClick={toggleProfileDropdown} className="flex items-center gap-3 pl-4 border-l border-[rgba(0,255,255,0.2)]">
              <div className="text-right">
                <p className="text-sm text-[#E6E8EB]">Alex Rivera</p>
                <p className="text-xs text-[#8B92A0]">Lead Investigator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FFB3] to-[#00FFFF] flex items-center justify-center">
                <User className="w-5 h-5 text-[#0D1117]" />
              </div>
            </button>
            {isProfileOpen && createPortal(
              <motion.div
                ref={profileRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                style={{
                  position: 'fixed',
                  top: `${dropdownPosition.top}px`,
                  right: `${dropdownPosition.right}px`,
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                }}
                className="w-60 bg-[#1a1d24] border border-cyan-400/50 rounded-xl p-2"
                >
                  <div className="px-3 py-2 border-b border-cyan-400/20 mb-2">
                    <p className="font-semibold text-white">Alex Rivera</p>
                    <p className="text-sm text-gray-400">Lead Investigator</p>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-300 hover:bg-red-800/50 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
              </motion.div>,
              document.body
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
