import React from "react";
import { Eye, Check, Sparkles } from "lucide-react";

/**
 * 4-Angle Selector Component:
 * - 01. Front View
 * - 02. Left Angle
 * - 03. Right Angle
 * - 04. Close-up
 */
const AngleSelector = ({ activeAngle = "front", angles = {}, onSelectAngle }) => {
  const angleDefinitions = [
    { id: "front", label: "01. Front View", short: "Front" },
    { id: "left", label: "02. Left Angle", short: "Left 3/4" },
    { id: "right", label: "03. Right Angle", short: "Right 3/4" },
    { id: "closeup", label: "04. Close-up", short: "Macro" }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-[#7B6D63] font-body">
        <span className="font-semibold text-[#211A16] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Eye size={13} className="text-[#956638]" /> Multi-Angle Atelier Views
        </span>
        <span className="text-[11px] text-[#9E9082]">4 AI Perspectives</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {angleDefinitions.map((ang) => {
          const isSelected = activeAngle === ang.id;
          const status = angles[ang.id]?.status || "completed";

          return (
            <button
              key={ang.id}
              type="button"
              onClick={() => onSelectAngle(ang.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between min-h-[58px] ${
                isSelected
                  ? "border-[#956638] bg-[#FDF8F0] ring-2 ring-[#956638]/20 shadow-xs"
                  : "border-[#E8DDD2] bg-white hover:border-[#B8926A] hover:bg-[#FAF7F2]"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-semibold text-[#211A16] font-body truncate">
                  {ang.label}
                </span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-[#956638] text-white flex items-center justify-center shrink-0">
                    <Check size={10} strokeWidth={2.5} />
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#9E9082] font-body mt-1">
                {status === "completed" ? "High Resolution" : "Generating..."}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AngleSelector;

