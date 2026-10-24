import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { db } from '../../components/Firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { getOptimizedImageUrl, handleImageError } from '../../config/cloudinary';
import useSectionDesign from '../../hooks/useSectionDesign';

// Curated high-aesthetic images matching the user reference design
const FALLBACK_CATEGORY_DATA = {
  rings: {
    image: "/img/zenzies/categories/rings.png",
    tag: "50+ DESIGNS",
    btnTheme: "cream"
  },
  necklaces: {
    image: "/img/zenzies/categories/necklaces.png",
    tag: "100+ DESIGNS",
    btnTheme: "cream"
  },
  earrings: {
    image: "/img/zenzies/categories/earrings.png",
    tag: "200+ DESIGNS",
    btnTheme: "rose"
  },
  bracelets: {
    image: "/img/zenzies/categories/bracelets.png",
    tag: "80+ DESIGNS",
    btnTheme: "cream"
  },
  "jewellery boxes": {
    image: "/img/zenzies/categories/jewellery_boxes.png",
    tag: "30+ OPTIONS",
    btnTheme: "rose"
  },
  bundles: {
    image: "/img/zenzies/categories/bundles.png",
    tag: "40+ COMBOS",
    btnTheme: "cream"
  },
  gifts: {
    image: "/img/zenzies/categories/gifts.png",
    tag: "20+ IDEAS",
    btnTheme: "rose"
  }
};

const DEFAULT_CATEGORIES = [
  { id: 'rings', name: "Rings", image: "/img/zenzies/categories/rings.png", tag: "50+ DESIGNS", link: "/shop?category=Rings", order: 1, btnTheme: 'cream' },
  { id: 'necklaces', name: "Necklaces", image: "/img/zenzies/categories/necklaces.png", tag: "100+ DESIGNS", link: "/shop?category=Necklace", order: 2, btnTheme: 'cream' },
  { id: 'earrings', name: "Earrings", image: "/img/zenzies/categories/earrings.png", tag: "200+ DESIGNS", link: "/shop?category=Earrings", order: 3, btnTheme: 'rose' },
  { id: 'bracelets', name: "Bracelets", image: "/img/zenzies/categories/bracelets.png", tag: "80+ DESIGNS", link: "/shop?category=Bracelet", order: 4, btnTheme: 'cream' },
  { id: 'jewelry_boxes', name: "Jewellery Boxes", image: "/img/zenzies/categories/jewellery_boxes.png", tag: "30+ OPTIONS", link: "/shop?category=Jewellery+Boxes", order: 5, btnTheme: 'rose' },
  { id: 'bundles', name: "Bundles", image: "/img/zenzies/categories/bundles.png", tag: "40+ COMBOS", link: "/shop?category=Bundles", order: 6, btnTheme: 'cream' },
  { id: 'gifts', name: "Gifts", image: "/img/zenzies/categories/gifts.png", tag: "20+ IDEAS", link: "/shop?category=Jewellery+Boxes", order: 7, btnTheme: 'rose' },
];

const getFallbackForName = (name = '') => {
  const lower = name.toLowerCase().trim();
  if (lower.includes('box')) return FALLBACK_CATEGORY_DATA["jewellery boxes"];
  if (lower.includes('ring')) return FALLBACK_CATEGORY_DATA.rings;
  if (lower.includes('neck')) return FALLBACK_CATEGORY_DATA.necklaces;
  if (lower.includes('ear')) return FALLBACK_CATEGORY_DATA.earrings;
  if (lower.includes('brace') || lower.includes('bangle')) return FALLBACK_CATEGORY_DATA.bracelets;
  if (lower.includes('bundle') || lower.includes('wed') || lower.includes('set')) return FALLBACK_CATEGORY_DATA.bundles;
  if (lower.includes('gift')) return FALLBACK_CATEGORY_DATA.gifts;
  return FALLBACK_CATEGORY_DATA.rings;
};

