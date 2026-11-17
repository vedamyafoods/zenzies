import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Honest Stage-Based Progress Indicator for AI Synthesis
 */
const GenerationProgress = ({
  stage = "Preparing jewellery reference...",
  progressPercent = 45,
  product,
  customerPhoto
}) => {
  return (
    <div className="py-8 sm:py-12 px-4 text-center space-y-6 max-w-md mx-auto">
      {/* Side-by-side synthesis preview */}
      <div className="flex items-center justify-center gap-3">
        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#E8DDD2] bg-white shadow-xs p-0.5 relative">
          <img
            src={product?.primaryImage || product?.image || product?.images?.[0]}
            alt="Jewellery piece"
            className="w-full h-full object-cover rounded-xl"
          />
          <span className="absolute bottom-0 inset-x-0 bg-[#211A16]/80 text-white text-[8px] font-semibold py-0.5">
            Piece
          </span>
        </div>

        <div className="w-8 h-8 rounded-full bg-[#FAF2E8] border border-[#C9A66B] flex items-center justify-center text-[#956638] shadow-xs">
          <Sparkles size={16} className="animate-spin text-[#956638]" />
        </div>

        <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#E8DDD2] bg-white shadow-xs p-0.5 relative">
          <img
            src={customerPhoto?.dataUrl}
            alt="Customer portrait"
            className="w-full h-full object-cover rounded-xl"
          />
          <span className="absolute bottom-0 inset-x-0 bg-[#211A16]/80 text-white text-[8px] font-semibold py-0.5">
            You
          </span>
        </div>
      </div>

      {/* Main Status Text */}
      <div className="space-y-1.5">
        <h3 className="font-serif text-xl sm:text-2xl text-[#211A16] font-normal tracking-tight">
          Crafting Your Virtual Look
        </h3>
        <p className="font-body text-xs sm:text-sm text-[#7B6D63] flex items-center justify-center gap-2">
          <Loader2 size={14} className="animate-spin text-[#956638]" />
          <span>{stage}</span>
        </p>
      </div>

      {/* Luxury Progress Bar */}
      <div className="space-y-2">
        <div className="w-full h-2 rounded-full bg-[#E8DDD2] overflow-hidden p-0.5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#C9A66B] to-[#956638]"
            initial={{ width: "15%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: "easeInOut", duration: 0.8 }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-[#9E9082] font-body">
          <span>AI Precision Placement</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
      </div>

      <p className="text-[11px] text-[#9E9082] leading-relaxed max-w-xs mx-auto">
        Preserving natural skin tones, ear contours and the exact sparkle of the handcrafted stones.
      </p>
    </div>
  );
};

export default GenerationProgress;

