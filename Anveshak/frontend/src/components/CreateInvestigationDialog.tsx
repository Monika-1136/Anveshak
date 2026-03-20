import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { GlowButton } from "./GlowButton";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface CreateInvestigationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCase: (caseDetails: { title: string; severity: "critical" | "high" | "medium" | "low" }) => void;
}

export function CreateInvestigationDialog({ open, onOpenChange, onCreateCase }: CreateInvestigationDialogProps) {
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState<"critical" | "high" | "medium" | "low">("medium");

  const handleSubmit = () => {
    if (title) {
      onCreateCase({ title, severity });
      onOpenChange(false);
      setTitle("");
      setSeverity("medium");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[rgba(28,31,38,0.9)] border-[rgba(0,255,255,0.3)] text-white">
        <DialogHeader>
          <DialogTitle className="text-[#00FFFF]">Create New Investigation</DialogTitle>
          <DialogDescription className="text-[#8B92A0]">
            Enter the details for the new case.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm text-[#E6E8EB]">Case Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[rgba(28,31,38,0.8)] border-[rgba(0,255,255,0.3)] text-white"
              placeholder="e.g., Unauthorized server access"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="severity" className="text-sm text-[#E6E8EB]">Severity</label>
            <Select value={severity} onValueChange={(value: any) => setSeverity(value)}>
              <SelectTrigger className="bg-[rgba(28,31,38,0.8)] border-[rgba(0,255,255,0.3)] text-white">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent className="bg-[rgba(28,31,38,0.9)] border-[rgba(0,255,255,0.3)] text-white">
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <GlowButton onClick={handleSubmit} variant="primary">
            Create Case
          </GlowButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
