import React, { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { db } from '../Firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import useSectionDesign from '../../hooks/useSectionDesign';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    name: "Priya S.",
    title: "Verified Buyer",
    quote: "Absolutely stunning quality! The ring is even more beautiful in person.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    enabled: true,
  },
  {
    id: 'rev-2',
    name: "Megha K.",
    title: "Verified Buyer",
    quote: "Elegant designs and excellent customer service. Highly recommended!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    enabled: true,
  },
  {
    id: 'rev-3',
    name: "Rohan M.",
    title: "Verified Buyer",
    quote: "The perfect gift for my anniversary. She loved it!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    enabled: true,
  }
];

const TestimonialSection = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [firestoreReviews, setFirestoreReviews] = useState([]);

  const { design, containerStyle, overlayStyle, isEnabled } = useSectionDesign('testimonials', {
    backgroundColor: '#FAF7F2',
    paddingTop: '48px',
    paddingBottom: '80px',
    eyebrow: 'WHAT OUR CUSTOMERS SAY',
    title: 'Loved by Thousands',
    titleColor: '#211A16',
    accentColor: '#8C6239',
    cardBackgroundColor: '#FFFFFF',
    cardBorderColor: '#E8DDD2',
    starColor: '#E5A83B',
    reviews: DEFAULT_REVIEWS,
  });

  // Optional: Listen to Firestore reviews collection if any reviews were submitted by buyers
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reviews"), (snapshot) => {
      if (!snapshot.empty) {
        const fetched = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.visible !== false) {
            fetched.push({
              id: docSnap.id,
              name: data.customerName || data.name || "Verified Customer",
              title: data.title || "Verified Buyer",
              quote: data.review || data.quote || "",
              rating: Number(data.rating) || 5,
              avatar: data.avatar || DEFAULT_REVIEWS[fetched.length % DEFAULT_REVIEWS.length].avatar,
              enabled: true,
            });
          }
        });
        if (fetched.length > 0) {
          setFirestoreReviews(fetched);
        }
      }
    }, (error) => {
      console.warn("Firestore reviews listener note:", error);
    });

    return () => unsubscribe();
  }, []);

  if (!isEnabled) return null;

  // Determine reviews array priority: design.reviews (from Admin Manager) > firestore reviews > DEFAULT_REVIEWS
  const adminReviews = Array.isArray(design.reviews) && design.reviews.length > 0
    ? design.reviews.filter(r => r && r.enabled !== false)
    : [];

  const displayReviews = adminReviews.length > 0
    ? adminReviews
    : firestoreReviews.length > 0
    ? firestoreReviews
    : DEFAULT_REVIEWS;

  const eyebrow = design.eyebrow || 'WHAT OUR CUSTOMERS SAY';
  const title = design.title || 'Loved by Thousands';
  const accentColor = design.accentColor || '#8C6239';
  const titleColor = design.titleColor || '#211A16';
  const cardBgColor = design.cardBackgroundColor || '#FFFFFF';
  const cardBorderColor = design.cardBorderColor || '#E8DDD2';
  const starColor = design.starColor || '#E5A83B';

  return (
    <section
      style={{
        ...containerStyle,
        backgroundColor: design.backgroundColor || '#FAF7F2',
        paddingTop: design.paddingTop || '48px',
        paddingBottom: design.paddingBottom || '80px',
      }}
      className="relative w-full border-b border-[#E8DDD2]/60 overflow-hidden"
    >
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}

      <div className="w-full max-w-[1640px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">

        {/* Section Header with Left Title and Right Navigation Arrows */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div className="space-y-1 text-left">
            <span
              className="text-[11px] font-sans font-semibold tracking-[0.22em] uppercase block"
              style={{ color: accentColor, fontSize: design.eyebrowFontSize || undefined }}
            >
              {eyebrow}
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-normal leading-tight tracking-tight"
              style={{ color: titleColor, fontSize: design.titleFontSize || undefined }}
            >
              {title}
            </h2>
          </div>

          {/* Navigation Arrows (Rounded circles on top-right matching screenshot) */}
          <div className="flex items-center gap-2">
            <button
              ref={prevRef}
              aria-label="Previous testimonials"
              className="w-9 h-9 rounded-full border border-[#E8DDD2] bg-white flex items-center justify-center text-[#211A16] hover:bg-[#FAF7F2] hover:border-[#8C6239] transition-all cursor-pointer shadow-xs disabled:opacity-30"
            >
              <ChevronLeft size={16} strokeWidth={2.2} />
            </button>
            <button
              ref={nextRef}
              aria-label="Next testimonials"
              className="w-9 h-9 rounded-full border border-[#E8DDD2] bg-white flex items-center justify-center text-[#211A16] hover:bg-[#FAF7F2] hover:border-[#8C6239] transition-all cursor-pointer shadow-xs disabled:opacity-30"
            >
              <ChevronRight size={16} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Testimonials Swiper Slider (3 Cards per slide on desktop) */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            speed={600}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="!overflow-visible"
          >
            {displayReviews.map((review, idx) => (
              <SwiperSlide key={review.id || idx}>
                {/* 2-Column Card: Left Avatar, Right Review & Info (Exact matching screenshot layout) */}
                <div
                  style={{
                    backgroundColor: cardBgColor,
                    borderColor: cardBorderColor,
                  }}
                  className="p-5 sm:p-6 rounded-2xl border shadow-xs flex items-start gap-4 text-left transition-all hover:shadow-sm h-full"
                >
                  {/* Left Column: Customer Profile Avatar */}
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#E8DDD2]/80 shadow-xs"
                  />

                  {/* Right Column: Quote, Stars & Customer Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    {/* Review Quote in Quotes */}
                    <p
                      className="text-xs sm:text-[13px] font-sans text-[#211A16] leading-relaxed font-normal"
                      style={{ fontSize: design.quoteFontSize || undefined }}
                    >
                      "{review.quote}"
                    </p>

                    {/* 5 Golden Stars */}
                    <div className="flex items-center gap-0.5 my-2.5" style={{ color: starColor }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < review.rating ? 'currentColor' : 'none'}
                          stroke="currentColor"
                        />
                      ))}
                    </div>

                    {/* Reviewer Row */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <img
                        src={review.avatar}
                        alt=""
                        className="w-4 h-4 rounded-full object-cover shrink-0 border border-[#E8DDD2]/60"
                      />
                      <span className="text-xs font-semibold text-[#211A16]">
                        {review.name}
                      </span>
                    </div>
                    <span className="text-[10.5px] font-sans text-[#786A5E] leading-none mt-0.5">
                      {review.title || 'Verified Buyer'}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
};

export default TestimonialSection;