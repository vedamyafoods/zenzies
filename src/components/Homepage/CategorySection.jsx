import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { db } from '../../components/Firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { getOptimizedImageUrl, handleImageError } from '../../config/cloudinary';
import useSectionDesign from '../../hooks/useSectionDesign';

// Curated high-aesthetic fallbacks for missing images
const FALLBACK_CATEGORY_IMAGES = {
  rings: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400",
  necklaces: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400",
  necklace: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400",
  earrings: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=400",
  earings: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=400",
  bracelets: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400",
  bangles: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400",
  "jewellery boxes": "/img/zenzies/jewellery_box_lifestyle.jpg",
  "jewelry boxes": "/img/zenzies/jewellery_box_lifestyle.jpg",
  wedding: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400",
  gifts: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400",
  default: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400",
};

const DEFAULT_CATEGORIES = [
  { id: 'rings', name: "Rings", image: FALLBACK_CATEGORY_IMAGES.rings, link: "/shop?category=Rings", order: 1 },
  { id: 'necklaces', name: "Necklaces", image: FALLBACK_CATEGORY_IMAGES.necklaces, link: "/shop?category=Necklace", order: 2 },
  { id: 'earrings', name: "Earrings", image: FALLBACK_CATEGORY_IMAGES.earrings, link: "/shop?category=Earrings", order: 3 },
  { id: 'bracelets', name: "Bracelets", image: FALLBACK_CATEGORY_IMAGES.bracelets, link: "/shop?category=Bracelet", order: 4 },
  { id: 'jewelry_boxes', name: "Jewelry Boxes", image: FALLBACK_CATEGORY_IMAGES["jewellery boxes"], link: "/shop?category=Jewellery+Boxes", order: 5 },
  { id: 'wedding', name: "Wedding", image: FALLBACK_CATEGORY_IMAGES.wedding, link: "/shop?category=Bundles", order: 6 },
  { id: 'gifts', name: "Gifts", image: FALLBACK_CATEGORY_IMAGES.gifts, link: "/shop?category=Jewellery+Boxes", order: 7 },
];

const getFallbackForName = (name = '') => {
  const lower = name.toLowerCase().trim();
  if (lower.includes('box')) return FALLBACK_CATEGORY_IMAGES["jewellery boxes"];
  if (lower.includes('ring')) return FALLBACK_CATEGORY_IMAGES.rings;
  if (lower.includes('neck')) return FALLBACK_CATEGORY_IMAGES.necklaces;
  if (lower.includes('ear')) return FALLBACK_CATEGORY_IMAGES.earrings;
  if (lower.includes('brace') || lower.includes('bangle')) return FALLBACK_CATEGORY_IMAGES.bracelets;
  if (lower.includes('wed')) return FALLBACK_CATEGORY_IMAGES.wedding;
  if (lower.includes('gift')) return FALLBACK_CATEGORY_IMAGES.gifts;
  return FALLBACK_CATEGORY_IMAGES.default;
};

