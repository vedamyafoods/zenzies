import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../components/Firebase";
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../components/useAuth";
import { useStore } from '../hooks/useStore';
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Shield, ShieldCheck, Truck, RotateCcw, Heart, ShoppingBag,
  Share2, Gem, Sparkles, Loader2, ChevronRight, ChevronLeft,
  Eye, Award, Gift, RefreshCw, ZoomIn, Check,
  ArrowRight, Lock, X, CheckCircle2, ChevronDown, Bell, Package,
  Clock, CheckCircle, Info
} from 'lucide-react';
import AddToCartModal from "../components/AddToCartModal";
import NotifyMeModal from "../components/NotifyMeModal";
import { getOptimizedImageUrl, handleImageError } from "../config/cloudinary";
import useSEO from "../hooks/useSEO";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeAccordion, setActiveAccordion] = useState('specs');
  const [quantity, setQuantity] = useState(1);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ transform: "scale(1)" });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const mainActionRef = useRef(null);
  const { addToCart, addToWishlist, isInCart, isInWishlist } = useStore();

  // Dynamic per-product SEO
  useSEO({
    title: product
      ? `${product.name} - ${product.category || 'Jewellery & Organizer Box'} | Zenzies`
      : 'Jewellery & Organizer Boxes | Zenzies',
    description: product
      ? `${product.description ? product.description.slice(0, 155).replace(/\n/g, ' ') + '...' : `Shop ${product.name} by Zenzies. Handcrafted jewellery organizer boxes and fine jewellery with express delivery across India.`}`
      : 'Shop premium jewellery organizer boxes and fine jewellery from Zenzies.',
    keywords: product
      ? `${product.name}, ${product.category || ''} india, ${(product.tags || []).join(', ')}, zenzies, buy jewellery box india`
      : 'zenzies jewellery boxes',
    canonical: product ? `/product/${product.id}` : '/shop',
    ogType: 'product',
    ogImage: product?.primaryImage || product?.image || product?.images?.[0] || undefined,
    structuredData: product ? {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": (product.description || '').replace(/\n/g, ' '),
      "image": product.images && product.images.length > 0 ? product.images : [product.image || product.primaryImage].filter(Boolean),
      "sku": product.sku || product.id,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "Zenzies"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://www.zenzies.in/product/${product.id}`,
        "priceCurrency": "INR",
        "price": Number(product.price || 0),
        "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        "availability": Number(product.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": { "@type": "Organization", "name": "Zenzies" },
        "itemCondition": "https://schema.org/NewCondition"
      },
      "category": product.category || 'Jewellery',
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": 4.9,
        "reviewCount": 142,
        "bestRating": 5
      }
    } : null
  });

  // Listen to Firestore Product Doc
  useEffect(() => {
    if (!id) return undefined;
    setLoading(true);
    const ref = doc(db, "products", id);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setProduct({ id: snap.id, ...data });
        const actualStock = Number(data.stock || 0);
        if (actualStock > 0) {
          setQuantity((prev) => Math.min(prev, actualStock));
        }
      } else {
        setProduct(null);
      }
      setLoading(false);
    }, (e) => {
      console.error("Error listening to product:", e);
      setProduct(null);
      setLoading(false);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => unsubscribe();
  }, [id]);

  // Fetch Related Products (same category)
  useEffect(() => {
    const fetchRelated = async () => {
      setRelatedLoading(true);
      try {
        const snap = await getDocs(collection(db, "products"));
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.id !== id);

        const currentCategory = product?.category;
        const byCat = currentCategory
          ? all.filter(p => p.category && p.category.toLowerCase() === currentCategory.toLowerCase())
          : [];
        setRelatedProducts(byCat.slice(0, 5));
      } catch (err) {
        console.error("Error loading related products:", err);
      } finally {
        setRelatedLoading(false);
      }
    };
    if (product) fetchRelated();
  }, [id, product]);

  // Handle sticky bottom bar visibility (only when past main buy buttons and not over footer)
  useEffect(() => {
    const handleScroll = () => {
      if (!mainActionRef.current) return;
      const rect = mainActionRef.current.getBoundingClientRect();
      const footer = document.querySelector('footer');
      const footerRect = footer ? footer.getBoundingClientRect() : null;

      // Show sticky bar when user scrolls past main action buttons
      const isPastMainAction = rect.bottom < 0;

      // Hide if footer is in view to avoid collision
      const isNearFooter = footerRect ? footerRect.top < window.innerHeight : false;

      setShowStickyBar(isPastMainAction && !isNearFooter);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const imageUrls = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) return product.images;
    return [product.image || product.primaryImage || '/img/jewellery/j.png'].filter(Boolean);
  }, [product]);

  const activeImage = imageUrls[selectedImageIndex] || imageUrls[0] || "";

  const discountPercent = product?.original_price > product?.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)"
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)"
    });
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setCartLoading(true);
    try {
      await addToCart(product, quantity);
      setIsAddToCartModalOpen(true);
    } finally {
      setCartLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    setWishlistLoading(true);
    try {
      await addToWishlist(product);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!product || (product.stock !== undefined && Number(product.stock) <= 0)) return;
    const buyNowItem = {
      id: product.id,
      name: product.name,
      price: Number(product.price || 0),
      original_price: Number(product.original_price || 0),
      image: activeImage,
      quantity: quantity,
      category: product.category || 'Jewellery',
      stock: product.stock
    };
    navigate('/checkout', { state: { buyNowItem } });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const checkDeliveryPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus({
        success: true,
        msg: "Free Insured Delivery Available! Expected delivery in 3–5 business days via Insured Express Courier."
      });
    } else {
      setPincodeStatus({
        success: false,
        msg: "Please enter a valid 6-digit Indian Postal Pincode."
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-5">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 border-2 border-[#956638]/20 border-t-[#956638] rounded-full animate-spin" />
          <Gem size={20} className="absolute text-[#956638] animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs uppercase tracking-[0.28em] text-[#211A16] font-semibold font-body">
            Zenzies
          </p>
          <p className="text-xs text-[#6B5E52] font-serif italic">Loading creation...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-6 text-center p-6 pt-32">
        <div className="w-16 h-16 rounded-full bg-[#F3ECE3] flex items-center justify-center border border-[#E8DDD2]">
          <Gem size={32} className="text-[#956638]" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#211A16] font-normal">Piece Unavailable or Archived</h2>
          <p className="text-sm text-[#6B5E52] font-body leading-relaxed">
            The creation you are looking for is currently unavailable or has been archived from our catalogue.
          </p>
        </div>
        <button
          onClick={() => navigate('/shop')}
          className="btn-luxury-primary"
        >
          Explore All Jewellery & Boxes
        </button>
      </div>
    );
  }

  const isOutOfStock = product.inStock === false || product.isOutOfStock === true || (product.stock !== undefined && Number(product.stock) <= 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-body text-[#211A16]">

      {/* ── Refined Light Luxury Breadcrumb Strip (High-Visibility, Immediate Fold Access) ── */}
      <div className="w-full bg-[#FAF7F2] border-b border-[#E8DDD2] pt-24 sm:pt-28 pb-4">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-[#6B5E52] flex-wrap">
            <Link to="/" className="hover:text-[#956638] transition-colors font-medium">Home</Link>
            <ChevronRight size={13} className="text-[#9E9082]" />
            <Link to="/shop" className="hover:text-[#956638] transition-colors font-medium">Shop</Link>
            {product.category && (
              <>
                <ChevronRight size={13} className="text-[#9E9082]" />
                <Link
                  to={`/shop?category=${encodeURIComponent(product.category)}`}
                  className="hover:text-[#956638] transition-colors font-medium"
                >
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight size={13} className="text-[#9E9082]" />
            <span className="text-[#211A16] font-semibold truncate max-w-[220px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ── Main Showcase Stage: Balanced 12-Column Grid ── */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 pb-28 lg:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ════ LEFT COLUMN: Gallery Showcase Suite (7 Cols) ════ */}
          <div className="lg:col-span-7 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* Gallery Canvas + Thumbnails */}
              <div className="flex flex-col-reverse md:flex-row gap-4 items-start">

                {/* Vertical / Horizontal Thumbnail Strip */}
                {imageUrls.length > 1 && (
                  <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[560px] no-scrollbar py-1 shrink-0 w-full md:w-auto">
                    {imageUrls.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImageIndex(i)}
                        className={`w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 relative shrink-0 cursor-pointer ${
                          selectedImageIndex === i
                            ? 'border-[#956638] ring-2 ring-[#956638]/20 shadow-md scale-102'
                            : 'border-[#E8DDD2] opacity-70 hover:opacity-100 hover:border-[#956638]/50'
                        }`}
                        aria-label={`View image ${i + 1}`}
                      >
                        <img
                          src={getOptimizedImageUrl(img)}
                          alt={`${product.name} view ${i + 1}`}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => handleImageError(e, img)}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Image Showcase Stage */}
                <div className="flex-1 w-full relative">
                  <div
                    className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#FFFFFF] border border-[#E8DDD2] relative group cursor-crosshair shadow-[0_4px_24px_rgba(33,26,22,0.06)]"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <img
                      src={getOptimizedImageUrl(activeImage)}
                      alt={product.name}
                      style={zoomStyle}
                      onError={(e) => handleImageError(e, activeImage)}
                      className="w-full h-full object-cover transition-transform duration-150 ease-out select-none"
                    />

                    {/* Floating Luxury Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
                      {isOutOfStock ? (
                        <span className="badge-luxury-dark bg-[#211A16] text-white">
                          SOLD OUT
                        </span>
                      ) : (
                        <>
                          {discountPercent > 0 && (
                            <span className="badge-luxury bg-[#FAF2E8] text-[#956638] border-[#956638]/40 shadow-xs">
                              <Sparkles size={12} className="text-[#956638]" /> {discountPercent}% OFF
                            </span>
                          )}
                          {product.stock <= 5 && product.stock > 0 && (
                            <span className="badge-luxury bg-amber-50 text-amber-800 border-amber-300 shadow-xs">
                              <Clock size={12} /> Only {product.stock} Left in Stock
                            </span>
                          )}
                          <span className="badge-luxury bg-white/95 text-[#211A16] border-[#E8DDD2] shadow-xs backdrop-blur-md">
                            <Gem size={12} className="text-[#956638]" /> Anti-Tarnish Assurance
                          </span>
                        </>
                      )}
                    </div>

                    {/* Prev / Next Image Navigation (Desktop & Mobile) */}
                    {imageUrls.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); prevImage(); }}
                          aria-label="Previous image"
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-[#211A16] border border-[#E8DDD2] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 hover:bg-white z-10"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); nextImage(); }}
                          aria-label="Next image"
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-[#211A16] border border-[#E8DDD2] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 hover:bg-white z-10"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}

                    {/* Lightbox / Zoom Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}
                      aria-label="Enlarge image"
                      className="absolute bottom-4 right-4 bg-white/90 text-[#211A16] p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-md hover:scale-110 border border-[#E8DDD2] z-10"
                      title="Enlarge Image"
                    >
                      <ZoomIn size={16} />
                    </button>

                    {/* Magnify Hint */}
                    <div className="absolute bottom-4 left-4 bg-[#211A16]/85 text-white text-xs tracking-wider font-medium px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md pointer-events-none flex items-center gap-1.5 z-10">
                      <Eye size={12} className="text-[#C9A66B]" /> Roll cursor to zoom
                    </div>
                  </div>
                </div>
              </div>

              {/* Value & Quality Guarantees Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white border border-[#E8DDD2] rounded-xl p-3.5 flex flex-col items-center text-center gap-1.5 shadow-2xs hover:border-[#956638]/40 transition-colors">
                  <Truck size={20} className="text-[#956638]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#211A16]">Free Delivery</span>
                  <span className="text-[12px] text-[#6B5E52]">Pan-India Express</span>
                </div>

                <div className="bg-white border border-[#E8DDD2] rounded-xl p-3.5 flex flex-col items-center text-center gap-1.5 shadow-2xs hover:border-[#956638]/40 transition-colors">
                  <Shield size={20} className="text-[#956638]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#211A16]">Anti-Tarnish</span>
                  <span className="text-[12px] text-[#6B5E52]">Sweat & Water Safe</span>
                </div>

                <div className="bg-white border border-[#E8DDD2] rounded-xl p-3.5 flex flex-col items-center text-center gap-1.5 shadow-2xs hover:border-[#956638]/40 transition-colors">
                  <Package size={20} className="text-[#956638]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#211A16]">Gift Ready</span>
                  <span className="text-[12px] text-[#6B5E52]">Luxury Velvet Box</span>
                </div>

                <div className="bg-white border border-[#E8DDD2] rounded-xl p-3.5 flex flex-col items-center text-center gap-1.5 shadow-2xs hover:border-[#956638]/40 transition-colors">
                  <RotateCcw size={20} className="text-[#956638]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#211A16]">7-Day Exchange</span>
                  <span className="text-[12px] text-[#6B5E52]">Hassle-Free Transit</span>
                </div>
              </div>

            </div>
          </div>

          {/* ════ RIGHT COLUMN: Product Information & Purchase Suite (5 Cols) ════ */}
          <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DDD2] shadow-[0_4px_24px_rgba(33,26,22,0.04)]">

            {/* Top Toolbar: Category Badge, Wishlist & Share */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DDD2]">
              <span className="badge-luxury">
                {product.category || product.productType || "Zenzies Collection"}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToWishlist}
                  disabled={wishlistLoading}
                  className={`w-10 h-10 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer ${
                    isInWishlist(product.id)
                      ? 'bg-[#211A16] text-[#FAF7F2] border-[#211A16] shadow-sm scale-105'
                      : 'bg-white text-[#211A16] border-[#E8DDD2] hover:border-[#956638] hover:bg-[#FAF7F2]'
                  }`}
                  aria-label="Save to Wishlist"
                  title="Save to Wishlist"
                >
                  {wishlistLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-white border border-[#E8DDD2] text-[#211A16] hover:border-[#956638] hover:bg-[#FAF7F2] transition-all duration-200 flex items-center justify-center cursor-pointer relative"
                  aria-label="Share product"
                  title="Share Piece"
                >
                  {copiedLink ? <Check size={16} className="text-emerald-700" /> : <Share2 size={16} />}
                  {copiedLink && (
                    <span className="absolute -bottom-8 right-0 bg-[#211A16] text-white text-[11px] font-semibold tracking-wider px-2.5 py-1 rounded shadow-lg whitespace-nowrap z-20">
                      Link Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Product Title & Brand Eyebrow */}
            <div className="space-y-2">
              <span className="eyebrow-text block">
                {product.collectionName || "Artisan Craftsmanship"}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] text-[#211A16] font-normal leading-[1.22] tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Customer Rating & Reviews */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 text-[#C9A66B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" stroke="currentColor" />
                ))}
              </div>
              <span className="text-xs font-semibold text-[#211A16]">4.9 / 5.0</span>
              <span className="text-xs text-[#6B5E52] border-l border-[#E8DDD2] pl-3">
                142 Verified Reviews
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 size={11} /> Verified Quality
              </span>
            </div>

            {/* ── Pricing Hierarchy (Clean, Tight, No Blank Separations) ── */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DDD2] space-y-1.5">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-serif text-3xl sm:text-4xl text-[#211A16] font-normal tracking-tight">
                  ₹{Number(product.price).toLocaleString()}
                </span>
                {product.original_price > product.price && (
                  <span className="text-base sm:text-lg text-[#9E9082] line-through font-normal">
                    ₹{Number(product.original_price).toLocaleString()}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#956638] bg-[#FAF2E8] border border-[#956638]/30 px-2.5 py-1 rounded-full">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[#6B5E52] flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[#956638]" /> Inclusive of all taxes • Free Insured Express Pan-India Delivery
              </p>
            </div>

            {/* In-Stock / Restock Alert */}
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#211A16]">
                {isOutOfStock ? 'Currently Out of Stock' : 'In Stock - Dispatches within 24 Hours'}
              </span>
            </div>

            {/* ── Main Action Block (Quantity + Add to Cart + Buy Now) ── */}
            <div ref={mainActionRef} className="space-y-4 pt-1">
              {isOutOfStock ? (
                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-3">
                  <p className="text-xs text-rose-900 leading-relaxed font-body">
                    This creation is currently sold out. Request restock notification to receive priority email or WhatsApp updates.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsNotifyModalOpen(true)}
                    className="w-full btn-luxury-dark justify-center"
                  >
                    <Bell size={16} className="text-[#C9A66B]" />
                    <span>Notify Me When Restocked</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#211A16]">Quantity:</span>
                    <div className="flex items-center border border-[#E8DDD2] rounded-lg bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        aria-label="Decrease quantity"
                        className="w-10 h-10 flex items-center justify-center text-[#211A16] hover:bg-[#FAF7F2] font-semibold transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-sm font-semibold text-[#211A16]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(prev => Math.min(Number(product.stock || 99), prev + 1))}
                        aria-label="Increase quantity"
                        className="w-10 h-10 flex items-center justify-center text-[#211A16] hover:bg-[#FAF7F2] font-semibold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Primary Dual Actions: Add to Bag + Buy Now */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={cartLoading}
                      className="btn-luxury-secondary flex-1 justify-center min-h-[48px]"
                    >
                      {cartLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <ShoppingBag size={16} className="text-[#956638]" />
                      )}
                      <span>{isInCart(product.id) ? 'Added to Bag' : 'Add to Bag'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="btn-luxury-primary flex-1 justify-center min-h-[48px]"
                    >
                      <span>Buy Now</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Express Delivery Estimator ── */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DDD2] space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#211A16] flex items-center gap-2">
                <Truck size={15} className="text-[#956638]" /> Estimate Delivery Date
              </label>
              <form onSubmit={checkDeliveryPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="input-luxury flex-1 text-xs"
                />
                <button
                  type="submit"
                  className="btn-luxury-dark text-xs px-5 min-h-[46px]"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className={`text-xs ${pincodeStatus.success ? 'text-emerald-700 font-medium' : 'text-rose-600'}`}>
                  {pincodeStatus.msg}
                </p>
              )}
            </div>

            {/* ── Description & Artisan Story ── */}
            {(product.product_details || product.description) && (
              <div className="pt-2 border-t border-[#E8DDD2] space-y-2">
                <h3 className="font-serif text-lg text-[#211A16] font-normal">
                  Overview & Craftsmanship
                </h3>
                <p className="body-text text-sm sm:text-base leading-relaxed text-[#6B5E52] whitespace-pre-line">
                  {product.product_details || product.description}
                </p>
              </div>
            )}

            {/* ── Structured Accordions Suite ── */}
            <div className="border-t border-[#E8DDD2] pt-2 space-y-1">
              {[
                {
                  id: 'specs',
                  title: 'Specifications & Dimensions',
                  content: (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs sm:text-sm py-2">
                      <div className="border-b border-[#F2EBE1] pb-2">
                        <span className="text-[#9E9082] uppercase tracking-wider text-[11px] block font-medium">SKU / Code</span>
                        <span className="font-semibold text-[#211A16] mt-0.5 block">{product.sku || product.id.slice(0, 8)}</span>
                      </div>
                      {product.category && (
                        <div className="border-b border-[#F2EBE1] pb-2">
                          <span className="text-[#9E9082] uppercase tracking-wider text-[11px] block font-medium">Category</span>
                          <span className="font-semibold text-[#211A16] mt-0.5 block">{product.category}</span>
                        </div>
                      )}
                      {product.material && (
                        <div className="border-b border-[#F2EBE1] pb-2">
                          <span className="text-[#9E9082] uppercase tracking-wider text-[11px] block font-medium">Material</span>
                          <span className="font-semibold text-[#211A16] mt-0.5 block">{product.material}</span>
                        </div>
                      )}
                      <div className="border-b border-[#F2EBE1] pb-2">
                        <span className="text-[#9E9082] uppercase tracking-wider text-[11px] block font-medium">Plating / Finish</span>
                        <span className="font-semibold text-[#211A16] mt-0.5 block">18K PVD Anti-Tarnish Lustre</span>
                      </div>
                      {(product.size || product.size_weight) && (
                        <div className="border-b border-[#F2EBE1] pb-2">
                          <span className="text-[#9E9082] uppercase tracking-wider text-[11px] block font-medium">Dimensions / Fit</span>
                          <span className="font-semibold text-[#211A16] mt-0.5 block">{product.size || product.size_weight}</span>
                        </div>
                      )}
                      <div className="border-b border-[#F2EBE1] pb-2">
                        <span className="text-[#9E9082] uppercase tracking-wider text-[11px] block font-medium">Packaging</span>
                        <span className="font-semibold text-[#211A16] mt-0.5 block">Zenzies Signature Velvet Box</span>
                      </div>
                    </div>
                  )
                },
                {
                  id: 'care',
                  title: 'Jewellery Care & Preservation',
                  content: (
                    <div className="text-xs sm:text-sm text-[#6B5E52] space-y-2 py-2">
                      <p>Our jewellery is designed with high-durability anti-tarnish coating. To keep its radiant shine for years:</p>
                      <ul className="space-y-1.5 pl-4 list-disc">
                        <li>Store in a dry, velvet-lined Zenzies organizer box or pouch when not in use.</li>
                        <li>Apply perfumes, body lotions, and hairspray before putting on your jewellery.</li>
                        <li>Wipe gently with a soft microfiber cloth after wear to remove skin oils.</li>
                        <li>Avoid prolonged contact with chlorine or harsh household cleaning chemicals.</li>
                      </ul>
                    </div>
                  )
                },
                {
                  id: 'shipping',
                  title: 'Shipping & Insured Delivery',
                  content: (
                    <div className="text-xs sm:text-sm text-[#6B5E52] space-y-2 py-2">
                      <p>
                        Every order is dispatched in tamper-evident security packaging within 24–48 hours from our fulfillment hub.
                      </p>
                      <ul className="space-y-1.5 pl-4 list-disc">
                        <li>Metro cities: Delivery within 2–4 business days.</li>
                        <li>Rest of India: Delivery within 4–6 business days.</li>
                        <li>Real-time live tracking sent via SMS and Email once dispatched.</li>
                      </ul>
                    </div>
                  )
                },
                {
                  id: 'returns',
                  title: '7-Day Easy Exchange Policy',
                  content: (
                    <div className="text-xs sm:text-sm text-[#6B5E52] space-y-2 py-2">
                      <p>
                        We want you to love your Zenzies piece. We offer a hassle-free 7-day exchange window for unblemished items in original packaging with tags intact. Contact our concierge team via WhatsApp or Email to initiate.
                      </p>
                    </div>
                  )
                }
              ].map((accordion) => (
                <div key={accordion.id} className="border-b border-[#E8DDD2]">
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === accordion.id ? '' : accordion.id)}
                    className="w-full py-4 flex items-center justify-between text-left cursor-pointer group"
                    aria-expanded={activeAccordion === accordion.id}
                  >
                    <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#211A16] group-hover:text-[#956638] transition-colors">
                      {accordion.title}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-[#211A16] transition-transform duration-200 ${
                        activeAccordion === accordion.id ? 'rotate-180 text-[#956638]' : ''
                      }`}
                    />
                  </button>
                  {activeAccordion === accordion.id && (
                    <div className="pb-4 pt-1">
                      {accordion.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ════ RELATED PIECES / RECOMMENDATIONS ════ */}
        {(relatedLoading || relatedProducts.length > 0) && (
          <div className="mt-16 sm:mt-24 pt-10 border-t border-[#E8DDD2]">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="eyebrow-text block">Complementary Creations</span>
                <h2 className="section-title text-2xl sm:text-3xl text-[#211A16] mt-1">
                  You May Also Admire
                </h2>
              </div>
              {product.category && (
                <Link
                  to={`/shop?category=${encodeURIComponent(product.category)}`}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#956638] hover:text-[#211A16] transition-colors"
                >
                  View All in {product.category} <ArrowRight size={14} />
                </Link>
              )}
            </div>

            {/* Related Cards Grid */}
            {relatedLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="card-luxury p-3 space-y-3 animate-pulse">
                    <div className="aspect-square bg-[#F3ECE3] rounded-lg" />
                    <div className="h-3 bg-[#F3ECE3] rounded w-3/4" />
                    <div className="h-3 bg-[#F3ECE3] rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                {relatedProducts.map((rel) => {
                  const relDiscount = rel.original_price > rel.price
                    ? Math.round(((rel.original_price - rel.price) / rel.original_price) * 100)
                    : 0;
                  return (
                    <div
                      key={rel.id}
                      onClick={() => navigate(`/product/${rel.id}`)}
                      className="group card-luxury overflow-hidden cursor-pointer flex flex-col hover:-translate-y-1.5 transition-all duration-300"
                    >
                      <div className="aspect-square bg-[#FAF7F2] overflow-hidden relative">
                        <img
                          src={getOptimizedImageUrl(rel.image || rel.images?.[0] || '/img/jewellery/j.png')}
                          alt={rel.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        />
                        {relDiscount > 0 && (
                          <span className="absolute top-2 left-2 badge-luxury bg-[#211A16] text-white text-[10px] px-2 py-0.5">
                            -{relDiscount}%
                          </span>
                        )}
                      </div>
                      <div className="p-3.5 flex flex-col justify-between flex-1 space-y-1">
                        <div>
                          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#956638] block truncate">
                            {rel.category || 'Zenzies'}
                          </span>
                          <h4 className="font-serif text-sm font-normal text-[#211A16] group-hover:text-[#956638] transition-colors line-clamp-1 mt-0.5">
                            {rel.name}
                          </h4>
                        </div>
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="text-sm font-semibold text-[#211A16]">
                            ₹{Number(rel.price).toLocaleString()}
                          </span>
                          {rel.original_price > rel.price && (
                            <span className="text-xs text-[#9E9082] line-through">
                              ₹{Number(rel.original_price).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Refined Floating Sticky Bottom Bar (Zero Collision with Footer, Triggered On Scroll) ── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-[100] w-[95%] sm:w-auto max-w-2xl bg-white/95 backdrop-blur-xl border border-[#E8DDD2] rounded-2xl shadow-[0_12px_36px_rgba(33,26,22,0.14)] p-3 px-4 sm:px-6"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Product Info Preview (Desktop/Tablet) */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#E8DDD2] shrink-0">
                  <img
                    src={getOptimizedImageUrl(activeImage)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-xs sm:text-sm text-[#211A16] font-medium truncate max-w-[160px] sm:max-w-[220px]">
                    {product.name}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-base sm:text-lg text-[#211A16] font-medium leading-none">
                      ₹{Number(product.price).toLocaleString()}
                    </span>
                    {product.original_price > product.price && (
                      <span className="hidden sm:inline text-xs text-[#9E9082] line-through">
                        ₹{Number(product.original_price).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {isOutOfStock ? (
                  <button
                    type="button"
                    onClick={() => setIsNotifyModalOpen(true)}
                    className="btn-luxury-dark text-xs min-h-[42px] px-4 py-2"
                  >
                    <Bell size={14} className="text-[#C9A66B]" />
                    <span>Notify Me</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={cartLoading}
                      className="btn-luxury-secondary text-xs min-h-[42px] px-4 py-2 hidden sm:inline-flex"
                    >
                      <ShoppingBag size={14} className="text-[#956638]" />
                      <span>{isInCart(product.id) ? 'Added' : 'Add to Bag'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="btn-luxury-primary text-xs min-h-[42px] px-5 py-2"
                    >
                      <span>Buy Now</span>
                      <ArrowRight size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals Suite ── */}
      <NotifyMeModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        product={product}
      />

      <AddToCartModal
        isOpen={isAddToCartModalOpen}
        onClose={() => setIsAddToCartModalOpen(false)}
        product={product}
      />

      {/* Lightbox Fullscreen Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="absolute inset-0 bg-[#211A16]/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2 border border-[#E8DDD2]"
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-[#211A16] flex items-center justify-center shadow-md cursor-pointer border border-[#E8DDD2]"
                aria-label="Close fullscreen"
              >
                <X size={18} />
              </button>
              <img
                src={activeImage}
                alt={product.name}
                className="w-full max-h-[85vh] object-contain rounded-xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProductDetail;
