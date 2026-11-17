import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Loader2, Sparkles } from 'lucide-react';
import { useStore } from '../hooks/useStore';
import { getOptimizedImageUrl, handleImageError } from '../config/cloudinary';

const ProductCard = ({ product, onAddToCartSuccess, className = '' }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, isInCart, isInWishlist } = useStore();
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  if (!product) return null;

  const isSoldOut = product.stock !== undefined && Number(product.stock) <= 0;
  const inWishlist = isInWishlist ? isInWishlist(product.id) : false;
  const inCart = isInCart ? isInCart(product.id) : false;

  const discountPercent = product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const rawImg = product.image || product.images?.[0] || product.primaryImage || '/img/jewellery/j.png';

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    setWishlistLoading(true);
    try {
      await addToWishlist(product);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCartClick = async (e) => {
    e.stopPropagation();
    if (isSoldOut) return;
    setCartLoading(true);
    try {
      await addToCart(product, 1);
      if (onAddToCartSuccess) onAddToCartSuccess(product);
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group card-luxury flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300 relative ${className}`}
    >
      {/* ── Image Canvas ── */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF7F2] border-b border-[#E8DDD2]">
        <img
          src={getOptimizedImageUrl(rawImg)}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={(e) => handleImageError(e, rawImg)}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent > 0 && !isSoldOut && (
            <span className="badge-luxury bg-[#FAF2E8] text-[#956638] text-[11px] py-0.5 px-2.5 font-semibold shadow-xs">
              <Sparkles size={11} className="text-[#956638]" /> {discountPercent}% OFF
            </span>
          )}
          {isSoldOut && (
            <span className="badge-luxury-dark bg-[#211A16] text-white text-[11px] py-0.5 px-2.5">
              SOLD OUT
            </span>
          )}
          {product.badge && (
            <span className="badge-luxury bg-white/95 text-[#211A16] text-[11px] py-0.5 px-2 shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={handleWishlistClick}
            disabled={wishlistLoading}
            aria-label="Add to wishlist"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 border cursor-pointer ${
              inWishlist
                ? 'bg-[#211A16] text-white border-[#211A16] shadow-sm'
                : 'bg-white/90 text-[#211A16] border-[#E8DDD2] hover:bg-white hover:border-[#956638] shadow-xs md:opacity-0 md:group-hover:opacity-100'
            }`}
          >
            {wishlistLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Heart
                size={15}
                fill={inWishlist ? "currentColor" : "none"}
                strokeWidth={inWishlist ? 0 : 1.8}
              />
            )}
          </button>
        </div>

        {/* Desktop Quick Add-To-Bag Slide-up Button */}
        {!isSoldOut && (
          <div className="hidden md:block absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <button
              type="button"
              onClick={handleAddToCartClick}
              disabled={cartLoading}
              className="btn-luxury-primary w-full py-2.5 text-xs min-h-[40px] shadow-md"
            >
              {cartLoading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <ShoppingBag size={13} />
              )}
              <span>{inCart ? 'IN YOUR BAG' : 'ADD TO BAG'}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Metadata, Title & Pricing ── */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-2 text-center sm:text-left">
        <div>
          <span className="eyebrow-text block text-[11px] truncate mb-1">
            {product.category || product.productType || "Zenzies Exclusive"}
          </span>
          <h3 className="font-serif text-base sm:text-lg text-[#211A16] font-normal leading-snug line-clamp-2 group-hover:text-[#956638] transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="pt-2 border-t border-[#F2EBE1] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg sm:text-xl font-medium text-[#211A16]">
              ₹{Number(product.price || 0).toLocaleString()}
            </span>
            {product.original_price && Number(product.original_price) > Number(product.price) && (
              <span className="text-xs text-[#9E9082] line-through">
                ₹{Number(product.original_price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Icon Button */}
          {!isSoldOut && (
            <button
              type="button"
              onClick={handleAddToCartClick}
              disabled={cartLoading}
              className="md:hidden w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#E8DDD2] text-[#211A16] flex items-center justify-center hover:bg-[#956638] hover:text-white transition-colors"
              aria-label="Add to bag"
            >
              {cartLoading ? <Loader2 size={12} className="animate-spin" /> : <ShoppingBag size={13} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

