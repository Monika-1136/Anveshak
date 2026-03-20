
import { useState } from "react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export function ChangeRoleForm({ onClose }: { onClose: () => void }) {
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("");

  const handleChangeRole = () => {
    if (!fullName || !userId || !role) {
      alert("Please fill in all fields.");
      return;
    }
    // Handle role change logic here
    console.log("Changing role for:", { fullName, userId, role });
    onClose();
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[rgba(28,31,38,0.9)] backdrop-blur-xl border border-[rgba(255,184,0,0.2)] rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-[#E6E8EB] mb-4">Change Investigator Role</h3>
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
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={setRole} value={role}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select new role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="investigator">Investigator</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
                <SelectItem value="forensic-expert">Forensic Expert</SelectItem>
                <SelectItem value="team-leader">Team Leader</SelectItem>
                <SelectItem value="intelligence-officer">Intelligence Officer</SelectItem>
                <SelectItem value="senior-officer">Senior Officer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleChangeRole}>Change Role</Button>
        </div>
      </div>
    </div>
  );
}
