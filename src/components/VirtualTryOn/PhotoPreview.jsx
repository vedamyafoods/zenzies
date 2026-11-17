import React from "react";
import { Camera, Trash2, CheckCircle2 } from "lucide-react";

/**
 * Uploaded Photo Preview Card
 * Displays chosen customer photograph with replace/remove controls.
 */
const PhotoPreview = ({ photo, onReplace, onRemove }) => {
  if (!photo) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#956638] text-white text-[11px] font-semibold flex items-center justify-center">
            2
          </span>
          <h3 className="font-body text-sm font-semibold text-[#211A16]">
            Your Photo Preview
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReplace}
            className="text-xs text-[#956638] hover:text-[#7D532B] font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Camera size={13} /> Replace
          </button>
          <span className="text-[#D8CBBE]">|</span>
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 size={13} /> Remove
          </button>
        </div>
      </div>

      <div className="relative aspect-4/3 sm:aspect-video w-full rounded-2xl overflow-hidden bg-[#FAF6F0] border border-[#E8DDD2] shadow-2xs group">
        <img
          src={photo.dataUrl}
          alt="Customer portrait"
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-[#E8DDD2] px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[11px] font-medium text-[#211A16] shadow-xs">
          <CheckCircle2 size={13} className="text-emerald-600" />
          <span>Photo Ready for AI Placement</span>
        </div>
      </div>
    </div>
  );
};

export default PhotoPreview;

