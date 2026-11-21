import React, { useState } from "react";
import { ArrowLeft, Maximize2, Sparkles, Info } from "lucide-react";
import BeforeAfterComparison from "./BeforeAfterComparison";
import AngleSelector from "./AngleSelector";
import PreviewActions from "./PreviewActions";

/**
 * Screen 3: AI Preview Results & Multi-Angle Showcase
 */
const PreviewGallery = ({
  product,
  customerPhoto,
  angles = {},
  onBack,
  onTryAnotherPhoto
}) => {
  const [activeAngle, setActiveAngle] = useState("front");
  const [comparisonMode, setComparisonMode] = useState("after");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active image calculation
  const currentAngleData = angles[activeAngle] || angles.front || {};
  const aiGeneratedUrl = currentAngleData.imageUrl || angles.front?.imageUrl;
  const activeImageUrl =
    comparisonMode === "before"
      ? customerPhoto?.dataUrl
      : aiGeneratedUrl || customerPhoto?.dataUrl;

  return (
    <div className="space-y-4">
      {/* Top Header: Back button + Your Preview + Before/After Toggle */}
      <div className="flex items-center justify-between pb-1 border-b border-[#E8DDD2]/60">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-full hover:bg-[#FAF7F2] text-[#211A16] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Back to photo upload"
        >
          <ArrowLeft size={18} />
        </button>

        <h3 className="font-serif text-lg sm:text-xl text-[#211A16] font-normal">
          Your Preview
        </h3>

        <BeforeAfterComparison
          mode={comparisonMode}
          onChange={(newMode) => setComparisonMode(newMode)}
        />
      </div>

      {/* Main Image Showcase Canvas */}
      <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF6F0] border border-[#E8DDD2] shadow-sm group">
        <img
          src={activeImageUrl}
          alt={`AI Try-on ${product?.name} preview`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {/* Maximize Lightbox button */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-[#211A16] flex items-center justify-center shadow-xs backdrop-blur-xs transition-all cursor-pointer border border-[#E8DDD2]"
          title="Fullscreen preview"
        >
          <Maximize2 size={15} />
        </button>

        {/* Status Pill */}
        <div className="absolute top-3 left-3 bg-[#211A16]/85 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 shadow-xs">
          <Sparkles size={11} className="text-[#C9A66B]" />
          <span>
            {comparisonMode === "before"
              ? "Original Photo"
              : `${activeAngle.toUpperCase()} VIEW • AI Placed`}
          </span>
        </div>
      </div>

      {/* Multi-Angle Perspectives */}
      <AngleSelector
        activeAngle={activeAngle}
        angles={angles}
        onSelectAngle={(ang) => {
          setActiveAngle(ang);
          setComparisonMode("after");
        }}
      />

      {/* 2 Primary Actions: Add to Cart + Try Another Photo */}
      <PreviewActions
        product={product}
        onTryAnotherPhoto={onTryAnotherPhoto}
      />

      {/* Mandatory Disclaimer */}
      <div className="flex items-center justify-center gap-1 text-[11px] text-[#9E9082] text-center pt-1 font-body">
        <Info size={12} className="shrink-0" />
        <span>AI preview is illustrative; fit, lustre and scale may vary.</span>
      </div>

      {/* Fullscreen Overlay Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsFullscreen(false)}
        >
          <img
            src={activeImageUrl}
            alt="Fullscreen AI view"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default PreviewGallery;

