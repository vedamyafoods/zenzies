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

const defaultTestimonials = [
  {
    id: 'rev-1',
    name: "Priya S.",
    title: "Verified Buyer",
    quote: "Absolutely stunning quality! The jewellery organizer box is even more practical and beautiful in person.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 'rev-2',
    name: "Megha K.",
    title: "Verified Buyer",
    quote: "Elegant designs and excellent customer service. The multi-compartment travel box keeps all my earrings organized.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 'rev-3',
    name: "Rohan M.",
    title: "Verified Buyer",
    quote: "The perfect gift combo for my wife. The anti-tarnish finish is genuine and packaging was completely gift-ready.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  }
];

const TestimonialSection = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [reviewsList, setReviewsList] = useState(defaultTestimonials);

  const { design, containerStyle, overlayStyle, isEnabled } = useSectionDesign('testimonials', {
    backgroundColor: '#FBF7F2',
    paddingTop: '48px',
    paddingBottom: '64px',
  });

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
              avatar: data.avatar || defaultTestimonials[fetched.length % defaultTestimonials.length].avatar
            });
          }
        });

        if (fetched.length >= 3) {
          setReviewsList(fetched);
        } else if (fetched.length > 0) {
          setReviewsList([...fetched, ...defaultTestimonials.slice(fetched.length)]);
        }
      }
    }, (error) => {
      console.warn("Firestore reviews fetch notice:", error);
    });

    return () => unsubscribe();
  }, []);

  if (!isEnabled) return null;

  return (
    <section style={containerStyle} className="relative w-full border-b border-[#E8DDD2]">
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div className="space-y-1 text-left">
            <span className="text-[11px] font-sans font-semibold tracking-[0.22em] text-[#956638] uppercase">
              WHAT OUR CUSTOMERS SAY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#211A16] font-normal leading-tight">
              Loved by Thousands
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              ref={prevRef}
              aria-label="Previous testimonials"
              className="w-8 h-8 rounded-full border border-[#E8DDD2] bg-white flex items-center justify-center text-[#211A16] hover:border-[#956638] hover:text-[#956638] transition-all cursor-pointer shadow-xs disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              ref={nextRef}
              aria-label="Next testimonials"
              className="w-8 h-8 rounded-full border border-[#E8DDD2] bg-white flex items-center justify-center text-[#211A16] hover:border-[#956638] hover:text-[#956638] transition-all cursor-pointer shadow-xs disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={18}
            slidesPerView={1}
            speed={600}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 18 },
              1024: { slidesPerView: 3, spaceBetween: 22 },
            }}
            className="!overflow-visible"
          >
            {reviewsList.map((review, idx) => (
              <SwiperSlide key={review.id || idx}>
                <div className="p-5 sm:p-6 rounded-xl border border-[#E8DDD2] bg-white shadow-xs flex flex-col justify-between h-full space-y-4 text-left">
                  {/* Quote */}
                  <p className="text-xs sm:text-sm font-sans text-[#211A16] leading-[1.65] italic">
                    "{review.quote}"
                  </p>

                  {/* Stars + Reviewer Profile */}
                  <div className="space-y-3 pt-1">
                    {/* 5 Stars */}
                    <div className="flex items-center text-[#E5A83B] gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          fill={i < review.rating ? 'currentColor' : 'none'}
                          stroke="currentColor"
                        />
                      ))}
                    </div>

                    {/* Customer Row */}
                    <div className="flex items-center gap-3 border-t border-[#E8DDD2]/60 pt-3">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#E8DDD2]"
                      />
                      <div>
                        <h4 className="text-xs sm:text-[13px] font-sans font-semibold text-[#211A16] leading-tight">
                          {review.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] font-sans text-[#6B5E52] mt-0.5">
                          <CheckCircle2 size={11} className="text-[#956638]" />
                          <span>{review.title}</span>
                        </div>
                      </div>
                    </div>
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