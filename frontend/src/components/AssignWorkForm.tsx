
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export function AssignWorkForm({ onClose }: { onClose: () => void }) {
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const [caseId, setCaseId] = useState("");
  const [task, setTask] = useState("");

  const handleAssignWork = () => {
    if (!fullName || !userId || !caseId || !task) {
      alert("Please fill in all fields.");
      return;
    }
    // Handle assign work logic here
    console.log("Assigning work:", { fullName, userId, caseId, task });
    onClose();
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[rgba(28,31,38,0.9)] backdrop-blur-xl border border-[rgba(0,255,179,0.2)] rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-[#E6E8EB] mb-4">Assign Work</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              placeholder="Enter user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="caseId">Case ID</Label>
            <Input
              id="caseId"
              placeholder="Enter case ID"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="task">Task</Label>
            <Textarea
              id="task"
              placeholder="Enter task description"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAssignWork}>Assign</Button>
        </div>
      </div>
    </div>
  );
}
