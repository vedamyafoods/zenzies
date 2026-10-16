import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import useSectionDesign from '../../hooks/useSectionDesign';

const DEFAULT_BANNER_BG = '/img/zenzies/jewellery_box_promo_clean_bg.jpg';

const DEFAULT_FEATURES = [
  { id: 'f1', text: 'Multiple Compartments', enabled: true },
  { id: 'f2', text: 'Travel Friendly', enabled: true },
  { id: 'f3', text: 'Stylish & Luxurious Design', enabled: true },
  { id: 'f4', text: 'Perfect for Gifting', enabled: true },
];

const FeaturedBoxBanner = () => {
  const { design, containerStyle, overlayStyle, isEnabled } = useSectionDesign('jewellery_box_banner', {
    backgroundColor: '#FBF7F2',
    backgroundImage: DEFAULT_BANNER_BG,
    backgroundSize: 'cover',
    backgroundPosition: 'center right',
    backgroundRepeat: 'no-repeat',
    paddingTop: '0px',
    paddingBottom: '0px',
    eyebrow: 'PREMIUM JEWELRY BOXES',
    titleLine1: 'Little Box',
    titleLine2: 'Big Elegance',
    subtitle: 'Keep your earrings, rings, and chains beautifully organized with our premium jewelry boxes.',
    btnText: 'Shop Jewelry Boxes',
    btnLink: '/shop?category=Jewellery+Boxes',
    btnEnabled: true,
    features: DEFAULT_FEATURES,
  });

  if (!isEnabled) return null;

  const eyebrow = design.eyebrow || 'PREMIUM JEWELRY BOXES';
  const titleLine1 = design.titleLine1 || 'Little Box';
  const titleLine2 = design.titleLine2 || 'Big Elegance';
  const subtitle = design.subtitle || design.description || 'Keep your earrings, rings, and chains beautifully organized with our premium jewelry boxes.';
  const btnText = design.btnText || 'Shop Jewelry Boxes';
  const btnLink = design.btnLink || '/shop?category=Jewellery+Boxes';
  const btnEnabled = design.btnEnabled !== false;
  const features = Array.isArray(design.features) ? design.features.filter(f => f && f.enabled !== false) : DEFAULT_FEATURES;

  // Background image resolution
  const bgImg = design.backgroundImage || DEFAULT_BANNER_BG;

  return (
    <section
      className="relative w-full overflow-hidden flex items-center min-h-[360px] sm:min-h-[390px] lg:min-h-[430px] xl:min-h-[450px]"
      style={{
        backgroundColor: design.backgroundColor || '#FBF7F2',
        backgroundImage: `url(${bgImg})`,
        backgroundSize: design.backgroundSize || 'cover',
        backgroundPosition: design.backgroundPosition || 'center right',
        backgroundRepeat: design.backgroundRepeat || 'no-repeat',
        backgroundAttachment: design.backgroundAttachment || 'scroll',
        backgroundBlendMode: design.backgroundBlendMode || 'normal',
        paddingTop: design.paddingTop || '0px',
        paddingBottom: design.paddingBottom || '0px',
      }}
    >
      {/* Optional Admin-managed Overlay */}
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}

      {/* Subtle responsive gradient protection to guarantee text legibility across all viewport widths */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FBF7F2]/95 via-[#FBF7F2]/75 to-transparent md:via-[#FBF7F2]/45 lg:via-[#FBF7F2]/20 pointer-events-none z-[1]" />

      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10 py-12 sm:py-14 lg:py-16">
        <div className="max-w-[440px] sm:max-w-[480px] lg:max-w-[520px] text-left">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 sm:mb-4"
          >
            <span
              className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.22em] uppercase inline-block"
              style={{ color: design.accentColor || '#956638' }}
            >
              {eyebrow}
            </span>
          </motion.div>

          {/* Main Two-Line Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-serif text-[34px] sm:text-[42px] lg:text-[48px] xl:text-[52px] font-normal leading-[1.02] tracking-[-0.02em] m-0"
          >
            <span
              className="block"
              style={{ color: design.titleColor || '#211A16' }}
            >
              {titleLine1}
            </span>
            <span
              className="block mt-0.5"
              style={{ color: design.titleLine2Color || design.accentColor || '#956638' }}
            >
              {titleLine2}
            </span>
          </motion.h2>

          {/* Short Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-xs sm:text-[13.5px] lg:text-[14px] font-sans leading-[1.55] max-w-[360px] sm:max-w-[420px] mt-3.5 sm:mt-4 mb-4 sm:mb-5"
            style={{ color: design.subtitleColor || design.textColor || '#62564B' }}
          >
            {subtitle}
          </motion.p>

          {/* 4 Feature Points with Check Icons in 2-Column Grid */}
          {features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="grid grid-cols-2 gap-x-5 sm:gap-x-7 gap-y-2.5 sm:gap-y-3.5 mb-5 sm:mb-6"
            >
              {features.map((feature, idx) => (
                <div key={feature.id || idx} className="flex items-center gap-2 text-left">
                  <span
                    className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 shadow-xs"
                    style={{
                      backgroundColor: `${design.accentColor || '#956638'}18`,
                      color: design.accentColor || '#956638'
                    }}
                  >
                    <Check size={11} strokeWidth={2.8} />
                  </span>
                  <span
                    className="text-[12px] sm:text-[13px] font-sans font-medium leading-tight"
                    style={{ color: design.textColor || '#62564B' }}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Shop Jewelry Boxes CTA */}
          {btnEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              <Link
                to={btnLink}
                className="inline-flex items-center gap-2 h-[42px] sm:h-[46px] px-5 sm:px-6 rounded-[5px] text-white text-xs sm:text-[13px] font-sans font-semibold tracking-wide transition-all duration-200 shadow-sm hover:shadow hover:brightness-105 active:scale-95 group"
                style={{
                  backgroundColor: design.btnBgColor || design.accentColor || '#956638',
                  color: design.btnTextColor || '#FFFFFF'
                }}
              >
                <span>{btnText}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
};

export default FeaturedBoxBanner;
