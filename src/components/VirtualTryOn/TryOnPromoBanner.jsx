import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

/**
 * Try On Before You Buy — Promotional Banner
 * Matches the uploaded banner design from the user.
 */
const TryOnPromoBanner = ({ className = "" }) => {
  return (
    <section className={`w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 ${className}`}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FBF6EE] via-[#F6ECE0] to-[#EFE2D2] border border-[#E8DDD2] shadow-sm p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Visual Composition */}
        <div className="flex items-center gap-6 sm:gap-8 shrink-0">
          {/* Elegant Arch Frame */}
          <div className="relative w-24 sm:w-28 h-32 sm:h-36 rounded-t-full rounded-b-2xl overflow-hidden bg-white/70 border-2 border-[#C9A66B]/60 p-2 shadow-xs flex items-center justify-center">
            <div className="w-full h-full rounded-t-full rounded-b-xl bg-[#FAF2E8] flex items-center justify-center relative overflow-hidden">
              <span className="text-3xl select-none">✨</span>
              <div className="absolute bottom-2 text-[9px] font-semibold uppercase tracking-wider text-[#956638]">
                AI Mirror
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#956638] flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#956638]" /> Try Before You Buy
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#211A16] font-normal tracking-tight italic">
              Try On <br className="hidden sm:inline" /> Before You Buy
            </h2>
          </div>
        </div>

        {/* Divider line (desktop) */}
        <div className="hidden md:block w-px h-16 bg-[#C9A66B]/60" />

        {/* Middle/Right Copy and CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 flex-1 max-w-xl md:justify-end text-center md:text-left">
          <p className="font-serif italic text-sm sm:text-base text-[#5A4D43] leading-relaxed">
            Upload your photo and see how the earrings look on you — powered by AI.
          </p>

          <Link
            to="/shop?category=Earrings"
            className="shrink-0 h-11 px-5 rounded-xl bg-[#211A16] hover:bg-[#342A24] text-white font-body font-semibold text-xs flex items-center gap-2 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Experience Now</span>
            <ArrowRight size={14} className="text-[#C9A66B]" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default TryOnPromoBanner;

