import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useSectionDesign from '../../hooks/useSectionDesign';

const TheEdit = () => {
  const { design, containerStyle, overlayStyle, isEnabled } = useSectionDesign('promotional_banners', {
    backgroundColor: '#FBF7F2',
    paddingTop: '40px',
    paddingBottom: '64px',
  });

  if (!isEnabled) return null;

  return (
    <section style={containerStyle} className="relative w-full border-b border-[#E8DDD2]">
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

          {/* Banner 1: Special Moments / Bundles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative rounded-2xl overflow-hidden h-[250px] sm:h-[280px] lg:h-[300px] border border-[#E8DDD2] shadow-xs flex items-center justify-start p-7 sm:p-10 text-left"
          >
            {/* Background Image */}
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=900"
              alt="Crafted for Life's Special Moments"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* High Contrast Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#211A16]/85 via-[#211A16]/55 to-[#211A16]/20 pointer-events-none" />

            {/* Banner Content */}
            <div className="relative z-10 max-w-xs space-y-4">
              <span className="text-[11px] font-sans font-semibold tracking-[0.2em] text-[#E9D9C7] uppercase block">
                CURATED COMBOS
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-white font-normal leading-tight">
                Crafted for Life's Special Moments
              </h3>
              <Link
                to="/shop?category=Bundles"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-white hover:bg-[#FBF7F2] text-[#211A16] hover:text-[#956638] text-xs font-sans font-semibold tracking-wide transition-all shadow-sm"
              >
                <span>Explore Bundles</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>

          {/* Banner 2: A Gift That Lasts Forever */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative rounded-2xl overflow-hidden h-[250px] sm:h-[280px] lg:h-[300px] border border-[#E8DDD2] shadow-xs flex items-center justify-start p-7 sm:p-10 text-left"
          >
            {/* Background Image */}
            <img
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=900"
              alt="A Gift That Lasts Forever"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* High Contrast Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#211A16]/85 via-[#211A16]/55 to-[#211A16]/20 pointer-events-none" />

            {/* Banner Content */}
            <div className="relative z-10 max-w-xs space-y-4">
              <span className="text-[11px] font-sans font-semibold tracking-[0.2em] text-[#E9D9C7] uppercase block">
                GIFT SETS
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-white font-normal leading-tight">
                A Gift That Lasts Forever
              </h3>
              <Link
                to="/shop?category=Jewellery+Boxes"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-white hover:bg-[#FBF7F2] text-[#211A16] hover:text-[#956638] text-xs font-sans font-semibold tracking-wide transition-all shadow-sm"
              >
                <span>Shop Gifts</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default TheEdit;
