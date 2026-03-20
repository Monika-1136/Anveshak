import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export function RemoveInvestigatorForm({ onClose }: { onClose: () => void }) {
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState("");

  const handleRemove = () => {
    if (!fullName || !userId) {
      alert("Please fill in all fields.");
      return;
    }
    // Handle removal logic here
    console.log("Removing investigator:", { fullName, userId });
    onClose();
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[rgba(28,31,38,0.9)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-[#E6E8EB] mb-4">Remove Investigator</h3>
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
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={handleRemove}>Remove Investigator</Button>
        </div>
      </div>
    </div>
  );
}
