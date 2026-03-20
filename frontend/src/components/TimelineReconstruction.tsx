import { useState } from "react";
import { motion } from "motion/react";
import { Clock, Search, AlertTriangle, UserX, FileWarning, Shield, ChevronDown } from "lucide-react";
import { StatusChip } from "./StatusChip";

const timelineEvents = [
  {
    id: 1,
    time: "2025-10-08 14:32:15",
    title: "Unauthorized Login Attempt",
    description: "Failed SSH login from IP 192.168.1.45 to production server",
    severity: "critical" as const,
    device: "prod-server-01",
    user: "unknown",
  details: "Multiple failed login attempts detected.",
  },
  {
    id: 2,
    time: "2025-10-08 14:35:42",
    title: "Privilege Escalation Detected",
    description: "User account elevated to admin without approval workflow",
    severity: "critical" as const,
    device: "prod-server-01",
    user: "jsmith",
    details: "Sudo privileges granted outside of normal business hours. No corresponding ticket found.",
  },
  {
    id: 3,
    time: "2025-10-08 14:38:20",
    title: "Suspicious File Transfer",
    description: "Large data transfer to external IP address",
    severity: "high" as const,
    device: "prod-server-01",
    user: "jsmith",
    details: "15.7 GB transferred to 45.33.12.89 via SCP protocol. IP belongs to known malicious infrastructure.",
  },
  {
    id: 4,
    time: "2025-10-08 14:42:05",
    title: "Log Tampering Attempt",
    description: "System logs modified to remove evidence",
    severity: "high" as const,
    device: "prod-server-01",
    user: "jsmith",
    details: "Authentication logs deleted. Backup logs recovered from SIEM.",
  },
  {
    id: 5,
    time: "2025-10-08 14:45:30",
    title: "Malware Signature Detected",
    description: "Known ransomware variant identified in /tmp directory",
    severity: "critical" as const,
    device: "prod-server-01",
    user: "system",
    details: "SHA-256: a3f5c9d2e1b4f7a8c6d9e2f5a7b3c1d8 matches known Ryuk ransomware variant.",
  },
  {
    id: 6,
    time: "2025-10-08 14:50:12",
    title: "Network Isolation Triggered",
    description: "Automated response isolated compromised server",
    severity: "medium" as const,
    device: "firewall-01",
    user: "system",
    details: "EDR system automatically quarantined server to prevent lateral movement.",
  },
];

export function TimelineReconstruction() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const filteredEvents = timelineEvents.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || event.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return AlertTriangle;
      case "high":
        return UserX;
      case "medium":
        return FileWarning;
      default:
        return Shield;
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-[#E6E8EB] mb-2">Timeline Reconstruction</h2>
        <p className="text-sm text-[#8B92A0]">Chronological analysis of security events</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00FFFF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by keyword or hash..."
            className="w-full pl-11 pr-4 py-3 bg-[rgba(28,31,38,0.8)] border border-[rgba(0,255,255,0.3)] rounded-lg focus:border-[#00FFFF] focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all text-[#E6E8EB]"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterSeverity("all")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterSeverity === "all"
                ? "bg-[#00FFFF] text-[#0D1117]"
                : "bg-[rgba(0,255,255,0.1)] border border-[rgba(0,255,255,0.3)] text-[#00FFFF]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterSeverity("critical")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterSeverity === "critical"
                ? "bg-[#FF3864] text-white"
                : "bg-[rgba(255,56,100,0.1)] border border-[rgba(255,56,100,0.3)] text-[#FF3864]"
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilterSeverity("high")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filterSeverity === "high"
                ? "bg-[#FFB800] text-[#0D1117]"
                : "bg-[rgba(255,184,0,0.1)] border border-[rgba(255,184,0,0.3)] text-[#FFB800]"
            }`}
          >
            High
          </button>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00FFFF] via-[#7A5CFF] to-[#00FFB3]" />

        <div className="space-y-6">
          {filteredEvents.map((event, index) => {
            const Icon = getSeverityIcon(event.severity);
            const isExpanded = selectedEvent === event.id;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16"
              >
                {/* Timeline Dot */}
                <div className={`absolute left-3 top-6 w-6 h-6 rounded-full border-4 border-[#0D1117] flex items-center justify-center ${
                  event.severity === "critical" ? "bg-[#FF3864]" :
                  event.severity === "high" ? "bg-[#FFB800]" :
                  "bg-[#00FFFF]"
                }`}>
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Event Card */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedEvent(isExpanded ? null : event.id)}
                  className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6 cursor-pointer hover:border-[#00FFFF] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        event.severity === "critical" ? "bg-[rgba(255,56,100,0.1)]" :
                        event.severity === "high" ? "bg-[rgba(255,184,0,0.1)]" :
                        "bg-[rgba(0,255,255,0.1)]"
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          event.severity === "critical" ? "text-[#FF3864]" :
                          event.severity === "high" ? "text-[#FFB800]" :
                          "text-[#00FFFF]"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[#E6E8EB] mb-1">{event.title}</h4>
                        <p className="text-sm text-[#8B92A0]">{event.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusChip status={event.severity} />
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-[#8B92A0]" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-[#8B92A0]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div>Device: <span className="text-[#00FFFF]">{event.device}</span></div>
                    <div>User: <span className="text-[#7A5CFF]">{event.user}</span></div>
                  </div>

                  {/* Expanded Details */}
                  <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-[rgba(0,255,255,0.2)]">
                      <p className="text-sm text-[#E6E8EB] mb-3">Additional Details:</p>
                      <p className="text-sm text-[#8B92A0]">{event.details}</p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
