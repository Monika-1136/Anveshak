import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Paperclip, Download, User, Calendar, Clock, Shield } from "lucide-react";
import { StatusChip } from "./StatusChip";
import { GlowButton } from "./GlowButton";

// Mock data for files, as the original case object only has an attachment count.
const mockFiles = [
  { name: "evidence_log_2025-10-08.log", type: "LOG", size: "2.5 MB", date: "2025-10-08", uploader: "Alex Rivera", content: "Timestamp: 2025-10-08T14:32:15Z | Event: Unauthorized Login Attempt | Source IP: 192.168.1.45 | Status: Failed" },
  { name: "network_traffic.pcap", type: "PCAP", size: "15.2 MB", date: "2025-10-08", uploader: "Alex Rivera", content: "Binary PCAP data..." },
  { name: "disk_image.dd", type: "DD", size: "1.2 GB", date: "2025-10-08", uploader: "Alex Rivera", content: "Binary disk image data..." },
  { name: "memory_dump.E01", type: "E01", size: "512 MB", date: "2025-10-08", uploader: "Alex Rivera", content: "Binary memory dump data..." },
  { name: "suspicious_payload.json", type: "JSON", size: "128 KB", date: "2025-10-08", uploader: "Alex Rivera", content: '{ "payload": "base64-encoded-string", "type": "dropper" }' },
];

const priorityColors = {
  critical: "bg-red-500/20 text-red-400 border-red-500/50",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/50",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  low: "bg-green-500/20 text-green-400 border-green-500/50",
};

export function CaseDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { caseItem } = location.state || {}; // Get case data from navigation state

  const handleDownload = (fileName: string, fileContent: string) => {
    // Create a blob from the mock content
    const blob = new Blob([fileContent], { type: "application/octet-stream" });
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!caseItem) {
    return (
      <div className="p-6 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Case Not Found</h2>
        <p className="text-gray-400 mb-6">The case you are looking for does not exist or was not properly loaded.</p>
        <GlowButton onClick={() => navigate("/cases")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cases
        </GlowButton>
      </div>
    );
  }

  const { id, title, status, investigator, date, severity } = caseItem;

  return (
    <div className="p-6 space-y-6 text-white">
      {/* Back Navigation */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4">
        <ArrowLeft className="w-5 h-5" />
        <span className="font-semibold">Back to Cases</span>
      </button>

      {/* Header Section */}
      <div className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-sm text-cyan-400 font-mono">{id}</p>
          <h1 className="text-3xl font-bold text-white mt-1">{title}</h1>
        </div>
        <div className="flex-shrink-0">
          <StatusChip status={status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview Section */}
        <div className="lg:col-span-1 bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-semibold text-[#E6E8EB] mb-4">Overview</h3>
          <div className="flex items-center justify-between">
            <span className="text-[#8B92A0] flex items-center"><Shield className="w-4 h-4 mr-2" /> Priority</span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${priorityColors[severity]}`}>
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8B92A0] flex items-center"><User className="w-4 h-4 mr-2" /> Assigned To</span>
            <span className="text-[#E6E8EB]">{investigator}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8B92A0] flex items-center"><Calendar className="w-4 h-4 mr-2" /> Created Date</span>
            <span className="text-[#E6E8EB]">{date}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8B92A0] flex items-center"><Clock className="w-4 h-4 mr-2" /> Last Updated</span>
            <span className="text-[#E6E8EB]">{new Date().toISOString().split("T")[0]}</span>
          </div>
           <div className="flex items-center justify-between">
            <span className="text-[#8B92A0] flex items-center"><Paperclip className="w-4 h-4 mr-2" /> Case Type</span>
            <span className="text-[#E6E8EB]">Cybercrime</span>
          </div>
        </div>

        {/* Files Section */}
        <div className="lg:col-span-2 bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Paperclip className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-semibold text-[#E6E8EB]">Evidence Files</h3>
            <span className="text-sm text-[#8B92A0] ml-auto">Number of Files: {mockFiles.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(0,255,255,0.2)]">
                  <th className="text-left py-3 px-4 text-[#8B92A0] font-semibold">File Name</th>
                  <th className="text-left py-3 px-4 text-[#8B92A0] font-semibold">Type</th>
                  <th className="text-left py-3 px-4 text-[#8B92A0] font-semibold">Size</th>
                  <th className="text-left py-3 px-4 text-[#8B92A0] font-semibold">Uploaded</th>
                  <th className="text-left py-3 px-4 text-[#8B92A0] font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockFiles.map((file, index) => (
                  <tr key={index} className="border-b border-[rgba(0,255,255,0.1)] hover:bg-[rgba(0,255,255,0.05)] transition-colors">
                    <td className="py-4 px-4 text-[#E6E8EB]">{file.name}</td>
                    <td className="py-4 px-4">
                      <span className="bg-gray-700 text-gray-300 text-xs font-mono px-2 py-1 rounded">{file.type}</span>
                    </td>
                    <td className="py-4 px-4 text-[#8B92A0]">{file.size}</td>
                    <td className="py-4 px-4 text-[#8B92A0]">{file.date}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleDownload(file.name, file.content)}
                        className="text-cyan-400 hover:text-cyan-200 transition-colors p-1"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}