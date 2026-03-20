import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GlowButton } from "./GlowButton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { getAvailableTextFiles, TextFileInfo } from "../utils/fileUtils";

interface ReportsChooserProps {
  // Remove dependency on columns
}

export function ReportsChooser({}: ReportsChooserProps = {}) {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [availableFiles, setAvailableFiles] = useState<TextFileInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const files = await getAvailableTextFiles();
        setAvailableFiles(files);
      } catch (error) {
        console.error('Error loading text files:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFiles();
  }, []);


  const handleProceed = () => {
    if (!selectedFile) {
      alert('Please select a text file to analyze');
      return;
    }
    const selectedFileInfo = availableFiles.find(f => f.path === selectedFile);
    // navigate to the existing report generator page and pass selected file data
    navigate('/reports/generate', { state: { selectedFile: selectedFileInfo } });
  };

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto bg-[rgba(28,31,38,0.9)] text-white rounded-2xl p-6">
        <h2 className="text-[#00FFFF] text-2xl mb-4">Generate Analysis Report</h2>
        <p className="text-[#8B92A0] mb-6">Select a text file from the analysis results to generate a comprehensive forensic report.</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#E6E8EB] mb-1 block">Analysis File</label>
            {loading ? (
              <div className="text-[#8B92A0] p-4 text-center">Loading available files...</div>
            ) : (
              <Select value={selectedFile} onValueChange={setSelectedFile}>
                <SelectTrigger className="bg-[rgba(28,31,38,0.8)] border-[rgba(0,255,255,0.3)] text-white">
                  <SelectValue placeholder="Select Analysis File" />
                </SelectTrigger>
                <SelectContent className="bg-[rgba(28,31,38,0.9)] border-[rgba(0,255,255,0.3)] text-white">
                  {availableFiles.map(file => (
                    <SelectItem key={file.path} value={file.path}>
                      {file.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* File upload removed per request */}

          <div className="flex justify-end gap-4 mt-6">
            <GlowButton variant="secondary" onClick={() => navigate(-1)}>Cancel</GlowButton>
            <GlowButton variant="primary" onClick={handleProceed}>Generate Report</GlowButton>
          </div>
        </div>
      </div>
    </div>
  );
}
