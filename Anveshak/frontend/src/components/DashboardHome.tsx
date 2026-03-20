import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "./StatCard";
import { GlowButton } from "./GlowButton";
import { StatusChip } from "./StatusChip";
import { motion } from "motion/react";
// create-investigation now handled by dedicated route
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { 
  FolderOpen, 
  Brain, 
  ListTodo,
  Plus,
  Upload
} from "lucide-react";

interface DashboardHomeProps {
  onCreateCase: (caseDetails: { 
    caseName: string; 
    caseId: string; 
    description: string; 
    assignedInvestigator: string; 
    priority: "critical" | "high" | "medium" | "low";
    startDate: string;
  }) => void;
}

const recentCases = [
  { id: "FR-2025-1045", title: "Unauthorized Access - Finance Server", status: "critical" as const, investigator: "Alex Rivera", date: "2025-10-08", confidence: 94 },
  // Threat-related case removed
  { id: "FR-2025-1043", title: "Data Exfiltration Attempt", status: "medium" as const, investigator: "Sam Chen", date: "2025-10-07", confidence: 76 },
  { id: "FR-2025-1042", title: "Phishing Campaign Analysis", status: "low" as const, investigator: "Morgan Taylor", date: "2025-10-06", confidence: 92 },
  { id: "FR-2025-1041", title: "Privilege Escalation", status: "high" as const, investigator: "Alex Rivera", date: "2025-10-06", confidence: 88 },
];

export function DashboardHome({ onCreateCase }: DashboardHomeProps) {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Cases"
          value="1,247"
          icon={FolderOpen}
          trend="+12%"
          color="cyan"
        />
        <StatCard
          title="AI Confidence"
          value="94.2%"
          icon={Brain}
          trend="+2.1%"
          color="violet"
        />
        <StatCard
          title="Open Tasks"
          value="156"
          icon={ListTodo}
          trend="-8%"
          color="green"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cases Table */}
        <div className="lg:col-span-3 bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#E6E8EB]">Recent Cases</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <GlowButton className="text-sm px-4 py-2 flex items-center gap-2">
                  <Plus className="w-4 h-4 inline mr-2" />
                  New
                </GlowButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-[220px] bg-[#1a1d24] border border-cyan-400/50 shadow-lg rounded-xl p-2 text-white z-50"
                style={{ boxShadow: '0 4px 24px rgba(0,255,255,0.15)' }}
              >
                <DropdownMenuItem
                  onSelect={() => navigate('/create-investigation')}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-900/30 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-2 text-cyan-400" />
                  <span className="font-semibold text-cyan-200">Create Investigation</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => navigate("/intake")}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-cyan-900/30 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2 text-cyan-400" />
                  <span className="font-semibold text-cyan-200">Upload Evidence</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(0,255,255,0.2)]">
                  <th className="text-left py-3 px-4 text-sm text-[#8B92A0]">Case ID</th>
                  <th className="text-left py-3 px-4 text-sm text-[#8B92A0]">Title</th>
                  <th className="text-left py-3 px-4 text-sm text-[#8B92A0]">Priority</th>
                  <th className="text-left py-3 px-4 text-sm text-[#8B92A0]">Investigator</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((caseItem, index) => (
                  <motion.tr
                    key={caseItem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-[rgba(0,255,255,0.1)] hover:bg-[rgba(0,255,255,0.05)] cursor-pointer transition-colors"
                    onClick={() => navigate("/analysis")}
                  >
                    <td className="py-4 px-4 text-sm text-[#00FFFF]">{caseItem.id}</td>
                    <td className="py-4 px-4 text-sm text-[#E6E8EB]">{caseItem.title}</td>
                    <td className="py-4 px-4">
                      <StatusChip status={caseItem.status} />
                    </td>
                    <td className="py-4 px-4 text-sm text-[#8B92A0]">{caseItem.investigator}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
