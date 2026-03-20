import { motion } from "motion/react";
import { Shield, Globe, Database, AlertCircle, ExternalLink, TrendingUp } from "lucide-react";

const threatFeeds = [
  { name: "MITRE ATT&CK", status: "active", lastUpdate: "2 min ago", threats: 1247, color: "#00FFFF" },
  { name: "VirusTotal", status: "active", lastUpdate: "5 min ago", threats: 892, color: "#7A5CFF" },
  { name: "MISP", status: "active", lastUpdate: "1 min ago", threats: 2341, color: "#00FFB3" },
  { name: "AbuseIPDB", status: "active", lastUpdate: "3 min ago", threats: 567, color: "#FFB800" },
];

const iocData = [
  { ip: "192.168.1.45", location: "Unknown", risk: 95, lat: 40, lng: -100 },
  { ip: "45.33.12.89", location: "Russia", risk: 87, lat: 55, lng: 37 },
  { ip: "103.45.78.23", location: "China", risk: 72, lat: 35, lng: 105 },
  { ip: "185.220.101.5", location: "Germany", risk: 45, lat: 51, lng: 10 },
];

export function ThreatIntelligence() {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h2 className="text-[#E6E8EB] mb-2">Threat Intelligence</h2>
          <p className="text-sm text-[#8B92A0]">Real-time threat correlation and analysis</p>
        </div>
        <button className="px-6 py-3 bg-[#7A5CFF] text-white rounded-lg shadow-[0_0_20px_rgba(122,92,255,0.5)] hover:shadow-[0_0_30px_rgba(122,92,255,0.8)] transition-all">
          Cross-Correlate Threat Feeds
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Feeds */}
        <div className="lg:col-span-1 space-y-4">
          {threatFeeds.map((feed, index) => (
            <motion.div
              key={feed.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-5 hover:border-[rgba(0,255,255,0.4)] transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${feed.color}20`, border: `1px solid ${feed.color}40` }}
                  >
                    <Database className="w-5 h-5" style={{ color: feed.color }} />
                  </div>
                  <div>
                    <h4 className="text-[#E6E8EB]">{feed.name}</h4>
                    <p className="text-xs text-[#8B92A0]">{feed.lastUpdate}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#8B92A0] cursor-pointer hover:text-[#00FFFF] transition-colors" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FFB3] animate-pulse" />
                  <span className="text-xs text-[#00FFB3]">{feed.status}</span>
                </div>
                <span className="text-sm" style={{ color: feed.color }}>{feed.threats.toLocaleString()} IOCs</span>
              </div>

              <div className="mt-3 text-xs text-[#8B92A0]">
                <p className="hover:text-[#00FFFF] cursor-pointer transition-colors">View details →</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* World Map with IOCs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-[#00FFFF]" />
            <h3 className="text-[#E6E8EB]">Global Threat Map</h3>
          </div>

          {/* Simplified World Map Visualization */}
          <div className="relative h-96 bg-[rgba(0,0,0,0.3)] rounded-xl overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Simple world map outline */}
              <path
                d="M 100 100 L 200 80 L 300 120 L 400 100 L 500 130 L 600 110 L 700 140 L 700 300 L 100 300 Z"
                fill="rgba(0,255,255,0.05)"
                stroke="rgba(0,255,255,0.3)"
                strokeWidth="1"
              />

              {/* IOC Nodes */}
              {iocData.map((ioc, index) => {
                const x = (ioc.lng + 180) * (800 / 360);
                const y = (90 - ioc.lat) * (400 / 180);
                const riskColor =
                  ioc.risk > 80 ? "#FF3864" :
                  ioc.risk > 60 ? "#FFB800" :
                  "#00FFB3";

                return (
                  <g key={index}>
                    <motion.circle
                      cx={x}
                      cy={y}
                      r="20"
                      fill={`${riskColor}20`}
                      stroke={riskColor}
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill={riskColor}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-[rgba(28,31,38,0.9)] border border-[rgba(0,255,255,0.2)] rounded-lg p-3">
              <p className="text-xs text-[#8B92A0] mb-2">Risk Level</p>
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#00FFB3]" />
                  <span className="text-xs text-[#E6E8EB]">Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FFB800]" />
                  <span className="text-xs text-[#E6E8EB]">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF3864]" />
                  <span className="text-xs text-[#E6E8EB]">High</span>
                </div>
              </div>
            </div>
          </div>

          {/* IOC List */}
          <div className="mt-6 space-y-2">
            {iocData.map((ioc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.3)] border border-[rgba(0,255,255,0.1)] rounded-lg hover:border-[rgba(0,255,255,0.3)] transition-all"
              >
                <div className="flex items-center gap-4">
                  <AlertCircle
                    className="w-5 h-5"
                    style={{
                      color: ioc.risk > 80 ? "#FF3864" : ioc.risk > 60 ? "#FFB800" : "#00FFB3",
                    }}
                  />
                  <div>
                    <p className="text-sm text-[#00FFFF] font-mono">{ioc.ip}</p>
                    <p className="text-xs text-[#8B92A0]">{ioc.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <div className="h-2 bg-[#2A2D35] rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          ioc.risk > 80 ? "bg-[#FF3864]" :
                          ioc.risk > 60 ? "bg-[#FFB800]" :
                          "bg-[#00FFB3]"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${ioc.risk}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-[#E6E8EB] min-w-[3rem] text-right">{ioc.risk}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
