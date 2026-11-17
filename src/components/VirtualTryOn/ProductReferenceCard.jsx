import React from "react";
import { getOptimizedImageUrl } from "../../config/cloudinary";

/**
 * Step 1 Card: Your Jewellery
 * Displays currently viewed product details cleanly inside the try-on modal.
 */
const ProductReferenceCard = ({ product }) => {
  if (!product) return null;

  const imageUrl = product.primaryImage || product.image || product.images?.[0] || "";
  const categoryLabel = (product.category || "Jewellery").toLowerCase();

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-[#956638] text-white text-[11px] font-semibold flex items-center justify-center">
          1
        </span>
        <h3 className="font-body text-sm font-semibold text-[#211A16] capitalize">
          Your {categoryLabel}
        </h3>
      </div>

      <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DDD2]">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-[#E8DDD2] shrink-0 p-0.5">
          <img
            src={getOptimizedImageUrl(imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-serif text-sm sm:text-base text-[#211A16] font-medium truncate">
            {product.name}
          </h4>
          <p className="font-body text-xs sm:text-sm font-semibold text-[#956638] mt-0.5">
            ₹{Number(product.price || 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductReferenceCard;

