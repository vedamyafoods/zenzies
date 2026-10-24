import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, ArrowRight } from 'lucide-react';
import { db } from '../../components/Firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { getOptimizedImageUrl, handleImageError } from '../../config/cloudinary';
import useSectionDesign from '../../hooks/useSectionDesign';

const defaultPhotos = [
  { id: 1, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=500&auto=format&fit=crop' },
  { id: 2, image: '/img/zenzies/hero_model.png' },
  { id: 3, image: '/img/zenzies/jewellery_box_lifestyle.jpg' },
  { id: 4, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500&auto=format&fit=crop' },
  { id: 5, image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=500&auto=format&fit=crop' },
  { id: 6, image: '/img/zenzies/featured_organizer_box.png' },
];

const SocialGallery = () => {
  const [photos, setPhotos] = useState(defaultPhotos);
  const { design, containerStyle, overlayStyle, isEnabled } = useSectionDesign('social_gallery', {
    backgroundColor: '#FFFFFF',
    paddingTop: '48px',
    paddingBottom: '64px',
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "gallery"), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map((d) => ({ id: d.id, image: d.data().url, ...d.data() }));
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        if (list.length >= 6) {
          setPhotos(list.slice(0, 6));
        } else {
          setPhotos([...list, ...defaultPhotos.slice(list.length)]);
        }
      }
    });

    return () => unsub();
  }, []);

  if (!isEnabled) return null;

  const eyebrow = design.eyebrow || 'FOLLOW @ZENZIES';
  const title = design.title || 'Join Our Shining Community';
  const instagramUrl = design.instagramUrl || design.instagramLink || 'https://www.instagram.com';

  return (
    <section style={containerStyle} className="relative w-full border-b border-[#E8DDD2]">
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}
      <div className="w-full max-w-[1640px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
          <div className="space-y-1 text-left">
            <span
              className="text-[11px] font-sans font-semibold tracking-[0.22em] uppercase"
              style={{ color: design.accentColor || '#956638', fontSize: design.eyebrowFontSize || undefined }}
            >
              {eyebrow}
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-normal leading-tight"
              style={{ color: design.titleColor || '#211A16', fontSize: design.titleFontSize || undefined }}
            >
              {title}
            </h2>
          </div>

          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans font-semibold text-[#211A16] hover:text-[#956638] transition-colors group self-start sm:self-end"
          >
            <span>View on Instagram</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </a>
        </div>

        {/* 6 Square Images Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
          {photos.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group relative aspect-square rounded-lg overflow-hidden border border-[#E8DDD2] bg-[#FAF6F0]"
            >
              <img
                src={getOptimizedImageUrl(item.image)}
                alt="Zenzies Community"
                loading="lazy"
                decoding="async"
                onError={(e) => handleImageError(e, item.image)}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-[#211A16]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram size={22} className="text-white drop-shadow-md" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SocialGallery;