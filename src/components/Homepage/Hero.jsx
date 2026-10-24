import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { db } from '../../components/Firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import useSectionDesign from '../../hooks/useSectionDesign';
import { getIconComponent } from '../../utils/iconRegistry';

const DEFAULT_HERO_BENEFITS = [
  { id: 'b1', icon: 'gem', text: 'Trendy Designs' },
  { id: 'b2', icon: 'gift', text: 'Perfect for Gifting' },
  { id: 'b3', icon: 'shield-check', text: 'Secure Payment' },
  { id: 'b4', icon: 'truck', text: 'Fast Delivery' },
];

const DEFAULT_HERO = {
  eyebrow: "JEWELLERY & EVERYDAY ORGANIZATION",
  line1: "Little Boxes.",
  line2: "Beautiful Things.",
  subtitle: "Discover beautiful jewellery and practical organizer boxes designed for your everyday moments.",
  btn1Text: "Shop Jewellery",
  btn1Link: "/shop",
  btn2Text: "Explore Jewellery Boxes",
  btn2Link: "/shop?category=Jewellery+Boxes",
  videoURL: "/img/video1.mp4",
  posterURL: "/img/zenzies/hero_banner_lifestyle.png",
  benefits: DEFAULT_HERO_BENEFITS,
};

