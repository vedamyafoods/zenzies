import React from "react";
import { Sparkles } from "lucide-react";
import { isTryOnSupported } from "../../services/virtualTryOnService";

/**
 * Premium "Try It On with AI" CTA Button
 * Visible near Add to Cart on product detail pages.
 * Displays only for eligible jewellery categories.
 */
const VirtualTryOnButton = ({
  product,
  onClick,
  className = "",
  variant = "hero"
}) => {
  if (!product) return null;

  // Verify category eligibility (earrings, necklaces, rings, bracelets)
  const isEligible = isTryOnSupported(product.category);
  if (!isEligible) {
    return null;
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`h-9 px-3 rounded-xl bg-[#FDF8F0] border border-[#C9A66B] hover:bg-[#F6EFE3] text-[#211A16] font-body font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${className}`}
        aria-label="Try this jewellery on with AI"
      >
        <Sparkles size={13} className="text-[#956638]" />
        <span>Try On</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[52px] px-5 rounded-2xl bg-[#FDF8F0] border-2 border-[#C9A66B] hover:bg-[#F7EFE2] text-[#211A16] font-body font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs hover:border-[#956638] hover:shadow-sm active:scale-[0.98] ${className}`}
      aria-label="Try It On with AI"
    >
      <Sparkles size={16} className="text-[#956638] animate-pulse" />
      <span className="tracking-wide">Try It On with AI</span>
    </button>
  );
};

export default VirtualTryOnButton;

