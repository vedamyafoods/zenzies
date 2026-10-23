import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useSectionDesign from '../../hooks/useSectionDesign';

const DEFAULT_STORY_IMG = "/img/zenzies/jeweler_craftsmanship.jpg";

const BrandStory = () => {
  const { design, containerStyle, overlayStyle, isEnabled } = useSectionDesign('brand_story', {
    backgroundColor: '#FAF7F2',
    paddingTop: '10px',
    paddingBottom: '10px',
  });

  if (!isEnabled) return null;

  const eyebrow = design.eyebrow || 'OUR STORY';
  const title = design.title || 'A Legacy of Grace\nand Craftsmanship';
  const description =
    design.description ||
    design.subtitle ||
    "At Zenzies, we believe jewellery is more than an accessory — it's a symbol of love, confidence and life's most beautiful moments. Each piece is thoughtfully designed and ethically crafted to be cherished forever.";
  const btnText = design.btnText || 'Our Story';
  const btnLink = design.btnLink || '/about';
  const storyImage = design.image || DEFAULT_STORY_IMG;

  // Watermark Seal Tokens
  const sealEnabled = design.sealEnabled !== false;
  const sealTopText = design.sealTopText || 'FINE JEWELLERS';
  const sealBrand = design.sealBrand || 'ZENZIES';
  const sealYear = design.sealYear || 'EST. 2024';
  const sealColor = design.sealColor || '#C5A880';
  const scriptLine1 = design.scriptLine1 || 'Handcrafted';
  const scriptLine2 = design.scriptLine2 || 'With Love ♡';
  const scriptColor = design.scriptColor || '#C5A880';

  const accentColor = design.accentColor || '#8C6239';
  const titleColor = design.titleColor || '#211A16';
  const textColor = design.textColor || design.subtitleColor || '#5A5046';
  const btnBgColor = design.btnBgColor || '#8C6239';

  return (
    <section
      style={{
        ...containerStyle,
        backgroundColor: design.backgroundColor || '#FAF7F2',
        paddingTop: design.paddingTop || '56px',
        paddingBottom: design.paddingBottom || '72px',
      }}
      className="relative w-full border-b border-[#E8DDD2]/60 overflow-hidden"
    >
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}

      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* ─── Left Column: Brand Story Content ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-5 text-left"
          >
            {/* Eyebrow */}
            <span
              className="text-[11px] font-sans font-semibold tracking-[0.22em] uppercase block"
              style={{ color: accentColor }}
            >
              {eyebrow}
            </span>

            {/* Main Headline */}
            <h2
              className="font-serif text-3xl sm:text-4xl lg:text-[42px] xl:text-[44px] font-normal leading-[1.15] tracking-tight whitespace-pre-line"
              style={{ color: titleColor }}
            >
              {title}
            </h2>

            {/* Description Body */}
            <p
              className="text-xs sm:text-[13.5px] font-sans leading-[1.75] max-w-lg"
              style={{ color: textColor }}
            >
              {description}
            </p>

            {/* CTA Button */}
            {design.btnEnabled !== false && (
              <div className="pt-2">
                <Link
                  to={btnLink}
                  style={{ backgroundColor: btnBgColor }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-[4px] text-white text-xs sm:text-sm font-sans font-semibold tracking-wide hover:brightness-105 hover:shadow-md transition-all shadow-xs"
                >
                  <span>{btnText}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </motion.div>

          {/* ─── Right Column: Arched Craft Image + Zenzies Watermark Seal ─── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-6 relative flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-6 sm:gap-8 lg:gap-9 pt-4 lg:pt-0"
          >
            {/* Arched Photo Frame (Exact matching arch curve) */}
            <div className="relative w-[260px] sm:w-[290px] md:w-[450px] aspect-[4/3.8] rounded-t-full rounded-b-none overflow-hidden border border-[#E8DDD2]/80 shadow-xs bg-[#FAF6F0] shrink-0">
              <img
                src={storyImage}
                alt="Zenzies Jewellery Craftsmanship"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Watermark Seal Stamp & Script Accent (Sitting to the right of image) */}
            {sealEnabled && (
              <div className="flex flex-col items-center justify-center gap-3 shrink-0 select-none">
                {/* Circular Fine Jewellers Stamp */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
                  <svg
                    viewBox="0 0 160 160"
                    className="w-full h-full"
                    style={{ color: sealColor }}
                  >
                    {/* Outer Ring */}
                    <circle
                      cx="80"
                      cy="80"
                      r="76"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      opacity="0.85"
                    />

                    {/* Inner Dotted Ring */}
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      strokeDasharray="2 3"
                      opacity="0.6"
                    />

                    {/* Innermost Core Ring */}
                    <circle
                      cx="80"
                      cy="80"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      opacity="0.45"
                    />

                    {/* Top Curved Path for Seal Top Text */}
                    <path
                      id="seal-curve-top"
                      d="M 24 80 A 56 56 0 0 1 136 80"
                      fill="none"
                    />
                    <text
                      className="text-[9px] uppercase tracking-[0.28em] font-sans font-medium"
                      fill="currentColor"
                      textAnchor="middle"
                    >
                      <textPath href="#seal-curve-top" startOffset="50%">
                        {sealTopText}
                      </textPath>
                    </text>

                    {/* Middle Brand Name */}
                    <text
                      x="80"
                      y="85"
                      textAnchor="middle"
                      className="text-[13px] font-sans font-semibold tracking-[0.32em] uppercase"
                      fill="currentColor"
                    >
                      {sealBrand}
                    </text>

                    {/* Decorative Star Dots */}
                    <text
                      x="46"
                      y="84"
                      textAnchor="middle"
                      className="text-[8px]"
                      fill="currentColor"
                      opacity="0.7"
                    >
                      ✦
                    </text>
                    <text
                      x="114"
                      y="84"
                      textAnchor="middle"
                      className="text-[8px]"
                      fill="currentColor"
                      opacity="0.7"
                    >
                      ✦
                    </text>

                    {/* Bottom Curved Path for Seal Year / Text */}
                    <path
                      id="seal-curve-bottom"
                      d="M 26 80 A 54 54 0 0 0 134 80"
                      fill="none"
                    />
                    <text
                      className="text-[8.5px] uppercase tracking-[0.28em] font-sans font-normal"
                      fill="currentColor"
                      textAnchor="middle"
                    >
                      <textPath href="#seal-curve-bottom" startOffset="50%">
                        • {sealYear} •
                      </textPath>
                    </text>
                  </svg>
                </div>

                {/* Handwritten Script Beneath Seal */}
                <div
                  className="text-center font-script leading-tight"
                  style={{ color: scriptColor }}
                >
                  <p className="text-2xl sm:text-[28px] tracking-wide">
                    {scriptLine1}
                  </p>
                  <p className="text-xl sm:text-[24px] -mt-1 tracking-wide">
                    {scriptLine2}
                  </p>
                </div>
              </div>
            )}

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BrandStory;
