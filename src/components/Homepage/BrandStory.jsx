import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useSectionDesign from '../../hooks/useSectionDesign';

const CRAFT_IMG = "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&q=80&w=900";

const BrandStory = () => {
  const { design, containerStyle, overlayStyle, isEnabled } = useSectionDesign('brand_story', {
    backgroundColor: '#FFFFFF',
    paddingTop: '48px',
    paddingBottom: '80px',
  });

  if (!isEnabled) return null;

  const eyebrow = design.eyebrow || 'OUR STORY';
  const title = design.title || 'A Legacy of Grace\nand Thoughtful Storage';
  const description = design.description || design.subtitle || "At Zenzies, we believe jewellery is more than an accessory — it's a symbol of love, confidence, and life's most cherished memories. Every piece of jewellery and organizer box is thoughtfully designed to ensure your treasured treasures remain beautifully organized, tangle-free, and protected for years to come.";
  const btnText = design.btnText || 'Read Our Story';
  const btnLink = design.btnLink || '/about';
  const storyImage = design.image || CRAFT_IMG;
  const scriptLine1 = design.scriptLine1 || 'Handcrafted';
  const scriptLine2 = design.scriptLine2 || 'With Love ♡';
  const badgeTitle = design.badgeTitle || 'ZENZIES';
  const badgeYear = design.badgeYear || 'EST. 2024';
  const badgeSubtitle = design.badgeSubtitle || 'Authentic Care';

  return (
    <section style={containerStyle} className="relative w-full border-b border-[#E8DDD2] overflow-hidden">
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column: Story Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <span
              className="text-[11px] font-sans font-semibold tracking-[0.22em] uppercase block"
              style={{ color: design.accentColor || '#956638' }}
            >
              {eyebrow}
            </span>

            <h2
              className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.14] tracking-tight whitespace-pre-line"
              style={{ color: design.titleColor || '#211A16' }}
            >
              {title}
            </h2>

            <p
              className="text-xs sm:text-sm font-sans leading-[1.75] max-w-lg"
              style={{ color: design.textColor || design.subtitleColor || '#6B5E52' }}
            >
              {description}
            </p>

            {design.btnEnabled !== false && (
              <div>
                <Link
                  to={btnLink}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[6px] text-white text-xs sm:text-sm font-sans font-semibold tracking-wide transition-all shadow-sm"
                  style={{ backgroundColor: design.btnBgColor || '#956638' }}
                >
                  <span>{btnText}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </motion.div>

          {/* Right Column: Arched Image with Round Stamp & Script Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-6 relative flex items-center justify-center pt-6 lg:pt-0"
          >
            {/* Arched Photo Frame */}
            <div className="relative w-full max-w-md aspect-[4/4.2] rounded-t-[140px] rounded-b-2xl overflow-hidden border border-[#E8DDD2] shadow-md bg-[#FAF6F0]">
              <img
                src={storyImage}
                alt="Zenzies Jewellery Craftsmanship"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211A16]/30 via-transparent to-transparent pointer-events-none" />

              {/* Delicate Script Accent safely nested inside image at bottom right */}
              <div className="absolute bottom-5 right-5 pointer-events-none drop-shadow-md text-right z-10">
                <p className="text-2xl sm:text-3xl text-white font-script leading-tight" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
                  {scriptLine1}
                </p>
                <p className="text-xl sm:text-2xl text-white/95 font-script -mt-1" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.7)' }}>
                  {scriptLine2}
                </p>
              </div>
            </div>

            {/* Circular Stamp Badge */}
            <div className="absolute -top-3 right-4 sm:right-8 w-22 h-22 sm:w-26 sm:h-26 rounded-full border border-[#956638]/40 bg-white/95 backdrop-blur-xs shadow-md p-2 flex flex-col items-center justify-center text-center z-20">
              <span className="text-[9px] font-sans font-bold tracking-[0.2em] text-[#956638] uppercase">
                {badgeTitle}
              </span>
              <span className="text-[8px] font-mono text-[#6B5E52] my-0.5">
                {badgeYear}
              </span>
              <span className="text-[8px] font-serif italic text-[#956638]">
                {badgeSubtitle}
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default BrandStory;
