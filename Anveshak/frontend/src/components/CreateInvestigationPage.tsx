import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlowButton } from "./GlowButton";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface CreateInvestigationPageProps {
  onCreateCase: (caseDetails: { 
    caseName: string; 
    caseId: string; 
    description: string; 
    assignedInvestigator: string; 
    priority: "critical" | "high" | "medium" | "low"; 
    startDate: string; 
  }) => void;
}

export function CreateInvestigationPage({ onCreateCase }: CreateInvestigationPageProps) {
  const [caseName, setCaseName] = useState("");
  const [caseId, setCaseId] = useState("");
  const [description, setDescription] = useState("");
  const [assignedInvestigator, setAssignedInvestigator] = useState("");
  const [priority, setPriority] = useState<"critical" | "high" | "medium" | "low">("medium");
  const [startDate, setStartDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    const errors: string[] = [];
    if (!caseName.trim()) errors.push("Case name is required");
    if (!caseId.trim()) errors.push("Case ID is required");
    if (!description.trim()) errors.push("Description is required");
    if (!assignedInvestigator.trim()) errors.push("Assigned investigator is required");
    if (!startDate) errors.push("Start date is required");

    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"));
      return;
    }

    onCreateCase({ caseName, caseId, description, assignedInvestigator, priority, startDate });
    navigate('/cases');
  };

  return (
    <div className="p-6">
      <div className="bg-[rgba(28,31,38,0.9)] backdrop-blur-xl border border-[rgba(0,255,255,0.3)] text-white rounded-2xl p-6 w-full max-w-2xl mx-auto">
        <h2 className="text-[#00FFFF] text-2xl mb-4">Create New Investigation</h2>
        <p className="text-[#8B92A0] mb-6">Enter the details for the new case.</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="caseName" className="text-sm text-[#E6E8EB]">Case Name</label>
            <Input id="caseName" value={caseName} onChange={(e) => setCaseName(e.target.value)} placeholder="e.g., Unauthorized server access" />
            {!caseName.trim() && <p className="text-xs text-[#FF6B6B]">Case name is required</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="caseId" className="text-sm text-[#E6E8EB]">Case ID</label>
            <Input id="caseId" value={caseId} onChange={(e) => setCaseId(e.target.value)} placeholder="e.g., FR-2025-1046" />
            {!caseId.trim() && <p className="text-xs text-[#FF6B6B]">Case ID is required</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm text-[#E6E8EB]">Description</label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A brief description of the case..." />
            {!description.trim() && <p className="text-xs text-[#FF6B6B]">Description is required</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="assignedInvestigator" className="text-sm text-[#E6E8EB]">Assigned Investigator</label>
            <Select value={assignedInvestigator} onValueChange={setAssignedInvestigator}>
              <SelectTrigger className="w-full bg-[rgba(28,31,38,0.8)] border-[rgba(0,255,255,0.3)] text-white">
                <SelectValue placeholder="Select an investigator" />
              </SelectTrigger>
              <SelectContent className="w-full bg-[rgba(28,31,38,0.98)] backdrop-blur-xl border-[rgba(0,255,255,0.3)]">
                <SelectItem value="Alex Rivera">Alex Rivera</SelectItem>
                <SelectItem value="Jordan Lee">Jordan Lee</SelectItem>
                <SelectItem value="Sam Chen">Sam Chen</SelectItem>
                <SelectItem value="Morgan Taylor">Morgan Taylor</SelectItem>
              </SelectContent>
            </Select>
            {!assignedInvestigator && <p className="text-xs text-[#FF6B6B]">Please assign an investigator</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm text-[#E6E8EB]">Priority</label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger className="w-full bg-[rgba(28,31,38,0.8)] border-[rgba(0,255,255,0.3)] text-white">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="w-full bg-[rgba(28,31,38,0.98)] backdrop-blur-xl border-[rgba(0,255,255,0.3)]">
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm text-[#E6E8EB]">Start Date</label>
            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            {!startDate && <p className="text-xs text-[#FF6B6B]">Start date is required</p>}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <GlowButton onClick={() => navigate(-1)} variant="secondary">Cancel</GlowButton>
          <GlowButton onClick={handleSubmit} variant="primary">Create Case</GlowButton>
        </div>
      </div>
    </div>
  );
}