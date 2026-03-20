import { motion } from "motion/react";
import { Shield, Clock, User, FileCheck, Settings, Users } from "lucide-react";
import { Link } from "react-router-dom";

const custodyRecords = [
  {
    hash: "a3f5c9d2e1b4f7a8c6d9e2f5a7b3c1d8",
    timestamp: "2025-10-08 14:32:15",
    handler: "Alex Rivera",
    action: "Evidence Collected",
  },
  {
    hash: "a3f5c9d2e1b4f7a8c6d9e2f5a7b3c1d8",
    timestamp: "2025-10-08 14:35:42",
    handler: "Forensic AI System",
    action: "Hash Verification",
  },
  {
    hash: "a3f5c9d2e1b4f7a8c6d9e2f5a7b3c1d8",
    timestamp: "2025-10-08 14:38:20",
    handler: "Jordan Lee",
    action: "Analysis Started",
  },
  {
    hash: "a3f5c9d2e1b4f7a8c6d9e2f5a7b3c1d8",
    timestamp: "2025-10-08 15:12:05",
    handler: "Sam Chen",
    action: "Report Generated",
  },
];

export function ChainOfCustody() {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-[#E6E8EB] mb-2">Chain of Custody & Settings</h2>
        <p className="text-sm text-[#8B92A0]">Evidence integrity and system configuration</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chain of Custody Table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <FileCheck className="w-5 h-5 text-[#00FFFF]" />
            <h3 className="text-[#E6E8EB]">Evidence Chain of Custody</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(0,255,255,0.2)]">
                  <th className="text-left py-3 px-2 text-sm text-[#8B92A0]">Hash</th>
                  <th className="text-left py-3 px-2 text-sm text-[#8B92A0]">Timestamp</th>
                  <th className="text-left py-3 px-2 text-sm text-[#8B92A0]">Handler</th>
                </tr>
              </thead>
              <tbody>
                {custodyRecords.map((record, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-[rgba(0,255,255,0.1)] hover:bg-[rgba(0,255,255,0.05)] transition-colors"
                  >
                    <td className="py-3 px-2 text-xs text-[#00FFFF] font-mono">
                      {record.hash.substring(0, 8)}...
                    </td>
                    <td className="py-3 px-2 text-xs text-[#E6E8EB]">{record.timestamp}</td>
                    <td className="py-3 px-2 text-xs text-[#8B92A0]">{record.handler}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Timeline Visualization */}
          <div className="mt-6 pt-6 border-t border-[rgba(0,255,255,0.2)]">
            <h4 className="text-sm text-[#E6E8EB] mb-4">Custody Timeline</h4>
            <div className="space-y-4">
              {custodyRecords.map((record, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-[rgba(0,255,255,0.1)] border-2 border-[#00FFFF] flex items-center justify-center">
                      {index === 0 ? <Shield className="w-4 h-4 text-[#00FFFF]" /> :
                       index === 1 ? <FileCheck className="w-4 h-4 text-[#00FFFF]" /> :
                       index === 2 ? <User className="w-4 h-4 text-[#00FFFF]" /> :
                       <Clock className="w-4 h-4 text-[#00FFFF]" />}
                    </div>
                    {index < custodyRecords.length - 1 && (
                      <div className="absolute left-4 top-8 w-0.5 h-8 bg-[rgba(0,255,255,0.3)]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#E6E8EB]">{record.action}</p>
                    <p className="text-xs text-[#8B92A0]">{record.handler}</p>
                    <p className="text-xs text-[#8B92A0]">{record.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-[rgba(0,255,179,0.1)] border border-[rgba(0,255,179,0.3)] rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[#00FFB3]" />
              <p className="text-sm text-[#E6E8EB]">Blockchain Ledger</p>
              <span className="ml-auto text-xs bg-[rgba(255,184,0,0.2)] text-[#FFB800] px-2 py-1 rounded-full">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-[#8B92A0]">
              Future releases will support immutable blockchain-based custody tracking
            </p>
          </div>
        </motion.div>

        {/* Settings Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* User Settings */}
          <div className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(122,92,255,0.2)] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-[#7A5CFF]" />
              <h3 className="text-[#E6E8EB]">User Settings</h3>
            </div>

            <div className="space-y-4">


              {/* Manage Roles */}
              <Link to="/user-management" className="flex items-center justify-between p-4 bg-[rgba(0,0,0,0.3)] rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#00FFB3]" />
                  <div>
                    <p className="text-sm text-[#E6E8EB]">Manage User Roles</p>
                    <p className="text-xs text-[#8B92A0]">Configure access permissions</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          {/* System Status */}
          <div className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,179,0.2)] rounded-2xl p-6">
            <h3 className="text-[#E6E8EB] mb-4">System Status</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8B92A0]">Database Connection</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FFB3] animate-pulse" />
                  <span className="text-sm text-[#00FFB3]">Active</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8B92A0]">AI Engine</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FFB3] animate-pulse" />
                  <span className="text-sm text-[#00FFB3]">Running</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                {/* Threat Feed Sync label removed */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FFB3] animate-pulse" />
                  <span className="text-sm text-[#00FFB3]">Synced</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
