import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { StatusChip } from "./StatusChip";
import { User, MessageCircle, Paperclip, Calendar } from "lucide-react";

export interface Case {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  investigator: string;
  attachments: number;
  comments: number;
  date: string;
}

export interface Column {
  id: string;
  title: string;
  cases: Case[];
  color: string;
}

interface CaseManagementProps {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
}

export function CaseManagement({ columns, setColumns }: CaseManagementProps) {
  const [draggedCase, setDraggedCase] = useState<{ columnId: string; caseId: string } | null>(null);
  const navigate = useNavigate();

  const handleDragStart = (columnId: string, caseId: string) => {
    setDraggedCase({ columnId, caseId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId: string) => {
    if (!draggedCase) return;

    const sourceColumn = columns.find(col => col.id === draggedCase.columnId);
    const targetColumn = columns.find(col => col.id === targetColumnId);
    
    if (!sourceColumn || !targetColumn || sourceColumn.id === targetColumn.id) return;

    const caseToMove = sourceColumn.cases.find(c => c.id === draggedCase.caseId);
    if (!caseToMove) return;

    const newColumns = columns.map(col => {
      if (col.id === draggedCase.columnId) {
        return { ...col, cases: col.cases.filter(c => c.id !== draggedCase.caseId) };
      }
      if (col.id === targetColumnId) {
        return { ...col, cases: [...col.cases, caseToMove] };
      }
      return col;
    });

    setColumns(newColumns);
    setDraggedCase(null);
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h2 className="text-[#E6E8EB] mb-2">Case Management</h2>
          <p className="text-sm text-[#8B92A0]">Organize and track investigations</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {columns.map((column, columnIndex) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: columnIndex * 0.1 }}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
            className="bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(0,255,255,0.2)] rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(0,255,255,0.2)]">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <h3 className="text-[#E6E8EB]">{column.title}</h3>
              </div>
              <span className="text-xs text-[#8B92A0] bg-[rgba(0,255,255,0.1)] px-2 py-1 rounded-full">
                {column.cases.length}
              </span>
            </div>

            <div className="space-y-3">
              {column.cases.map((caseItem, index) => (
                <motion.div
                  key={caseItem.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  draggable
                  onDragStart={() => handleDragStart(column.id, caseItem.id)}
                  onClick={() => navigate(`/cases/${caseItem.id}`, { state: { caseItem: { ...caseItem, status: column.id } } })}
                  className="bg-[rgba(0,0,0,0.3)] border border-[rgba(0,255,255,0.1)] rounded-xl p-4 cursor-pointer hover:border-[rgba(0,255,255,0.4)] hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-[#00FFFF] mb-1">{caseItem.id}</p>
                      <h4 className="text-sm text-[#E6E8EB]">{caseItem.title}</h4>
                    </div>
                    <StatusChip status={caseItem.severity} label="" />
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 text-xs text-[#8B92A0]">
                      <Paperclip className="w-3 h-3" />
                      {caseItem.attachments}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#8B92A0]">
                      <MessageCircle className="w-3 h-3" />
                      {caseItem.comments}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#8B92A0]">
                      <Calendar className="w-3 h-3" />
                      {caseItem.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00FFB3] to-[#00FFFF] flex items-center justify-center">
                      <User className="w-3 h-3 text-[#0D1117]" />
                    </div>
                    <p className="text-xs text-[#8B92A0]">{caseItem.investigator}</p>
                  </div>
                </motion.div>
              ))}

              {column.cases.length === 0 && (
                <div className="text-center py-8 text-sm text-[#8B92A0] opacity-50">
                  No cases
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Collaboration Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 bg-[rgba(28,31,38,0.6)] backdrop-blur-xl border border-[rgba(122,92,255,0.2)] rounded-2xl p-6"
      >
        <h3 className="text-[#E6E8EB] mb-4">Team Collaboration Feed</h3>
        <div className="space-y-3">
          {[
            { user: "Alex Rivera", action: "assigned", case: "FR-1045", time: "2 hours ago" },
            { user: "Jordan Lee", action: "commented on", case: "FR-1044", time: "3 hours ago" },
            { user: "Sam Chen", action: "uploaded evidence to", case: "FR-1042", time: "5 hours ago" },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-[rgba(122,92,255,0.05)] border border-[rgba(122,92,255,0.1)] rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7A5CFF] to-[#00FFFF] flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#E6E8EB]">
                  <span className="text-[#7A5CFF]">{activity.user}</span> {activity.action} <span className="text-[#00FFFF]">{activity.case}</span>
                </p>
                <p className="text-xs text-[#8B92A0]">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
