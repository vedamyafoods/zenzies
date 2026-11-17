import React, { useState } from "react";
import { ShoppingBag, RefreshCw, Check, ArrowRight, Loader2 } from "lucide-react";
import { useStore } from "../../hooks/useStore";

/**
 * Screen 3 Action Buttons:
 * 1. "Add to Cart" (Adds original product currently being viewed to cart)
 * 2. "Try Another Photo" (Allows customer to upload another photo seamlessly)
 */
const PreviewActions = ({ product, onTryAnotherPhoto }) => {
  const { addToCart, isInCart } = useStore();
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;
    setLoading(true);
    try {
      addToCart(product, 1);
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 2500);
    } catch (e) {
      console.error("Add to cart error:", e);
    } finally {
      setLoading(false);
    }
  };

  const isAlreadyInCart = isInCart(product?.id);

  return (
    <div className="space-y-2.5 pt-2">
      {/* Button 1: Add to Cart */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full h-[52px] px-6 rounded-2xl bg-[#2C221E] hover:bg-[#1A1412] text-white font-body font-semibold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md active:scale-[0.98]"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin text-[#E5A83B]" />
        ) : addedFeedback || isAlreadyInCart ? (
          <Check size={16} className="text-[#E5A83B]" />
        ) : (
          <ShoppingBag size={16} className="text-[#E5A83B]" />
        )}
        <span>
          {addedFeedback
            ? "Added to Bag ✓"
            : isAlreadyInCart
            ? "Added to Bag — Add More"
            : `Add to Cart • ₹${Number(product?.price || 0).toLocaleString()}`}
        </span>
      </button>

      {/* Button 2: Try Another Photo */}
      <button
        type="button"
        onClick={onTryAnotherPhoto}
        className="w-full h-[46px] px-5 rounded-2xl border border-[#D8CBBE] hover:bg-[#FAF7F2] text-[#211A16] font-body font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
      >
        <RefreshCw size={14} className="text-[#956638]" />
        <span>Try Another Photo</span>
      </button>
    </div>
  );
};

export default PreviewActions;

