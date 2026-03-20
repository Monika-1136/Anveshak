interface StatusChipProps {
  status: "critical" | "high" | "medium" | "low" | "new" | "in-progress" | "review" | "closed";
  label?: string;
}

export function StatusChip({ status, label }: StatusChipProps) {
  const variants = {
    critical: "bg-[#FF3864] text-white shadow-[0_0_10px_rgba(255,56,100,0.5)]",
    high: "bg-[#FF6B35] text-white shadow-[0_0_10px_rgba(255,107,53,0.5)]",
    medium: "bg-[#FFB800] text-[#0D1117] shadow-[0_0_10px_rgba(255,184,0,0.5)]",
    low: "bg-[#00FFB3] text-[#0D1117] shadow-[0_0_10px_rgba(0,255,179,0.5)]",
    new: "bg-[#7A5CFF] text-white shadow-[0_0_10px_rgba(122,92,255,0.5)]",
    "in-progress": "bg-[#00FFFF] text-[#0D1117] shadow-[0_0_10px_rgba(0,255,255,0.5)]",
    review: "bg-[#FFB800] text-[#0D1117] shadow-[0_0_10px_rgba(255,184,0,0.5)]",
    closed: "bg-[#2A2D35] text-[#8B92A0] border border-[rgba(0,255,255,0.2)]"
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs ${variants[status]}`}>
      {label || status.toUpperCase()}
    </span>
  );
}
