import { useState } from "react";
import { motion } from "motion/react";
import { UserPlus, UserMinus, UserCog, Briefcase } from "lucide-react";
import { AddInvestigatorForm } from "./AddInvestigatorForm";
import { RemoveInvestigatorForm } from "./RemoveInvestigatorForm";
import { ChangeRoleForm } from "./ChangeRoleForm";
import { AssignWorkForm } from "./AssignWorkForm";

export function UserManagement() {
  const [showAddInvestigatorForm, setShowAddInvestigatorForm] = useState(false);
  const [showRemoveInvestigatorForm, setShowRemoveInvestigatorForm] = useState(false);
  const [showChangeRoleForm, setShowChangeRoleForm] = useState(false);
  const [showAssignWorkForm, setShowAssignWorkForm] = useState(false);

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-[#E6E8EB] mb-2">User Management</h2>
        <p className="text-sm text-[#8B92A0]">Add, remove, and manage investigator roles and assignments.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Add Investigator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[rgba(0,255,255,0.4)] hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all cursor-pointer"
          onClick={() => setShowAddInvestigatorForm(true)}
        >
          <UserPlus className="w-10 h-10 text-[#00FFFF] mb-4" />
          <h3 className="text-[#E6E8EB] mb-2">Add Investigator</h3>
          <p className="text-xs text-[#8B92A0]">Onboard a new team member.</p>
        </motion.div>

        {/* Remove Investigator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[rgba(0,255,255,0.4)] hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all cursor-pointer"
          onClick={() => setShowRemoveInvestigatorForm(true)}
        >
          <UserMinus className="w-10 h-10 text-[#00FFFF] mb-4" />
          <h3 className="text-[#E6E8EB] mb-2">Remove Investigator</h3>
          <p className="text-xs text-[#8B92A0]">Remove a team member from the system.</p>
        </motion.div>

        {/* Change Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[rgba(0,255,255,0.4)] hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all cursor-pointer"
          onClick={() => setShowChangeRoleForm(true)}
        >
          <UserCog className="w-10 h-10 text-[#00FFFF] mb-4" />
          <h3 className="text-[#E6E8EB] mb-2">Change Role</h3>
          <p className="text-xs text-[#8B92A0]">Modify permissions and access levels.</p>
        </motion.div>

        {/* Assign Work */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[rgba(0,255,255,0.4)] hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all cursor-pointer"
          onClick={() => setShowAssignWorkForm(true)}
        >
          <Briefcase className="w-10 h-10 text-[#00FFFF] mb-4" />
          <h3 className="text-[#E6E8EB] mb-2">Assign Work</h3>
          <p className="text-xs text-[#8B92A0]">Delegate tasks and cases to investigators.</p>
        </motion.div>
      </div>

      {showAddInvestigatorForm && <AddInvestigatorForm onClose={() => setShowAddInvestigatorForm(false)} />}
      {showRemoveInvestigatorForm && <RemoveInvestigatorForm onClose={() => setShowRemoveInvestigatorForm(false)} />}
      {showChangeRoleForm && <ChangeRoleForm onClose={() => setShowChangeRoleForm(false)} />}
      {showAssignWorkForm && <AssignWorkForm onClose={() => setShowAssignWorkForm(false)} />}
    </div>
  );
}