const Hero = () => {
  const [heroConfig, setHeroConfig] = useState(DEFAULT_HERO);
  const [videoError, setVideoError] = useState(false);

  // Hook connecting hero section styling to admin Homepage Design Manager
  const { design, containerStyle, overlayStyle, isEnabled } = useSectionDesign('hero', {
    backgroundColor: '#FAF6F0',
    backgroundImage: '/img/zenzies/hero_banner_lifestyle.png',
    backgroundSize: 'cover',
    backgroundPosition: 'center right',
    backgroundRepeat: 'no-repeat',
    paddingTop: '60px',
    paddingBottom: '60px',
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "site_settings", "hero"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        let l1 = data.line1;
        let l2 = data.line2;
        if (!l1 && !l2 && data.title) {
          const parts = data.title.split('\n');
          if (parts.length >= 2) {
            l1 = parts[0];
            l2 = parts.slice(1).join(' ');
          } else {
            l1 = data.title;
            l2 = '';
          }
        }
        setHeroConfig({
          videoURL: data.videoURL || "",
          posterURL: data.posterURL || "",
          eyebrow: data.eyebrow !== undefined ? data.eyebrow : DEFAULT_HERO.eyebrow,
          line1: l1 !== undefined ? l1 : DEFAULT_HERO.line1,
          line2: l2 !== undefined ? l2 : DEFAULT_HERO.line2,
          subtitle: data.subtitle !== undefined ? data.subtitle : DEFAULT_HERO.subtitle,
          btn1Text: data.btn1Text || DEFAULT_HERO.btn1Text,
          btn1Link: data.btn1Link || DEFAULT_HERO.btn1Link,
          btn2Text: data.btn2Text || DEFAULT_HERO.btn2Text,
          btn2Link: data.btn2Link || DEFAULT_HERO.btn2Link,
          benefits: Array.isArray(data.benefits) && data.benefits.length > 0
            ? data.benefits
            : DEFAULT_HERO_BENEFITS,
        });
      }
    });
    return () => unsub();
  }, []);

  // Reset video error when video source changes
  useEffect(() => {
    setVideoError(false);
  }, [heroConfig.videoURL]);

  if (!isEnabled) return null;

  // Background fallback image
  const resolvedBgImage = heroConfig.posterURL || design.backgroundImage || '/img/zenzies/hero_banner_lifestyle.png';

  // Build responsive style for container
  const heroStyle = {
    ...containerStyle,
    backgroundImage: resolvedBgImage ? `url(${resolvedBgImage})` : `url(/img/zenzies/hero_banner_lifestyle.png)`,
    backgroundSize: design.backgroundSize || 'cover',
    backgroundPosition: design.backgroundPosition || 'center right',
    backgroundRepeat: 'no-repeat',
  };

  const hasActiveVideo = Boolean(heroConfig.videoURL && !videoError);

  return (
    <section
      style={heroStyle}
      className="relative w-full overflow-hidden border-b border-[#E8DDD2] min-h-[520px] sm:min-h-[580px] lg:min-h-[600px] xl:min-h-[640px] flex items-center"
    >
      {/* Background Video Layer (Autoplay Ambient loop if provided) */}
      {hasActiveVideo && (
        <video
          key={heroConfig.videoURL}
          autoPlay
          loop
          muted
          playsInline
          poster={resolvedBgImage}
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        >
          <source src={heroConfig.videoURL} type="video/mp4" />
          <source src={heroConfig.videoURL} type="video/webm" />
        </video>
      )}

      {/* Optional Admin-configured Overlay */}
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}

      {/* Subtle Warm Gradient Overlay on left to guarantee pristine text contrast and legibility */}
      <div
        className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/90 via-45% to-transparent hidden lg:block"
      />
      {/* Mobile/Tablet backdrop to protect text readability */}
      <div
        className="absolute inset-0 pointer-events-none z-0 bg-[#FAF6F0]/92 lg:hidden"
      />

      <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-14 py-12 sm:py-14 lg:py-16 relative z-10">
        <div className="w-full lg:max-w-[560px] xl:max-w-[640px] 2xl:max-w-[700px] text-left">

          {/* Eyebrow text */}
          {heroConfig.eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 sm:mb-6"
            >
              <span className="font-sans text-xs sm:text-[13px] lg:text-[14px] font-semibold tracking-[0.24em] text-[#956638] uppercase block">
                {heroConfig.eyebrow}
              </span>
            </motion.div>
          )}

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-medium tracking-tight m-0"
            style={{
              fontSize: 'clamp(42px, 5.2vw, 92px)',
              lineHeight: 1.0,
              letterSpacing: '-0.025em',
            }}
          >
            {heroConfig.line1 && (
              <span className="block text-[#211A16]">{heroConfig.line1}</span>
            )}
            {heroConfig.line2 && (
              <span className="block text-[#B8752A]">{heroConfig.line2}</span>
            )}
          </motion.h1>

          {/* Description */}
          {heroConfig.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans font-normal text-[#62564B] mt-5 sm:mt-6 mb-7 sm:mb-8 leading-[1.6] max-w-[580px]"
              style={{ fontSize: 'clamp(15px, 1.3vw, 21px)' }}
            >
              {heroConfig.subtitle}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-1"
          >
            {/* Primary CTA */}
            {heroConfig.btn1Text && (
              <Link
                to={heroConfig.btn1Link || "/shop"}
                className="inline-flex items-center justify-center gap-4 px-7 sm:px-8 py-3.5 sm:py-4 rounded-[8px] bg-[#B8752A] hover:bg-[#9E621F] text-white font-sans text-sm sm:text-base font-semibold transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B8752A] focus:ring-offset-2"
                style={{ minHeight: '52px' }}
              >
                <span>{heroConfig.btn1Text}</span>
                <ArrowRight size={17} />
              </Link>
            )}

            {/* Secondary CTA */}
            {heroConfig.btn2Text && (
              <Link
                to={heroConfig.btn2Link || "/shop?category=Jewellery+Boxes"}
                className="inline-flex items-center justify-center gap-4 px-7 sm:px-8 py-3.5 sm:py-4 rounded-[8px] bg-transparent hover:bg-[#F3E4DA]/40 border-2 border-[#B8752A] text-[#956638] font-sans text-sm sm:text-base font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#B8752A] focus:ring-offset-2"
                style={{ minHeight: '52px' }}
              >
                <span>{heroConfig.btn2Text}</span>
                <ArrowRight size={17} className="text-[#956638]" />
              </Link>
            )}
          </motion.div>

          {/* Dynamic Benefit strip below CTA */}
          {Array.isArray(heroConfig.benefits) && heroConfig.benefits.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 sm:mt-12 lg:mt-14 pt-4 flex flex-wrap items-center gap-y-3 gap-x-4 sm:gap-x-6 text-[#62564B]"
            >
              {heroConfig.benefits.map((benefit, idx) => {
                const IconComponent = getIconComponent(benefit.icon || 'gem');
                return (
                  <React.Fragment key={benefit.id || idx}>
                    {idx > 0 && (
                      <div className="hidden sm:block h-7 w-[1px] bg-[#62564B]/20" />
                    )}
                    <div className="flex items-center gap-2.5">
                      <IconComponent size={26} strokeWidth={1.5} className="text-[#B8752A] shrink-0" />
                      <span className="font-sans text-xs sm:text-[13px] font-medium leading-tight whitespace-pre-line text-[#62564B]">
                        {benefit.text}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Hero;
