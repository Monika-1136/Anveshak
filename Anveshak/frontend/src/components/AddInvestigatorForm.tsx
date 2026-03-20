import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export function AddInvestigatorForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[rgba(28,31,38,0.9)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-[#E6E8EB] mb-4">Add New Investigator</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="Enter full name" />
          </div>
          <div>
            <Label htmlFor="userId">User ID</Label>
            <Input id="userId" placeholder="Enter user ID" />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter email address" />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="Enter phone number" />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Select>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent style={{ zIndex: 100 }}>
                <SelectItem value="cybercrime">Cybercrime</SelectItem>
                <SelectItem value="forensic">Forensic</SelectItem>
                <SelectItem value="intelligence">Intelligence</SelectItem>
                <SelectItem value="field-operations">Field Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button>Add Investigator</Button>
        </div>
      </div>
    </div>
  );
}
