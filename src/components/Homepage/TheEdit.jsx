import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useSectionDesign from '../../hooks/useSectionDesign';

const DEFAULT_BANNER1 = {
  eyebrow: '',
  title: "Crafted for Life's Special Moments",
  titleColor: '#211A16',
  btnText: 'Explore Wedding',
  btnLink: '/shop?category=Wedding',
  btnBgColor: '#8C6239',
  btnTextColor: '#FFFFFF',
  image: '/img/zenzies/wedding_rings_banner.jpg',
  align: 'right', // 'left', 'center', 'right'
  overlayOpacity: 0,
};

const DEFAULT_BANNER2 = {
  eyebrow: '',
  title: 'A Gift That Lasts Forever',
  titleColor: '#FFFFFF',
  btnText: 'Shop Gifts',
  btnLink: '/shop?category=Jewellery+Boxes',
  btnBgColor: '#FFFFFF',
  btnTextColor: '#211A16',
  image: '/img/zenzies/gift_necklace_banner.jpg',
  align: 'left', // 'left', 'center', 'right'
  overlayOpacity: 0.12,
};

const TheEdit = () => {
  const { design, containerStyle, overlayStyle, btnGradient, isEnabled } = useSectionDesign('promotional_banners', {
    enabled: true,
    fullWidth: true,
    bannerHeight: '480px',
    showDivider: true,
    backgroundColor: '#FAF7F2',
    paddingTop: '0px',
    paddingBottom: '0px',
    banner1Title: DEFAULT_BANNER1.title,
    banner1Eyebrow: DEFAULT_BANNER1.eyebrow,
    banner1TitleColor: DEFAULT_BANNER1.titleColor,
    banner1BtnText: DEFAULT_BANNER1.btnText,
    banner1BtnLink: DEFAULT_BANNER1.btnLink,
    banner1BtnBgColor: DEFAULT_BANNER1.btnBgColor,
    banner1BtnTextColor: DEFAULT_BANNER1.btnTextColor,
    banner1Image: DEFAULT_BANNER1.image,
    banner1Align: DEFAULT_BANNER1.align,
    banner1OverlayOpacity: DEFAULT_BANNER1.overlayOpacity,

    banner2Title: DEFAULT_BANNER2.title,
    banner2Eyebrow: DEFAULT_BANNER2.eyebrow,
    banner2TitleColor: DEFAULT_BANNER2.titleColor,
    banner2BtnText: DEFAULT_BANNER2.btnText,
    banner2BtnLink: DEFAULT_BANNER2.btnLink,
    banner2BtnBgColor: DEFAULT_BANNER2.btnBgColor,
    banner2BtnTextColor: DEFAULT_BANNER2.btnTextColor,
    banner2Image: DEFAULT_BANNER2.image,
    banner2Align: DEFAULT_BANNER2.align,
    banner2OverlayOpacity: DEFAULT_BANNER2.overlayOpacity,
  });

  if (!isEnabled) return null;

  const isFullWidth = design.fullWidth !== false;
  const showDivider = design.showDivider !== false;
  const desktopHeight = design.bannerHeight || '480px';

  // Banner 1 (Left - Rings & Moments)
  const banner1 = {
    eyebrow: design.banner1Eyebrow !== undefined ? design.banner1Eyebrow : DEFAULT_BANNER1.eyebrow,
    title: design.banner1Title || DEFAULT_BANNER1.title,
    titleColor: design.banner1TitleColor || DEFAULT_BANNER1.titleColor,
    titleFontSize: design.banner1TitleFontSize || '',
    btnText: design.banner1BtnText || DEFAULT_BANNER1.btnText,
    btnLink: design.banner1BtnLink || DEFAULT_BANNER1.btnLink,
    btnBgColor: design.banner1BtnBgColor || DEFAULT_BANNER1.btnBgColor,
    btnTextColor: design.banner1BtnTextColor || DEFAULT_BANNER1.btnTextColor,
    image: design.banner1Image || DEFAULT_BANNER1.image,
    align: design.banner1Align || DEFAULT_BANNER1.align,
    overlayOpacity: design.banner1OverlayOpacity !== undefined ? Number(design.banner1OverlayOpacity) : DEFAULT_BANNER1.overlayOpacity,
  };

  // Banner 2 (Right - Necklace & Gifts)
  const banner2 = {
    eyebrow: design.banner2Eyebrow !== undefined ? design.banner2Eyebrow : DEFAULT_BANNER2.eyebrow,
    title: design.banner2Title || DEFAULT_BANNER2.title,
    titleColor: design.banner2TitleColor || DEFAULT_BANNER2.titleColor,
    titleFontSize: design.banner2TitleFontSize || '',
    btnText: design.banner2BtnText || DEFAULT_BANNER2.btnText,
    btnLink: design.banner2BtnLink || DEFAULT_BANNER2.btnLink,
    btnBgColor: design.banner2BtnBgColor || DEFAULT_BANNER2.btnBgColor,
    btnTextColor: design.banner2BtnTextColor || DEFAULT_BANNER2.btnTextColor,
    image: design.banner2Image || DEFAULT_BANNER2.image,
    align: design.banner2Align || DEFAULT_BANNER2.align,
    overlayOpacity: design.banner2OverlayOpacity !== undefined ? Number(design.banner2OverlayOpacity) : DEFAULT_BANNER2.overlayOpacity,
  };

  // Alignment classes helper
  const getAlignmentClasses = (align) => {
    switch (align) {
      case 'left':
        return 'justify-start items-center text-left pl-8 sm:pl-12 lg:pl-16 pr-6';
      case 'center':
        return 'justify-center items-center text-center px-6';
      case 'right':
      default:
        return 'justify-end items-center text-left pr-8 sm:pr-12 lg:pr-16 pl-6';
    }
  };

  return (
    <section
      style={{
        ...containerStyle,
        paddingTop: design.paddingTop || '0px',
        paddingBottom: design.paddingBottom || '0px',
      }}
      className="relative w-full overflow-hidden bg-[#FAF7F2]"
    >
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}

      {/* Main 50% / 50% Full-Width Split Container */}
      <div className={isFullWidth ? 'w-full' : 'max-w-[1400px] mx-auto px-4 sm:px-6'}>
        <div className="grid grid-cols-1 md:grid-cols-2 w-full">

          {/* ─── Banner 1 (Left: Crafted for Life's Special Moments) ───────── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ minHeight: desktopHeight }}
            className={`group relative w-full overflow-hidden flex ${getAlignmentClasses(banner1.align)} ${
              showDivider ? 'md:border-r border-[#E8DDD2]/60' : ''
            }`}
          >
            {/* Background Image with smooth hover scale */}
            <img
              src={banner1.image}
              alt={banner1.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Custom Overlay (if specified) */}
            {banner1.overlayOpacity > 0 && (
              <div
                className="absolute inset-0 bg-black pointer-events-none transition-opacity"
                style={{ opacity: banner1.overlayOpacity }}
              />
            )}

            {/* Subtle soft directional gradient for text readability if dark text */}
            {banner1.titleColor === '#211A16' && banner1.align === 'right' && (
              <div className="absolute inset-0 bg-gradient-to-l from-white/30 via-white/10 to-transparent pointer-events-none" />
            )}

            {/* Banner 1 Text & Button Content */}
            <div className="relative z-10 max-w-sm sm:max-w-md py-12">
              {banner1.eyebrow && (
                <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase block mb-3 opacity-90"
                  style={{ color: banner1.titleColor }}
                >
                  {banner1.eyebrow}
                </span>
              )}

              <h3
                className="font-serif text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-normal leading-[1.12] tracking-tight whitespace-pre-line"
                style={{ color: banner1.titleColor, fontSize: banner1.titleFontSize || undefined }}
              >
                {banner1.title}
              </h3>

              <div className="pt-6 sm:pt-7">
                <Link
                  to={banner1.btnLink}
                  style={{
                    background: banner1.btnBgColor && banner1.btnBgColor !== '#8C6239' ? banner1.btnBgColor : btnGradient,
                    color: banner1.btnTextColor || '#FFFFFF',
                  }}
                  className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-[6px] text-xs sm:text-sm font-sans font-semibold tracking-wide shadow-md hover:brightness-105 hover:shadow-lg transition-all duration-200 active:scale-95 text-white"
                >
                  <span>{banner1.btnText}</span>
                  <ArrowRight size={15} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ─── Banner 2 (Right: A Gift That Lasts Forever) ────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ minHeight: desktopHeight }}
            className={`group relative w-full overflow-hidden flex ${getAlignmentClasses(banner2.align)}`}
          >
            {/* Background Image with smooth hover scale */}
            <img
              src={banner2.image}
              alt={banner2.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Custom Overlay (if specified) */}
            {banner2.overlayOpacity > 0 && (
              <div
                className="absolute inset-0 bg-black pointer-events-none transition-opacity"
                style={{ opacity: banner2.overlayOpacity }}
              />
            )}

            {/* Subtle soft directional gradient for readability */}
            {banner2.titleColor === '#FFFFFF' && banner2.align === 'left' && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/15 to-transparent pointer-events-none" />
            )}

            {/* Banner 2 Text & Button Content */}
            <div className="relative z-10 max-w-sm sm:max-w-md py-12">
              {banner2.eyebrow && (
                <span className="text-[11px] font-sans font-semibold tracking-[0.2em] uppercase block mb-3 opacity-90"
                  style={{ color: banner2.titleColor }}
                >
                  {banner2.eyebrow}
                </span>
              )}

              <h3
                className="font-serif text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-normal leading-[1.12] tracking-tight whitespace-pre-line"
                style={{ color: banner2.titleColor, fontSize: banner2.titleFontSize || undefined }}
              >
                {banner2.title}
              </h3>

              <div className="pt-6 sm:pt-7">
                <Link
                  to={banner2.btnLink}
                  style={{
                    backgroundColor: banner2.btnBgColor,
                    color: banner2.btnTextColor,
                  }}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-[4px] text-xs sm:text-sm font-sans font-semibold tracking-wide shadow-sm hover:brightness-95 hover:shadow-md transition-all duration-200"
                >
                  <span>{banner2.btnText}</span>
                  <ArrowRight size={15} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default TheEdit;
