import React from "react";

/**
 * Before / After Pill Toggle Switch
 * Allows seamless switching between original customer portrait and AI result.
 */
const BeforeAfterComparison = ({ mode = "after", onChange }) => {
  return (
    <div className="inline-flex items-center p-1 rounded-full bg-[#EFE8DD] border border-[#D8CBBE] shadow-2xs">
      <button
        type="button"
        onClick={() => onChange("before")}
        className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold transition-all cursor-pointer ${
          mode === "before"
            ? "bg-[#211A16] text-white shadow-xs"
            : "text-[#6B5E52] hover:text-[#211A16]"
        }`}
      >
        Before
      </button>

      <button
        type="button"
        onClick={() => onChange("after")}
        className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold transition-all cursor-pointer ${
          mode === "after"
            ? "bg-[#211A16] text-white shadow-xs"
            : "text-[#6B5E52] hover:text-[#211A16]"
        }`}
      >
        After
      </button>
    </div>
  );
};

export default BeforeAfterComparison;