const CategorySection = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const { design, containerStyle, overlayStyle, btnGradient, isEnabled } = useSectionDesign('category_grid', {
    backgroundColor: '#FAF7F2',
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

            const fallback = getFallbackForName(rawName);

            return {
              id: d.id,
              name: rawName || targetCategory,
              image: item.image || fallback.image,
              tag: item.tag || fallback.tag,
              btnTheme: item.btnTheme || fallback.btnTheme,
              link: shopLink,
              status: item.status || 'Active',
              order: item.order !== undefined ? Number(item.order) : 99,
            };
          })
          // Only show active categories
          .filter((cat) => cat.status !== 'Draft' && cat.status !== 'Trash');

        // Sort by configured order
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
        backgroundColor: design.backgroundColor || '#FAF7F2',
      }}
      className="relative w-full border-b border-[#E8DDD2]/60 overflow-hidden"
    >
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}

      {/* Decorative Botanical Branch Line-Art SVG in Top Left Corner (matches user reference image) */}
      <svg
        className="absolute top-2 left-2 sm:left-4 lg:left-6 w-20 sm:w-28 lg:w-36 h-auto text-[#BFA086] opacity-35 sm:opacity-45 pointer-events-none select-none z-0"
        viewBox="0 0 140 140"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      >
        <path d="M15 130 C 40 100, 70 65, 95 18" strokeLinecap="round" />
        <path d="M48 92 C 36 76, 38 58, 56 64 C 64 72, 60 84, 48 92 Z" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05" />
        <path d="M68 70 C 72 52, 88 44, 94 60 C 88 70, 78 74, 68 70 Z" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05" />
        <path d="M86 44 C 84 28, 100 20, 110 32 C 104 42, 94 46, 86 44 Z" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05" />
        <path d="M30 110 C 20 98, 18 82, 32 86 C 40 92, 36 104, 30 110 Z" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05" />
      </svg>

      {/* Almost full-width luxury container */}
      <div className="w-full max-w-[1680px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-12 lg:py-14 relative z-10">

        {/* Section Header: Centered Eyebrow with Divider Lines, Heading with Pink Accent, Description + Aligned Right Pill Link */}
        <div className="relative mb-8 sm:mb-10">

          {/* Centered Editorial Header Content */}
          <div className="text-center space-y-1.5 max-w-2xl mx-auto px-4">
            {/* Flanking Divider Lines Around SHOP BY CATEGORY (matches user screenshot) */}
            <div className="flex items-center justify-center gap-3 sm:gap-5 mb-2">
              <span className="w-10 sm:w-16 md:w-24 h-[1px] bg-[#9E7348]/55 block shrink-0" />
              <span
                className="font-sans text-[11px] sm:text-[12px] font-semibold tracking-[0.26em] uppercase block shrink-0"
                style={{ color: design.accentColor || '#8C6239', fontSize: design.eyebrowFontSize || undefined }}
              >
                {eyebrow}
              </span>
              <span className="w-10 sm:w-16 md:w-24 h-[1px] bg-[#9E7348]/55 block shrink-0" />
            </div>

            <h2
              className="font-serif text-[32px] sm:text-[42px] lg:text-[46px] font-medium leading-[1.12] tracking-tight m-0"
              style={{ color: design.titleColor || '#1F1813', fontSize: design.titleFontSize || undefined }}
            >
              Find Your{' '}
              <span className="relative inline-block">
                Perfect Piece
                {/* Soft blush pink watercolor brush highlight under Perfect Piece */}
                <span className="absolute -bottom-1 sm:-bottom-1.5 left-[-4px] right-[-4px] h-2 sm:h-2.5 bg-[#F4D7CF]/80 -z-10 rounded-full transform -rotate-[0.6deg]" />
              </span>
            </h2>

            <p
              className="font-sans text-[13px] sm:text-[14px] font-normal leading-relaxed max-w-lg mx-auto pt-1 text-[#7A6D63]"
              style={{ color: design.subtitleColor || '#7A6D63', fontSize: design.subtitleFontSize || undefined }}
            >
              {subtitle}
            </p>
          </div>

          {/* View All Categories Pill Button: Right-aligned on desktop, subtle arrow transition */}
          <div className="mt-4 sm:mt-0 sm:absolute sm:right-0 sm:bottom-0 flex justify-center sm:justify-end">
            <Link
              to={viewAllLink}
              className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border border-[#DECDBF] bg-white/85 hover:bg-white text-[#5C4533] hover:text-[#8C6239] text-xs sm:text-[13px] font-medium shadow-xs hover:shadow-md transition-all duration-200 group"
            >
              <span>{viewAllText}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>

        {/* 7 Vertical Product Box Cards (matches user screenshot exactly) */}
        <div className="flex lg:grid lg:grid-cols-7 gap-3.5 sm:gap-4 lg:gap-3 xl:gap-4 overflow-x-auto lg:overflow-visible no-scrollbar pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id || idx}
              to={cat.link}
              className="flex-shrink-0 w-[165px] sm:w-[195px] lg:w-auto bg-white rounded-[20px] sm:rounded-[22px] p-2.5 sm:p-3 shadow-[0_8px_24px_rgba(40,30,20,0.07)] hover:shadow-[0_22px_44px_-6px_rgba(40,30,20,0.22)] hover:-translate-y-2.5 sm:hover:-translate-y-3 hover:scale-[1.018] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] border border-[#EFE8E1] flex flex-col group will-change-transform"
            >
              {/* Product Card Image Box: Vertical rounded image window with hover zoom */}
              <div className="rounded-[15px] sm:rounded-[17px] overflow-hidden aspect-[4/4.7] relative bg-[#F5EFE9] w-full">
                <img
                  src={getOptimizedImageUrl(cat.image)}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => handleImageError(e, cat.image)}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-600 ease-out"
                />
              </div>

              {/* Bottom Info Bar: Title + Designs Subtitle on Left, Round Arrow Button on Right */}
              <div className="pt-3 pb-1 px-1 sm:px-1.5 flex items-center justify-between gap-1.5 mt-auto">
                <div className="min-w-0 pr-1">
                  <h3
                    className="font-serif text-[17px] sm:text-[19px] lg:text-[17px] xl:text-[19.5px] font-semibold text-[#1F1713] tracking-tight leading-tight group-hover:text-[#956638] transition-colors truncate"
                    style={{ fontSize: design.cardLabelFontSize || undefined }}
                  >
                    {cat.name}
                  </h3>
                  <span className="font-sans text-[9px] sm:text-[10px] xl:text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#A09389] mt-0.5 block truncate">
                    {cat.tag || 'EXPLORE'}
                  </span>
                </div>

                {/* Circular Action Button with Hover Elevation & Luxury Gradient */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs ${
                    cat.btnTheme === 'rose'
                      ? 'bg-[#DF8C7F] text-white group-hover:shadow-md'
                      : 'bg-[#EFE5DB] text-[#6E4F39] group-hover:bg-[#DF8C7F] group-hover:text-white group-hover:shadow-md'
                  }`}
                  style={
                    cat.btnTheme === 'gradient' && btnGradient
                      ? { background: btnGradient, color: '#fff' }
                      : undefined
                  }
                >
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;