const CategorySection = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const { design, containerStyle, overlayStyle, isEnabled } = useSectionDesign('category_grid', {
    backgroundColor: '#FFFFFF',
    paddingTop: '48px',
    paddingBottom: '52px',
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "categories"), (snap) => {
      if (!snap.empty) {
        const fetched = snap.docs
          .map((d) => {
            const item = d.data();
            const rawName = item.name || '';
            const nameLower = rawName.toLowerCase().trim();

            // Destination route resolution
            let targetCategory = rawName;
            if (nameLower === 'necklaces') targetCategory = 'Necklace';
            else if (nameLower === 'bracelets') targetCategory = 'Bracelet';
            else if (nameLower === 'earrings' || nameLower === 'earings') targetCategory = 'Earrings';
            else if (nameLower === 'rings') targetCategory = 'Rings';
            else if (nameLower.includes('box')) targetCategory = 'Jewellery Boxes';
            else if (nameLower.includes('bundle') || nameLower.includes('set')) targetCategory = 'Bundles';

            const shopLink = item.link?.trim()
              ? item.link.trim()
              : (targetCategory ? `/shop?category=${encodeURIComponent(targetCategory)}` : '/shop');

            return {
              id: d.id,
              name: rawName || targetCategory,
              image: item.image || getFallbackForName(rawName),
              link: shopLink,
              status: item.status || 'Active',
              order: item.order !== undefined ? Number(item.order) : 99,
            };
          })
          // Only show active categories
          .filter((cat) => cat.status !== 'Draft' && cat.status !== 'Trash');

        // Sort by configured order, then prioritize Jewellery Boxes
        fetched.sort((a, b) => {
          if (a.order !== b.order) return a.order - b.order;
          return a.name.localeCompare(b.name);
        });

        if (fetched.length > 0) {
          setCategories(fetched);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } else {
        setCategories(DEFAULT_CATEGORIES);
      }
    }, (err) => {
      console.warn("CategorySection onSnapshot error:", err);
      setCategories(DEFAULT_CATEGORIES);
    });

    return () => unsub();
  }, []);

  if (!isEnabled) return null;

  const eyebrow = design.eyebrow || 'SHOP BY CATEGORY';
  const title = design.title || 'Find Your Perfect Piece';
  const subtitle = design.subtitle || 'Explore our curated collections for every occasion.';
  const viewAllText = design.viewAllText || 'View All Categories';
  const viewAllLink = design.viewAllLink || '/shop';

  return (
    <section
      style={{
        ...containerStyle,
        backgroundColor: design.backgroundColor || '#FFFFFF',
      }}
      className="relative w-full border-b border-[#E8DDD2]/60 overflow-hidden"
    >
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}

      {/* Full-width container with controlled inner max-width */}
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-14 py-10 sm:py-12 lg:py-14 relative z-10">

        {/* Section Header: Centered Eyebrow, Heading, Description + Aligned Right Link */}
        <div className="relative mb-8 sm:mb-12">

          {/* Centered Editorial Header Content */}
          <div className="text-center space-y-2 max-w-2xl mx-auto px-4">
            <span
              className="font-sans text-[11px] sm:text-[12px] font-semibold tracking-[0.24em] uppercase block"
              style={{ color: design.accentColor || '#956638' }}
            >
              {eyebrow}
            </span>

            <h2
              className="font-serif text-[32px] sm:text-[38px] lg:text-[42px] font-medium leading-[1.1] tracking-tight m-0"
              style={{ color: design.titleColor || '#211A16' }}
            >
              {title}
            </h2>

            <p
              className="font-sans text-[13.5px] sm:text-[14.5px] font-normal leading-relaxed max-w-lg mx-auto pt-1"
              style={{ color: design.subtitleColor || '#62564B' }}
            >
              {subtitle}
            </p>
          </div>

          {/* View All Categories Link: Right-aligned on desktop, subtle arrow transition */}
          <div className="mt-3 sm:mt-0 sm:absolute sm:right-0 sm:bottom-0 flex justify-center sm:justify-end">
            <Link
              to={viewAllLink}
              className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-sans font-medium text-[#65472D] hover:text-[#956638] transition-colors duration-200 group py-1"
            >
              <span>{viewAllText}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>

        {/* Category Image Row: Evenly distributed circular category avatars */}
        <div className="flex items-start justify-start sm:justify-center gap-5 sm:gap-7 lg:gap-9 xl:gap-11 overflow-x-auto no-scrollbar pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id || idx}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="flex flex-col items-center shrink-0 group text-center"
            >
              {/* Circular Avatar Container: aspect 1:1, 50% border radius, overflow hidden, smooth 1.04 scale hover */}
              <Link
                to={cat.link}
                className="relative block w-[92px] h-[92px] sm:w-[104px] sm:h-[104px] lg:w-[114px] lg:h-[114px] xl:w-[135px] xl:h-[135px] rounded-full overflow-hidden bg-[#F3E4DA] shadow-xs group-hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#956638] focus:ring-offset-2"
                style={{ aspectRatio: '1 / 1' }}
              >
                <img
                  src={getOptimizedImageUrl(cat.image)}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => handleImageError(e, cat.image)}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-250 ease-out"
                />
              </Link>

              {/* Category Label: Inter font, centered, readable, 2-line balanced wrapping */}
              <Link
                to={cat.link}
                className="mt-2.5 sm:mt-3 text-xs sm:text-[13px] font-sans font-medium sm:font-semibold text-[#211A16] group-hover:text-[#956638] transition-colors leading-tight max-w-[105px] sm:max-w-[115px] text-center"
              >
                {cat.name}
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;
