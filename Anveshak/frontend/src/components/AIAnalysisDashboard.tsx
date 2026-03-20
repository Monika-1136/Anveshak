import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Brain, Activity, AlertTriangle, Shield, TrendingUp, Clock, FileText, Search, RefreshCw } from "lucide-react";
import { getAvailableTextFiles, TextFileInfo } from "../utils/fileUtils";
import { parseAnalysisFile, ParsedAnalysisData, getSeverityColor, getRiskLevelColor, formatAnalysisDate } from "../utils/analysisUtils";
import { AnalysisDetailPopup } from "./AnalysisDetailPopup";

export function AIAnalysisDashboard() {
  const [availableFiles, setAvailableFiles] = useState<TextFileInfo[]>([]);
  const [analysisData, setAnalysisData] = useState<ParsedAnalysisData[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ParsedAnalysisData | null>(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<string>("all");

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = async () => {
    setLoading(true);
    try {
      const files = await getAvailableTextFiles();
      setAvailableFiles(files);
      
      const analysisPromises = files.map(file => 
        parseAnalysisFile(file.path, file.name)
      );
      
      const results = await Promise.all(analysisPromises);
      const validResults = results.filter((result): result is ParsedAnalysisData => result !== null);
      setAnalysisData(validResults);
    } catch (error) {
      console.error('Error loading analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisClick = (analysis: ParsedAnalysisData) => {
    setSelectedAnalysis(analysis);
    setShowDetailPopup(true);
  };

  const handleClosePopup = () => {
    setShowDetailPopup(false);
    setSelectedAnalysis(null);
  };

  const filteredAnalysis = analysisData.filter(analysis => {
    const matchesSearch = analysis.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRisk === 'all' || analysis.metrics.riskLevel === filterRisk.toUpperCase();
    return matchesSearch && matchesFilter;
  });

  const totalAnalyses = analysisData.length;
  const criticalCount = analysisData.filter(a => a.metrics.riskLevel === 'CRITICAL').length;
  const highRiskCount = analysisData.filter(a => a.metrics.riskLevel === 'HIGH').length;
  const totalFindings = analysisData.reduce((sum, a) => sum + a.metrics.totalFindings, 0);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-4 text-[#00FFFF]"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-8 h-8" />
          </motion.div>
          <p className="text-lg text-[#E6E8EB]">Loading analysis data...</p>
        </motion.div>
      </div>
    );
  }


  return (
    <>
      <div className="p-4">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-gradient-to-r from-[rgba(122,92,255,0.2)] to-[rgba(0,255,255,0.2)] border border-[#7A5CFF] rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-[#7A5CFF]" />
              <div>
                <h1 className="text-xl text-[#E6E8EB] font-bold">AI Analysis Dashboard</h1>
                <p className="text-sm text-[#8B92A0]">Review forensic analysis results</p>
              </div>
            </div>
            <button
              onClick={loadAnalysisData}
              className="flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,255,255,0.1)] border border-[rgba(0,255,255,0.3)] rounded-lg text-[#00FFFF] hover:bg-[rgba(0,255,255,0.2)] transition-colors text-sm"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Compact Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#00FFFF]" />
              <div>
                <p className="text-lg font-bold text-[#00FFFF]">{totalAnalyses}</p>
                <p className="text-xs text-[#8B92A0]">Total</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(255,56,100,0.2)] rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-[#FF3864]" />
              <div>
                <p className="text-lg font-bold text-[#FF3864]">{criticalCount}</p>
                <p className="text-xs text-[#8B92A0]">Critical</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(255,184,0,0.2)] rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#FFB800]" />
              <div>
                <p className="text-lg font-bold text-[#FFB800]">{highRiskCount}</p>
                <p className="text-xs text-[#8B92A0]">High Risk</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,179,0.2)] rounded-lg p-3"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#00FFB3]" />
              <div>
                <p className="text-lg font-bold text-[#00FFB3]">{totalFindings}</p>
                <p className="text-xs text-[#8B92A0]">Findings</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Compact Filter and Search */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8B92A0]" />
            <input
              type="text"
              placeholder="Search analyses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[rgba(28,31,38,0.6)] border border-[rgba(0,255,255,0.2)] rounded-lg focus:border-[#00FFFF] focus:outline-none text-[#E6E8EB] placeholder-[#8B92A0] text-sm"
            />
          </div>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-3 py-2 bg-[rgba(28,31,38,0.6)] border border-[rgba(0,255,255,0.2)] rounded-lg focus:border-[#00FFFF] focus:outline-none text-[#E6E8EB] text-sm"
          >
            <option value="all">All Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Compact Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {filteredAnalysis.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-3 text-[#8B92A0]" />
              <h3 className="text-lg text-[#E6E8EB] mb-2">No Analysis Found</h3>
              <p className="text-[#8B92A0] text-sm">No analyses match your current filters.</p>
            </div>
          ) : (
            filteredAnalysis.map((analysis, index) => (
              <motion.div
                key={analysis.filePath}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleAnalysisClick(analysis)}
                className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border-2 border-[rgba(0,255,255,0.2)] rounded-lg p-4 cursor-pointer hover:border-[rgba(0,255,255,0.4)] hover:bg-[rgba(28,31,38,0.8)] transition-all duration-300 group"
              >
                {/* Analysis Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-[#E6E8EB] mb-1 group-hover:text-[#00FFFF] transition-colors truncate">
                      {analysis.fileName}
                    </h3>
                    <p className="text-xs text-[#8B92A0] line-clamp-2 leading-relaxed">{analysis.summary}</p>
                  </div>
                  <div 
                    className="ml-2 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap flex-shrink-0"
                    style={{ 
                      backgroundColor: `${getRiskLevelColor(analysis.metrics.riskLevel)}20`,
                      color: getRiskLevelColor(analysis.metrics.riskLevel),
                      border: `1px solid ${getRiskLevelColor(analysis.metrics.riskLevel)}40`
                    }}
                  >
                    {analysis.metrics.riskLevel}
                  </div>
                </div>

                {/* Compact Key Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <AlertTriangle 
                        className="w-3 h-3" 
                        style={{ color: getSeverityColor('CRITICAL') }}
                      />
                      <span className="text-lg font-bold text-[#FF3864]">
                        {analysis.metrics.criticalIssues}
                      </span>
                    </div>
                    <p className="text-xs text-[#8B92A0]">Critical</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3 text-[#00FFFF]" />
                      <span className="text-lg font-bold text-[#00FFFF]">
                        {analysis.metrics.totalFindings}
                      </span>
                    </div>
                    <p className="text-xs text-[#8B92A0]">Total</p>
                  </div>
                </div>

                {/* Compact Security Score Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#8B92A0]">Security Score</span>
                    <span className="text-xs font-bold text-[#E6E8EB]">{analysis.metrics.securityScore}/100</span>
                  </div>
                  <div className="w-full bg-[rgba(0,0,0,0.3)] rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.metrics.securityScore}%` }}
                      transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
                      className="h-1.5 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${getRiskLevelColor(analysis.metrics.riskLevel)}, ${getRiskLevelColor(analysis.metrics.riskLevel)}80)`
                      }}
                    />
                  </div>
                </div>

                {/* Compact Footer */}
                <div className="flex items-center justify-between text-xs text-[#8B92A0]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span className="truncate">{formatAnalysisDate(analysis.analysisDate)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#00FFFF] opacity-0 group-hover:opacity-100 transition-opacity">
                    <FileText className="w-3 h-3" />
                    <span className="text-xs">Details</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      
      {/* Analysis Detail Popup */}
      <AnalysisDetailPopup 
        analysis={selectedAnalysis}
        isOpen={showDetailPopup}
        onClose={handleClosePopup}
      />
    </>
  );
}
