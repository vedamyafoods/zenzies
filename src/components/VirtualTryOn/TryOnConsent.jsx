import React, { useState } from "react";
import { Lock, Info, X } from "lucide-react";

/**
 * Privacy & Consent Banner
 * Transparent customer disclosure compliant with privacy guidelines.
 */
const TryOnConsent = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative pt-1">
      <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-[#7B6D63] font-body text-center">
        <Lock size={12} className="text-[#956638] shrink-0" />
        <span>Your photo is only used for the try-on preview and is not stored.</span>
        <button
          type="button"
          onClick={() => setShowInfo(!showInfo)}
          className="text-[#956638] hover:text-[#7D532B] underline ml-0.5 cursor-pointer inline-flex items-center"
          aria-label="Read AI photo privacy policy"
        >
          <Info size={11} />
        </button>
      </div>

      {showInfo && (
        <div className="mt-2.5 p-3.5 rounded-xl bg-white border border-[#E8DDD2] shadow-sm text-left space-y-1.5 text-xs text-[#52463E] animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#211A16] flex items-center gap-1.5">
              <Lock size={13} className="text-[#956638]" /> Privacy & Security Commitment
            </span>
            <button
              type="button"
              onClick={() => setShowInfo(false)}
              className="text-[#9E9082] hover:text-[#211A16] cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
          <p className="leading-relaxed text-[11px]">
            Your photograph is transmitted via encrypted HTTPS strictly to process the virtual jewellery placement. Files are held in temporary memory for your immediate session and are purged automatically. Your personal images are never sold or used for AI model training.
          </p>
        </div>
      )}
    </div>
  );
};

export default TryOnConsent;

