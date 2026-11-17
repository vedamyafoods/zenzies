import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../components/Firebase";
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../components/useAuth";
import { useStore } from '../hooks/useStore';
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Star, Maximize2, Feather, Sparkles, ShieldCheck,
  ShoppingBag, Heart, ArrowRight, Truck, RotateCcw, Package,
  Check, X, ChevronRight, ChevronLeft, ChevronDown, Loader2,
  Bell, Camera, Upload, Eye, CheckCircle2, RefreshCw, Sparkle,
  SparkleIcon
} from 'lucide-react';
import AddToCartModal from "../components/AddToCartModal";
import NotifyMeModal from "../components/NotifyMeModal";
import VirtualTryOnModal from "../components/VirtualTryOn/VirtualTryOnModal";
import VirtualTryOnButton from "../components/VirtualTryOn/VirtualTryOnButton";
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
  const [isAITryOnOpen, setIsAITryOnOpen] = useState(false);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const mainActionRef = useRef(null);
  const { addToCart, addToWishlist, isInCart, isInWishlist } = useStore();

  // Dynamic per-product SEO
  useSEO({
    title: product
      ? `${product.name} - ${product.category || 'Fine Jewellery'} | Zenzies`
      : 'Fine Jewellery & Organizer Boxes | Zenzies',
    description: product
      ? `${product.description ? product.description.slice(0, 155).replace(/\n/g, ' ') + '...' : `Shop ${product.name} by Zenzies. Anti-tarnish handcrafted jewellery and organizer boxes with express pan-India delivery.`}`
      : 'Shop premium jewellery and organizer boxes from Zenzies.',
    keywords: product
      ? `${product.name}, ${product.category || ''} india, ${(product.tags || []).join(', ')}, zenzies jewellery`
      : 'zenzies jewellery',
    canonical: product ? `/product/${product.id}` : '/shop',
    ogType: 'product',
    ogImage: product?.primaryImage || product?.image || product?.images?.[0] || undefined,
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

  // Scroll listener for sticky cart bar (avoids footer collision)
  useEffect(() => {
    const handleScroll = () => {
      if (!mainActionRef.current) return;
      const rect = mainActionRef.current.getBoundingClientRect();
      const footer = document.querySelector('footer');
      const footerRect = footer ? footer.getBoundingClientRect() : null;

      const isPastMainAction = rect.bottom < 0;
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
      transform: "scale(2.1)"
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)"
    });
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

  const checkDeliveryPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeStatus({
        success: true,
        msg: "Free Express Insured Delivery Available! Expected arrival within 3–4 business days."
      });
    } else {
      setPincodeStatus({
        success: false,
        msg: "Please enter a valid 6-digit Indian postal pincode."
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-2 border-[#956638]/20 border-t-[#956638] rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-[0.25em] text-[#211A16] font-body font-semibold">
          Loading creation...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-6 text-center p-6 pt-32">
        <div className="w-16 h-16 rounded-full bg-[#FAF2E8] flex items-center justify-center text-[#956638]">
          <ShoppingBag size={28} />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="font-serif text-3xl text-[#211A16] font-normal">Piece Not Found</h2>
          <p className="text-sm text-[#6B5E52] font-body leading-relaxed">
            The creation you are looking for is currently unavailable or has been archived from our catalogue.
          </p>
        </div>
        <button onClick={() => navigate('/shop')} className="btn-luxury-primary">
          Explore Boutique Catalogue
        </button>
      </div>
    );
  }

  const isOutOfStock = product.inStock === false || product.isOutOfStock === true || (product.stock !== undefined && Number(product.stock) <= 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-body text-[#211A16]">

      {/* ── Main Canvas Container ── */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 sm:pt-28 pb-20">

        {/* ── Top Breadcrumb Pattern: ⌂ | Jewellery / Category ── */}
        <div className="flex items-center gap-2.5 text-xs text-[#7B6D63] font-body mb-6">
          <Link to="/" className="hover:text-[#956638] transition-colors flex items-center gap-1" aria-label="Home">
            <Home size={15} className="text-[#956638]" />
          </Link>
          <span className="text-[#D8CBBE]">|</span>
          <Link to="/shop" className="hover:text-[#956638] transition-colors">
            {product.category || 'Jewellery'}
          </Link>
          <span className="text-[#D8CBBE]">/</span>
          <span className="text-[#211A16] font-medium truncate max-w-[220px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        {/* ── Exact Reference 3-Part Layout: 
            [Left: Thumbnails]  [Center: Main Showcase Frame]  [Right: Content & CTAs] 
        ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ════ Part 1 & 2 (Gallery): Left Vertical Thumbnails + Center Main Showcase Frame ════ */}
          <div className="lg:col-span-7 flex flex-col-reverse lg:flex-row gap-4 sm:gap-5 items-start">
            
            {/* Uploaded Images Thumbnails Column (Vertical on Desktop, Horizontal on Mobile) */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar w-full lg:w-20 shrink-0 max-h-[580px] py-1">
              {imageUrls.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white cursor-pointer relative shrink-0 ${
                    selectedImageIndex === i
                      ? 'border-[#B8926A] shadow-md ring-2 ring-[#B8926A]/20 scale-102'
                      : 'border-[#E8DDD2] opacity-75 hover:opacity-100 hover:border-[#B8926A]/50'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img
                    src={getOptimizedImageUrl(img)}
                    alt={`Thumbnail ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => handleImageError(e, img)}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </button>
              ))}
            </div>

            {/* Main Featured Image Frame */}
            <div className="relative aspect-square w-full rounded-[26px] sm:rounded-[30px] overflow-hidden bg-[#FAF6F0] border border-[#E8DDD2]/90 group shadow-[0_6px_30px_rgba(33,26,22,0.05)] flex-1">
              <img
                src={getOptimizedImageUrl(activeImage)}
                alt={product.name}
                style={zoomStyle}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onError={(e) => handleImageError(e, activeImage)}
                className="w-full h-full object-cover transition-transform duration-100 ease-out cursor-crosshair select-none"
              />

              {/* Lightbox / Maximize Corner Button (Matches reference screenshot ⛶) */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 w-11 h-11 rounded-2xl bg-white/95 hover:bg-white text-[#211A16] flex items-center justify-center shadow-md backdrop-blur-md transition-all hover:scale-108 border border-[#E8DDD2] cursor-pointer z-10"
                title="View Fullscreen Lightbox"
                aria-label="Enlarge product image"
              >
                <Maximize2 size={18} className="text-[#211A16]" />
              </button>

              {/* In-Stock / Sold-out Micro Badge */}
              <div className="absolute top-4 left-4 pointer-events-none z-10">
                {isOutOfStock ? (
                  <span className="badge-luxury-dark bg-[#211A16] text-white text-[11px] py-1 px-3">
                    SOLD OUT
                  </span>
                ) : discountPercent > 0 ? (
                  <span className="badge-luxury bg-[#FAF2E8] text-[#956638] border-[#956638]/40 shadow-xs text-[11px] py-1 px-3">
                    <Sparkles size={12} className="text-[#956638]" /> {discountPercent}% Privilege Savings
                  </span>
                ) : null}
              </div>
            </div>

          </div>

          {/* ════ Part 3 (Right): Content, Benefits & Action Pattern ════ */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-4.5 text-left lg:pl-2">

            {/* 1. Title (Large, didot/serif, elegant) */}
            <h1 className="font-serif text-3xl sm:text-4xl text-[#211A16] font-normal tracking-tight leading-[1.18]">
              {product.name}
            </h1>

            {/* 2. Rating Row: ★★★★★ 4.8 (327 reviews) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-[#E5A83B] gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" stroke="none" />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#211A16] font-body">4.8</span>
              <span className="text-sm text-[#7B6D63] font-body">(327 reviews)</span>
            </div>

            {/* 3. Price: ₹799 + Crossed out price if discounted */}
            <div className="flex items-baseline gap-3 pt-0.5">
              <span className="font-serif text-3xl sm:text-[38px] text-[#211A16] font-normal tracking-tight">
                ₹{Number(product.price).toLocaleString()}
              </span>
              {product.original_price > product.price && (
                <span className="text-lg text-[#9E9082] line-through font-body">
                  ₹{Number(product.original_price).toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-semibold uppercase tracking-wider text-[#956638] bg-[#FAF2E8] border border-[#956638]/30 px-2.5 py-0.5 rounded-full">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* 4. Short Description */}
            <p className="text-sm sm:text-base text-[#6B5E52] font-body leading-relaxed pt-1">
              {product.description || product.product_details || "A graceful blend of modern elegance and timeless pearls, perfect for everyday and special occasions."}
            </p>

            {/* 5. Three Benefit Badges in a Horizontal Row (Lightweight | Anti-Tarnish | Skin-Friendly) */}
            <div className="grid grid-cols-3 gap-3 py-5 border-y border-[#E8DDD2]/80 my-5">
              <div className="flex flex-col items-center text-center gap-1.5">
                <Feather size={22} strokeWidth={1.5} className="text-[#211A16]" />
                <span className="text-xs sm:text-sm font-body text-[#211A16]">Lightweight</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <Sparkles size={22} strokeWidth={1.5} className="text-[#211A16]" />
                <span className="text-xs sm:text-sm font-body text-[#211A16]">Anti-Tarnish</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5">
                <ShieldCheck size={22} strokeWidth={1.5} className="text-[#211A16]" />
                <span className="text-xs sm:text-sm font-body text-[#211A16]">Skin-Friendly</span>
              </div>
            </div>

            {/* 6. Action Buttons Pattern (Matches exact screenshot structure) */}
            <div ref={mainActionRef} className="space-y-3 pt-1">
              {isOutOfStock ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                  <p className="text-xs text-rose-900 leading-relaxed font-body">
                    This creation is currently sold out. Request restock notification to receive priority updates.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsNotifyModalOpen(true)}
                    className="w-full btn-luxury-dark justify-center min-h-[48px] rounded-2xl"
                  >
                    <Bell size={16} className="text-[#C9A66B]" />
                    <span>Notify Me When Restocked</span>
                  </button>
                </div>
              ) : (
                <>
                  {/* Row 1: Try It On with AI + Add to Cart */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <VirtualTryOnButton
                      product={product}
                      onClick={() => setIsAITryOnOpen(true)}
                    />

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      disabled={cartLoading}
                      className="h-[52px] px-5 rounded-2xl bg-[#2C221E] hover:bg-[#1A1412] text-white font-body font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md active:scale-[0.98]"
                    >
                      {cartLoading ? (
                        <Loader2 size={16} className="animate-spin text-[#E5A83B]" />
                      ) : (
                        <ShoppingBag size={16} className="text-[#E5A83B]" />
                      )}
                      <span>{isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}</span>
                    </button>
                  </div>

                  {/* Row 2: Add to Wishlist (Full Width matching mockup exactly) */}
                  <button
                    type="button"
                    onClick={handleAddToWishlist}
                    disabled={wishlistLoading}
                    className={`w-full h-[48px] px-5 rounded-2xl border font-body font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                      isInWishlist(product.id)
                        ? 'bg-[#211A16] text-white border-[#211A16]'
                        : 'bg-white/90 hover:bg-[#FAF7F2] text-[#211A16] border-[#D8CBBE]'
                    }`}
                  >
                    {wishlistLoading ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} strokeWidth={1.8} className={isInWishlist(product.id) ? "text-rose-400" : "text-[#211A16]"} />
                    )}
                    <span>{isInWishlist(product.id) ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                  </button>

                  {/* Row 3: Express Buy Now */}
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full h-[48px] px-5 rounded-2xl bg-gradient-to-r from-[#956638] to-[#7D532B] hover:brightness-105 text-white font-body font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98]"
                  >
                    <span>Instant Checkout &bull; Buy Now</span>
                    <ArrowRight size={15} />
                  </button>
                </>
              )}
            </div>

            {/* 7. Express Pincode Estimator */}
            <div className="pt-3">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDD2] space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#211A16] flex items-center gap-2">
                  <Truck size={15} className="text-[#956638]" /> Check Delivery Pincode
                </label>
                <form onSubmit={checkDeliveryPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="input-luxury flex-1 text-xs min-h-[42px] rounded-xl"
                  />
                  <button
                    type="submit"
                    className="btn-luxury-dark text-xs px-5 min-h-[42px] rounded-xl"
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
            </div>

          </div>

        </div>

        {/* ── Structured Accordions & Specs Section (Cleanly below the hero block) ── */}
        <div className="mt-14 pt-10 border-t border-[#E8DDD2] max-w-4xl mx-auto space-y-3">
          <div className="text-center mb-6">
            <span className="eyebrow-text block">Atelier Details</span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#211A16] mt-0.5">
              Specifications & Craft Guide
            </h2>
          </div>

          {[
            {
              id: 'specs',
              title: 'Product Specifications & Materials',
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
                      <span className="text-[#9E9082] uppercase tracking-wider text-[11px] block font-medium">Base Material</span>
                      <span className="font-semibold text-[#211A16] mt-0.5 block">{product.material}</span>
                    </div>
                  )}
                  <div className="border-b border-[#F2EBE1] pb-2">
                    <span className="text-[#9E9082] uppercase tracking-wider text-[11px] block font-medium">Plating / Finish</span>
                    <span className="font-semibold text-[#211A16] mt-0.5 block">18K PVD Anti-Tarnish Gold Lustre</span>
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
              title: 'Jewellery Care & Longevity Guide',
              content: (
                <div className="text-xs sm:text-sm text-[#6B5E52] space-y-2 py-2">
                  <p>Our jewellery is fortified with long-lasting anti-tarnish coating. To preserve its golden mirror shine:</p>
                  <ul className="space-y-1.5 pl-4 list-disc">
                    <li>Store in a velvet-lined Zenzies organizer box or airtight pouch when not worn.</li>
                    <li>Apply cosmetics, lotions and perfume prior to wearing jewellery.</li>
                    <li>Gently wipe with a soft microfiber cloth after each wear.</li>
                  </ul>
                </div>
              )
            },
            {
              id: 'shipping',
              title: 'Insured Doorstep Shipping & Returns',
              content: (
                <div className="text-xs sm:text-sm text-[#6B5E52] space-y-2 py-2">
                  <p>
                    Every order is insured and dispatched within 24–48 hours in tamper-evident luxury packaging.
                  </p>
                  <ul className="space-y-1.5 pl-4 list-disc">
                    <li>Metro delivery in 2–4 business days; pan-India within 3–5 days.</li>
                    <li>Live real-time SMS & Email tracking provided upon dispatch.</li>
                    <li>7-Day hassle-free easy exchange concierge service.</li>
                  </ul>
                </div>
              )
            }
          ].map((acc) => (
            <div key={acc.id} className="card-luxury overflow-hidden">
              <button
                onClick={() => setActiveAccordion(activeAccordion === acc.id ? '' : acc.id)}
                className="w-full p-4.5 sm:p-5 flex items-center justify-between text-left cursor-pointer group"
                aria-expanded={activeAccordion === acc.id}
              >
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#211A16] group-hover:text-[#956638] transition-colors">
                  {acc.title}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-[#211A16] transition-transform duration-200 ${
                    activeAccordion === acc.id ? 'rotate-180 text-[#956638]' : ''
                  }`}
                />
              </button>
              {activeAccordion === acc.id && (
                <div className="px-5 pb-5 pt-1 border-t border-[#E8DDD2]/60">
                  {acc.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Related Pieces Recommendation ── */}
        {(relatedLoading || relatedProducts.length > 0) && (
          <div className="mt-16 sm:mt-20 pt-10 border-t border-[#E8DDD2]">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="eyebrow-text block">Complementary Pieces</span>
                <h2 className="section-title text-2xl sm:text-3xl text-[#211A16] mt-1">
                  You May Also Admire
                </h2>
              </div>
              {product.category && (
                <Link
                  to={`/shop?category=${encodeURIComponent(product.category)}`}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#956638] hover:text-[#211A16] transition-colors"
                >
                  View All <ArrowRight size={14} />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
              {relatedProducts.map((rel) => (
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
                    <span className="text-sm font-semibold text-[#211A16] pt-1">
                      ₹{Number(rel.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Virtual AI Try-On Studio Modal ── */}
      <VirtualTryOnModal
        isOpen={isAITryOnOpen}
        onClose={() => setIsAITryOnOpen(false)}
        product={product}
      />

      {/* ── Lightbox Fullscreen Modal ── */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-[270] flex items-center justify-center p-4">
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
              className="relative z-10 max-w-4xl max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl p-2.5 border border-[#E8DDD2]"
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
                className="w-full max-h-[85vh] object-contain rounded-2xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Scroll Sticky Bottom Bar ── */}
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
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8DDD2] shrink-0">
                  <img src={getOptimizedImageUrl(activeImage)} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-xs sm:text-sm text-[#211A16] font-medium truncate max-w-[160px] sm:max-w-[220px]">
                    {product.name}
                  </h4>
                  <span className="font-serif text-base sm:text-lg text-[#211A16] font-medium">
                    ₹{Number(product.price).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={cartLoading}
                  className="h-[42px] px-4 rounded-xl bg-white border border-[#E8DDD2] text-xs font-semibold text-[#211A16] hover:bg-[#FAF7F2] cursor-pointer hidden sm:inline-flex items-center gap-1.5"
                >
                  <ShoppingBag size={14} className="text-[#956638]" />
                  <span>{isInCart(product.id) ? 'In Cart' : 'Add to Cart'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="btn-luxury-primary text-xs min-h-[42px] px-5 py-2 rounded-xl"
                >
                  <span>Buy Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modals ── */}
      <AddToCartModal
        isOpen={isAddToCartModalOpen}
        onClose={() => setIsAddToCartModalOpen(false)}
        product={product}
      />

      <NotifyMeModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        product={product}
      />

    </div>
  );
};

export default ProductDetail;
