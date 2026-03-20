import { motion } from "motion/react";
import { User, Lock, Bell, Palette, Save, X } from "lucide-react";
import { Input } from "./ui/input"; // Assuming you have a custom Input component
import { GlowButton } from "./GlowButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Toggle } from "./ui/toggle";

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6"
  >
    <div className="flex items-center gap-3 mb-6">
      <Icon className="w-5 h-5 text-[#00FFFF]" />
      <h3 className="text-[#E6E8EB]">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </motion.div>
);

export function Settings() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-[#E6E8EB] mb-2">Personal Settings</h2>
        <p className="text-sm text-[#8B92A0]">Manage your profile, security, and notification preferences.</p>
      </motion.div>

      <Section icon={User} title="Profile Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#8B92A0] mb-1 block">Full Name</label>
            <Input defaultValue="Alex Rivera" />
          </div>
          <div>
            <label className="text-xs text-[#8B92A0] mb-1 block">Email Address</label>
            <Input type="email" defaultValue="a.rivera@forensics.gov" />
          </div>
          <div>
            <label className="text-xs text-[#8B92A0] mb-1 block">Role / Position</label>
            <Input defaultValue="Forensic Investigator" disabled className="bg-gray-800/50" />
          </div>
          <div>
            <label className="text-xs text-[#8B92A0] mb-1 block">Phone Number</label>
            <Input defaultValue="+1 (555) 123-4567" />
          </div>
          <div>
            <label className="text-xs text-[#8B92A0] mb-1 block">Department</label>
            <Select defaultValue="cyber_crime">
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cyber_crime">Cyber Crime Unit</SelectItem>
                <SelectItem value="incident_response">Incident Response</SelectItem>
                {/* Threat Intelligence select item removed */}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section icon={Lock} title="Account Security">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.2)] rounded-lg">
            <p className="text-sm text-[#E6E8EB]">Two-Factor Authentication</p>
            <Toggle aria-label="Toggle 2FA" defaultPressed={true} />
          </div>
           <div className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.2)] rounded-lg">
            <p className="text-sm text-[#E6E8EB]">Change Password</p>
            <GlowButton className="text-sm px-4 py-1">Change</GlowButton>
          </div>
          <div className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.2)] rounded-lg col-span-1 md:col-span-2">
            <p className="text-sm text-[#E6E8EB]">Active Sessions</p>
            <button className="text-sm text-cyan-400 hover:underline">View and Manage</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.2)] rounded-lg col-span-1 md:col-span-2">
            <p className="text-sm text-[#E6E8EB]">YubiKey / BioKey Management</p>
            <button className="text-sm text-cyan-400 hover:underline">Manage Keys</button>
          </div>
        </div>
      </Section>

      <Section icon={Bell} title="Notification Preferences">
        <div className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.2)] rounded-lg">
          <p className="text-sm text-[#E6E8EB]">Email Notifications</p>
          <Toggle aria-label="Toggle Email Notifications" defaultPressed={true} />
        </div>
        <div className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.2)] rounded-lg">
          <p className="text-sm text-[#E6E8EB]">Case Assignment Alerts</p>
          <Toggle aria-label="Toggle Case Assignment Alerts" defaultPressed={true} />
        </div>
        <div className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.2)] rounded-lg">
          <p className="text-sm text-[#E6E8EB]">Push Notifications</p>
          <Toggle aria-label="Toggle Push Notifications" />
        </div>
        <div className="flex items-center justify-between p-3 bg-[rgba(0,0,0,0.2)] rounded-lg">
          <p className="text-sm text-[#E6E8EB]">Analysis Completion Alerts</p>
          <Toggle aria-label="Toggle Analysis Completion Alerts" defaultPressed={true} />
        </div>
      </Section>

      <Section icon={Palette} title="Display Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#8B92A0] mb-1 block">Theme</label>
            <Select defaultValue="dark">
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Cyber Dark</SelectItem>
                <SelectItem value="light" disabled>Light (Coming Soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-[#8B92A0] mb-1 block">Language</label>
            <Select defaultValue="en-us">
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-us">English (US)</SelectItem>
                <SelectItem value="en-gb">English (UK)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-[#8B92A0] mb-1 block">Timezone</label>
            <Select defaultValue="utc-5">
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc-5">UTC-05:00 (Eastern Time)</SelectItem>
                <SelectItem value="utc-6">UTC-06:00 (Central Time)</SelectItem>
                <SelectItem value="utc-7">UTC-07:00 (Mountain Time)</SelectItem>
                <SelectItem value="utc-8">UTC-08:00 (Pacific Time)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end gap-4 pt-4"
      >
        <button className="px-6 py-2 bg-transparent border border-[rgba(255,255,255,0.3)] text-[#E6E8EB] rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-all flex items-center gap-2">
          <X className="w-4 h-4" /> Cancel
        </button>
        <GlowButton className="flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </GlowButton>
      </motion.div>
    </div>
  );
}