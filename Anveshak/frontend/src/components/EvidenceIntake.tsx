import { useState, useRef, useEffect } from "react";
import { GlowButton } from "./GlowButton";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, HardDrive, Shield, CheckCircle2, AlertTriangle, X, Loader, Server, FileJson, Clock, Inbox } from "lucide-react";

// Define the structure for a file being managed by the component
interface ManagedFile {
  id: string;
  file: File;
  name: string;
  size: string;
  hash: string;
  timestamp: string;
  status: 'queued' | 'uploading' | 'analyzing' | 'complete' | 'error';
  error?: string;
  analysisFile?: string;
}

// Define the structure for a completed analysis report from the backend
interface AnalysisReport {
  filename: string;
  upload_timestamp: string;
  size: number;
  hash: string;
  score: number;
  details: string;
}

export function EvidenceIntake() {
  const [filesToUpload, setFilesToUpload] = useState<ManagedFile[]>([]);
  const [analysisReports, setAnalysisReports] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch existing analysis reports on component mount
  useEffect(() => {
    fetchAnalysisReports();
  }, []);

  const fetchAnalysisReports = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/analysis/list");
      if (response.ok) {
        const data = await response.json();
        setAnalysisReports(data);
      }
    } catch (error) {
      console.error("Failed to fetch analysis reports:", error);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection from the file browser or drag-and-drop
  const handleFileChange = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const managedFiles = await Promise.all(
      Array.from(selectedFiles).map(async (file) => {
        const hash = await calculateFileHash(file);
        return {
          id: `${file.name}-${file.lastModified}`,
          file,
          name: file.name,
          size: formatFileSize(file.size),
          hash,
          timestamp: new Date().toLocaleString(),
          status: 'queued',
        } as ManagedFile;
      })
    );

    setFilesToUpload(prevFiles => [...prevFiles, ...managedFiles.filter(mf => !prevFiles.some(pf => pf.id === mf.id))]);
  };

  const calculateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Handle the analysis of all queued files
  const handleAnalyze = async () => {
    const queuedFiles = filesToUpload.filter(f => f.status === 'queued');
    if (queuedFiles.length === 0) return;

    setFilesToUpload(prev => prev.map(f => queuedFiles.some(qf => qf.id === f.id) ? { ...f, status: 'uploading' } : f));

    const formData = new FormData();
    queuedFiles.forEach(f => formData.append("files", f.file));

    try {
      const response = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      setFilesToUpload(prev => prev.map(f => queuedFiles.some(qf => qf.id === f.id) ? { ...f, status: 'complete', analysisFile: result.analysis_files.find(af => af.includes(f.name.split('.')[0])) } : f));
      fetchAnalysisReports(); // Refresh the list of reports

    } catch (error: any) {
      console.error("Analysis failed:", error);
      setFilesToUpload(prev => prev.map(f => queuedFiles.some(qf => qf.id === f.id) ? { ...f, status: 'error', error: error.message } : f));
    }
  };

  const viewReport = async (filename: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/analysis/${filename}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedReport(data);
        setIsReportModalOpen(true);
      } else {
        throw new Error('Failed to fetch report');
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
    }
  };

  const getStatusChip = (status: ManagedFile['status']) => {
    switch (status) {
      case 'queued': return <div className="flex items-center gap-2 text-yellow-400"><Clock className="w-4 h-4" />Queued</div>;
      case 'uploading': return <div className="flex items-center gap-2 text-blue-400"><Loader className="w-4 h-4 animate-spin" />Analyzing...</div>;
      case 'complete': return <div className="flex items-center gap-2 text-green-400"><CheckCircle2 className="w-4 h-4" />Complete</div>;
      case 'error': return <div className="flex items-center gap-2 text-red-400"><AlertTriangle className="w-4 h-4" />Error</div>;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-white">
      <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files)} style={{ display: "none" }} multiple accept=".log,.pcap,.dd,.E01,.json,.xml,.csv,.eml,.txt,.mem,.bin,.img,.bat,.gz,.zip,.tar" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-2xl font-bold text-[#E6E8EB] mb-2">Evidence Intake & Analysis</h2>
        <p className="text-sm text-[#8B92A0]">Upload, analyze, and review forensic artifacts.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upload & Queue */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="border-2 border-dashed border-[rgba(0,255,255,0.3)] bg-[rgba(28,31,38,0.6)] hover:border-[#00FFFF] rounded-2xl p-12 text-center flex flex-col items-center justify-center transition-all"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFileChange(e.dataTransfer.files); }}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-[#8B92A0]" />
            <h3 className="text-lg font-semibold text-[#E6E8EB] mb-2">Drop evidence files here or browse</h3>
            <p className="text-sm text-[#8B92A0] mb-6">Files will be added to the queue below.</p>
            <GlowButton onClick={handleBrowseClick}>Browse Files</GlowButton>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#E6E8EB]">Evidence Queue</h3>
              <GlowButton onClick={handleAnalyze} disabled={filesToUpload.filter(f => f.status === 'queued').length === 0} className="text-sm">
                Analyze Queued Files
              </GlowButton>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {filesToUpload.length > 0 ? filesToUpload.map(file => (
                <motion.div key={file.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-black bg-opacity-20 p-4 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <File className="w-5 h-5 text-[#00FFFF] mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-base font-medium text-[#E6E8EB] break-all">{file.name}</p>
                      <p className="text-sm text-[#8B92A0]">Size: {file.size}</p>
                    </div>
                    <div className="text-sm font-semibold">{getStatusChip(file.status)}</div>
                  </div>
                  {file.status === 'error' && <p className="text-xs text-red-400 pl-8">{file.error}</p>}
                  {file.status === 'complete' && <p className="text-xs text-green-400 pl-8">Report: {file.analysisFile}</p>}
                </motion.div>
              )) : (
                <div className="text-center py-10 flex flex-col items-center justify-center">
                  <Inbox className="w-12 h-12 mx-auto mb-4 text-[#8B92A0] opacity-30" />
                  <p className="text-base font-semibold text-[#8B92A0]">Queue is empty.</p>
                  <p className="text-sm text-[#5F6773]">Drop files above to get started.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Analysis Reports */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Server className="w-6 h-6 text-[#00FFB3]" />
            <h3 className="text-lg font-semibold text-[#E6E8EB]">Completed Analyses</h3>
          </div>
          <div className="space-y-3 max-h-[30rem] overflow-y-auto pr-2">
            {analysisReports.length > 0 ? analysisReports.map((reportName) => (
              <motion.div key={reportName} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-black bg-opacity-20 p-3 rounded-lg flex items-center justify-between hover:bg-opacity-30 transition-colors cursor-pointer" onClick={() => viewReport(reportName)}>
                <div className="flex items-center gap-3">
                  <FileJson className="w-5 h-5 text-[#00FFFF]" />
                  <p className="text-sm font-medium text-[#E6E8EB] break-all">{reportName}</p>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-16 flex flex-col items-center justify-center">
                <Server className="w-12 h-12 mx-auto mb-4 text-[#8B92A0] opacity-30" />
                <p className="text-base font-semibold text-[#8B92A0]">No analysis reports found.</p>
                <p className="text-sm text-[#5F6773]">Run an analysis to see reports here.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Report Viewer Modal */}
      <AnimatePresence>
        {isReportModalOpen && selectedReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[rgba(28,31,38,0.9)] backdrop-blur-lg border border-[rgba(0,255,255,0.2)] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#E6E8EB]">Analysis Report: {selectedReport.filename}</h3>
                <button onClick={() => setIsReportModalOpen(false)} className="text-[#8B92A0] hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="overflow-y-auto pr-2 bg-black bg-opacity-30 p-4 rounded-lg">
                <pre className="text-sm text-white whitespace-pre-wrap break-all">
                  {JSON.stringify(selectedReport, null, 2)}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}