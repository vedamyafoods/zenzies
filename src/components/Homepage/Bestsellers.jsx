import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Loader2, Heart, ChevronLeft, ChevronRight, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { collection, query, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { useStore } from '../../hooks/useStore';
import AddToCartModal from '../AddToCartModal';
import { getOptimizedImageUrl, handleImageError } from '../../config/cloudinary';
import useSectionDesign from '../../hooks/useSectionDesign';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const fallbackBestsellers = [
  {
    id: 'b1',
    name: "Classic Solitaire Ring",
    price: 8999,
    originalPrice: 12999,
    rating: 5,
    reviewsCount: 128,
    image: "/img/zenzies/products/bestseller_ring.png",
    category: "Rings",
    stock: 25
  },
  {
    id: 'b2',
    name: "Heart Pendant Necklace",
    price: 7499,
    originalPrice: 9999,
    rating: 5,
    reviewsCount: 96,
    image: "/img/zenzies/products/bestseller_necklace.png",
    category: "Necklaces",
    stock: 18
  },
  {
    id: 'b3',
    name: "Diamond Hoop Earrings",
    price: 6999,
    originalPrice: 8999,
    rating: 5,
    reviewsCount: 210,
    image: "/img/zenzies/products/bestseller_earrings.png",
    category: "Earrings",
    stock: 30
  },
  {
    id: 'b4',
    name: "Tennis Bracelet",
    price: 9499,
    originalPrice: 12999,
    rating: 5,
    reviewsCount: 178,
    image: "/img/zenzies/products/bestseller_bracelet.png",
    category: "Bracelets",
    stock: 14
  }
];

const isBestsellerProduct = (p) => {
  if (!p) return false;
  if (p.badge && String(p.badge).toLowerCase().includes('bestseller')) return true;
  if (p.isBestseller || p.bestseller) return true;
  if (Array.isArray(p.tags) && p.tags.some(t => {
    const tagStr = String(t).toLowerCase().trim();
    return tagStr === 'bestsellers' || tagStr === 'bestseller';
  })) return true;
  return false;
};

const BestSellers = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoadings, setWishlistLoadings] = useState({});
  const [cartLoadings, setCartLoadings] = useState({});
  const [addModalProduct, setAddModalProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { design, containerStyle, overlayStyle, btnGradient, btnStyle, isEnabled } = useSectionDesign('bestsellers', {
    backgroundColor: '#FBF7F2',
    paddingTop: '44px',
    paddingBottom: '52px',
    eyebrow: 'BESTSELLERS',
    title: 'Our Most Loved Pieces',
    subtitle: 'Timeless favorites, chosen by you.',
    viewAllText: 'View All Products',
    viewAllLink: '/shop',
  });

  useEffect(() => {
    let unsub = () => {};
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      unsub = onSnapshot(
        q,
        (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            const filtered = list.filter(isBestsellerProduct);
            if (filtered.length >= 2) {
              setProducts(filtered);
            } else if (list.length > 0) {
              setProducts(list.slice(0, 8));
            } else {
              setProducts(fallbackBestsellers);
            }
          } else {
            setProducts(fallbackBestsellers);
          }
          setLoading(false);
        },
        (err) => {
          console.warn("Bestsellers realtime snapshot notice, using fallback:", err);
          setProducts(fallbackBestsellers);
          setLoading(false);
        }
      );
    } catch (e) {
      console.warn("Bestsellers query error, using fallback:", e);
      setProducts(fallbackBestsellers);
      setLoading(false);
    }
    return () => unsub();
  }, []);

  const { addToWishlist, isInWishlist, addToCart } = useStore();

  const handleAddToWishlist = async (e, product) => {
    e.stopPropagation();
    setWishlistLoadings(prev => ({ ...prev, [product.id]: true }));
    try {
      await addToWishlist(product);
    } finally {
      setWishlistLoadings(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    setCartLoadings(prev => ({ ...prev, [product.id]: true }));
    try {
      const res = await addToCart(product, 1);
      if (res) {
        setAddModalProduct(product);
        setIsAddModalOpen(true);
      }
    } finally {
      setCartLoadings(prev => ({ ...prev, [product.id]: false }));
    }
  };

  if (!isEnabled) return null;

  const eyebrow = design.eyebrow || 'BESTSELLERS';
  const heading = design.title || 'Our Most Loved Pieces';
  const description = design.subtitle || 'Timeless favorites, chosen by you.';
  const viewAllText = design.viewAllText || 'View All Products';
  const viewAllLink = design.viewAllLink || '/shop';

  return (
    <section
      style={{
        backgroundColor: design.backgroundColor || '#FBF7F2',
        paddingTop: design.paddingTop || '44px',
        paddingBottom: design.paddingBottom || '52px',
        ...containerStyle,
      }}
      className="relative w-full overflow-hidden"
    >
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}

      <div className="w-full max-w-[1640px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-9 gap-3">
          <div className="text-left">
            <span
              className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.2em] uppercase block mb-1.5 sm:mb-2"
              style={{ color: design.accentColor || '#956638', fontSize: design.eyebrowFontSize || undefined }}
            >
              {eyebrow}
            </span>
            <h2
              className="font-serif text-[30px] sm:text-[36px] lg:text-[40px] font-normal leading-[1.08] tracking-tight m-0"
              style={{ color: design.titleColor || '#211A16', fontSize: design.titleFontSize || undefined }}
            >
              {heading}
            </h2>
            <p
              className="text-xs sm:text-[13.5px] font-sans mt-1.5 sm:mt-2"
              style={{ color: design.subtitleColor || design.textColor || '#62564B', fontSize: design.subtitleFontSize || undefined }}
            >
              {description}
            </p>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-end pt-1 sm:pt-0">
            <Link
              to={viewAllLink}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans font-semibold text-[#211A16] hover:text-[#956638] transition-colors group cursor-pointer"
            >
              <span>{viewAllText}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            {/* Slider Navigation Buttons */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                ref={prevRef}
                aria-label="Previous products"
                className="w-8 h-8 rounded-full border border-[#E8DDD2] bg-white flex items-center justify-center text-[#211A16] hover:border-[#956638] hover:text-[#956638] transition-all cursor-pointer shadow-xs disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                ref={nextRef}
                aria-label="Next products"
                className="w-8 h-8 rounded-full border border-[#E8DDD2] bg-white flex items-center justify-center text-[#211A16] hover:border-[#956638] hover:text-[#956638] transition-all cursor-pointer shadow-xs disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Slider Container with Side Navigation Arrows */}
        <div className="relative group/slider">

          {/* Left Arrow Floating on Slider Edge */}
          <button
            ref={prevRef}
            aria-label="Previous products"
            className="sm:hidden absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border border-[#E8DDD2] bg-white/95 shadow-md flex items-center justify-center text-[#211A16] hover:text-[#956638] transition-all cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Right Arrow Floating on Slider Edge */}
          <button
            ref={nextRef}
            aria-label="Next products"
            className="sm:hidden absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border border-[#E8DDD2] bg-white/95 shadow-md flex items-center justify-center text-[#211A16] hover:text-[#956638] transition-all cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={14}
            slidesPerView={2}
            speed={500}
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 14 },
              768: { slidesPerView: 3, spaceBetween: 16 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
              1280: { slidesPerView: 5, spaceBetween: 22 },
            }}
            className="!overflow-visible py-2"
          >
            {products.map((product, index) => {
              const inWishlist = isInWishlist ? isInWishlist(product.id) : false;
              const isSoldOut = product.stock <= 0 || product.badge === 'SOLD OUT';
              const reviewsCount = product.reviewsCount || product.reviews || 128;
              const ratingVal = product.rating || 5;
              const isCartLoading = cartLoadings[product.id];
              const rawImg = product.image || product.images?.[0] || 'img/jewellery/j.png';
              const price = Number(product.price || 0);
              const originalPrice = product.originalPrice ? Number(product.originalPrice) : Math.round(price * 1.3);

              return (
                <SwiperSlide key={product.id || index}>
                  {/*
                    PRODUCT CARD
                    - 3D Elevated lift on hover (uth kar aa raha ho): -translate-y-3 & scale-1015
                    - Ambient luxury shadow & deep hover shadow matching reference image
                    - Zoom on product image: scale-110
                    - Gradient button
                  */}
                  <div
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="group relative flex flex-col h-full rounded-[14px] border border-[#E8DDD2]/85 bg-white overflow-hidden shadow-[0_4px_18px_rgba(33,26,22,0.06),0_1px_3px_rgba(33,26,22,0.04)] hover:shadow-[0_22px_40px_-6px_rgba(33,26,22,0.18),0_12px_20px_-4px_rgba(33,26,22,0.1)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer text-center hover:-translate-y-2.5 sm:hover:-translate-y-3 hover:scale-[1.018] will-change-transform"
                    style={{
                      borderRadius: design.cardBorderRadius || '14px',
                      backgroundColor: design.cardBackgroundColor || '#FFFFFF',
                      borderColor: design.cardBorderColor || '#E8DDD2',
                    }}
                  >
                    {/*
                      Image Container
                      - Visible rounded upper corners: rounded-t-[13px]
                      - Light warm neutral backdrop: #FAF6F0
                      - Contained image with smooth zoom on hover
                    */}
                    <div
                      className="relative aspect-square w-full overflow-hidden bg-[#FAF6F0] p-3.5 sm:p-5 flex items-center justify-center rounded-t-[13px]"
                      style={{
                        borderTopLeftRadius: design.cardBorderRadius || '13px',
                        borderTopRightRadius: design.cardBorderRadius || '13px',
                      }}
                    >
                      <img
                        src={getOptimizedImageUrl(rawImg)}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => handleImageError(e, rawImg)}
                        className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                      />

                      {/* Wishlist Button in Top-Right Corner */}
                      <button
                        type="button"
                        onClick={(e) => handleAddToWishlist(e, product)}
                        disabled={wishlistLoadings[product.id]}
                        aria-label="Add to wishlist"
                        className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 border border-[#E8DDD2] shadow-xs flex items-center justify-center text-[#211A16] hover:text-[#956638] hover:scale-110 active:scale-95 transition-all cursor-pointer z-10"
                      >
                        {wishlistLoadings[product.id] ? (
                          <Loader2 size={12} className="animate-spin text-[#956638]" />
                        ) : (
                          <Heart
                            size={14}
                            fill={inWishlist ? '#956638' : 'none'}
                            stroke={inWishlist ? '#956638' : '#211A16'}
                            strokeWidth={1.5}
                          />
                        )}
                      </button>
                    </div>

                    {/* Product Details - Centered alignment as in reference screenshot */}
                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between items-center text-center space-y-2">
                      <div className="w-full flex flex-col items-center">
                        {/* Title */}
                        <h3 className="text-xs sm:text-[13.5px] font-sans font-medium text-[#211A16] group-hover:text-[#956638] transition-colors truncate w-full text-center">
                          {product.name}
                        </h3>

                        {/* Star Rating & Count */}
                        <div className="flex items-center justify-center gap-1.5 mt-1">
                          <div className="flex items-center text-[#E5A83B]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                fill={i < Math.floor(ratingVal) ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                className="shrink-0"
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-sans text-[#6B5E52]">
                            ({reviewsCount})
                          </span>
                        </div>

                        {/* Price & Strikethrough Original Price */}
                        <div className="flex items-baseline justify-center gap-2 mt-1.5">
                          <span className="text-sm sm:text-base font-sans font-bold text-[#211A16]">
                            ₹{price.toLocaleString()}
                          </span>
                          {originalPrice > price && (
                            <span className="text-xs font-sans text-[#8A7D70] line-through">
                              ₹{originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button with Luxury Gradient */}
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={isSoldOut || isCartLoading}
                        className={`w-full py-2.5 sm:py-3 px-3 rounded-[6px] text-xs font-sans font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer mt-1 active:scale-95 shadow-sm hover:brightness-105 hover:shadow-md ${
                          isSoldOut
                            ? 'bg-[#E8DDD2] text-[#6B5E52] cursor-not-allowed'
                            : 'text-white'
                        }`}
                        style={{
                          background: isSoldOut ? '#E8DDD2' : (design.btnGradient || btnGradient),
                          color: isSoldOut ? '#6B5E52' : (design.btnTextColor || '#FFFFFF'),
                          borderRadius: design.btnBorderRadius || '6px',
                        }}
                      >
                        {isCartLoading ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <span>{isSoldOut ? 'Sold Out' : 'Add to Cart'}</span>
                        )}
                      </button>
                    </div>

                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

      </div>

      {/* Add To Cart Confirmation Modal */}
      {isAddModalOpen && addModalProduct && (
        <AddToCartModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          product={addModalProduct}
        />
      )}
    </section>
  );
};

export default BestSellers;
