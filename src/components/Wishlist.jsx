import React, { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { db } from "./Firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  Sparkles,
  ArrowRight,
  Gem,
  Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../hooks/useStore";
import { getOptimizedImageUrl, handleImageError } from "../config/cloudinary";
import NotifyMeModal from "./NotifyMeModal";

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart, cartCount } = useStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all' | 'inStock'
  const [movingItems, setMovingItems] = useState({});
  const [movingAll, setMovingAll] = useState(false);
  const [notifyProduct, setNotifyProduct] = useState(null);

  const isItemOutOfStock = (item) => {
    if (item.inStock === false) return true;
    if (item.isOutOfStock === true) return true;
    if (item.stock !== undefined && item.stock !== null) {
      return Number(item.stock) <= 0;
    }
    return false;
  };

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDocs(collection(db, "users", user.uid, "wishlist"));
        const rawList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Fetch live product stock from Firestore
        const productSnap = await getDocs(collection(db, "products"));
        const productMap = {};
        productSnap.docs.forEach((d) => { productMap[d.id] = d.data(); });

        const updatedList = rawList.map((item) => {
          const live = productMap[item.id];
          if (live) {
            return {
              ...item,
              stock: live.stock !== undefined ? live.stock : item.stock,
              inStock: live.inStock !== undefined ? live.inStock : item.inStock,
              isOutOfStock: live.isOutOfStock !== undefined ? live.isOutOfStock : item.isOutOfStock,
              price: live.price !== undefined ? live.price : item.price,
            };
          }
          return item;
        });

        setItems(updatedList);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const removeItem = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "wishlist", id));
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const moveToCart = async (item) => {
    if (!user) return;
    setMovingItems((prev) => ({ ...prev, [item.id]: true }));
    try {
      const added = await addToCart(item, 1);
      if (added) {
        await removeItem(item.id);
      }
    } finally {
      setMovingItems((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const handleMoveAllToCart = async () => {
    if (!user || items.length === 0) return;
    setMovingAll(true);
    try {
      const availableItems = items.filter(i => !isItemOutOfStock(i));
      for (const item of availableItems) {
        const added = await addToCart(item, 1);
        if (added) {
          await removeItem(item.id);
        }
      }
    } finally {
      setMovingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-[#956638]/20 border-t-[#956638] rounded-full animate-spin" />
          <Gem size={18} className="absolute text-[#956638] animate-pulse" />
        </div>
      </div>
    );
  }

  const inStockItems = items.filter(i => !isItemOutOfStock(i));
  const displayedItems = filter === "inStock" ? inStockItems : items;

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-body text-[#211A16]">

      {/* ── Refined Light Header / Breadcrumb ── */}
      <div className="w-full bg-[#FAF7F2] border-b border-[#E8DDD2] pt-24 sm:pt-28 pb-5">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6B5E52] mb-3">
            <Link to="/" className="hover:text-[#956638] transition-colors">Home</Link>
            <span className="text-[#9E9082]">/</span>
            <Link to="/shop" className="hover:text-[#956638] transition-colors">Shop</Link>
            <span className="text-[#9E9082]">/</span>
            <span className="text-[#211A16] font-semibold">Wishlist</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="eyebrow-text block">Private Gallery</span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#211A16] font-normal tracking-tight mt-0.5">
                My Saved Wishlist
                <span className="ml-3 text-xs font-body font-semibold text-[#956638] bg-[#FAF2E8] border border-[#956638]/30 px-3 py-1 rounded-full uppercase tracking-wider">
                  {items.length} {items.length === 1 ? 'Piece' : 'Pieces'}
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {items.length > 0 && inStockItems.length > 0 && (
                <button
                  onClick={handleMoveAllToCart}
                  disabled={movingAll}
                  className="btn-luxury-primary text-xs py-2 px-4 min-h-[40px]"
                >
                  {movingAll ? <Loader2 size={13} className="animate-spin" /> : <ShoppingBag size={13} />}
                  <span>{movingAll ? "Moving..." : "Move All to Bag"}</span>
                </button>
              )}
              <Link
                to="/cart"
                className="btn-luxury-secondary text-xs py-2 px-4 min-h-[40px]"
              >
                <span>Bag ({cartCount})</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 pb-32 lg:pb-24">

        {/* Filter Pills */}
        {items.length > 0 && (
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                  filter === "all"
                    ? "bg-[#211A16] text-white border-[#211A16]"
                    : "bg-white text-[#6B5E52] border-[#E8DDD2] hover:border-[#956638]"
                }`}
              >
                All Saved ({items.length})
              </button>
              <button
                onClick={() => setFilter("inStock")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                  filter === "inStock"
                    ? "bg-[#211A16] text-white border-[#211A16]"
                    : "bg-white text-[#6B5E52] border-[#E8DDD2] hover:border-[#956638]"
                }`}
              >
                In Stock ({inStockItems.length})
              </button>
            </div>
            <p className="text-xs text-[#6B5E52] hidden sm:block">
              Showing {displayedItems.length} of {items.length} saved pieces
            </p>
          </div>
        )}

        {/* Gallery */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-luxury py-16 sm:py-20 px-6 text-center max-w-lg mx-auto space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-[#FAF2E8] border border-[#956638]/30 flex items-center justify-center mx-auto text-[#956638]">
              <Heart size={28} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#211A16] font-normal">
              Your Wishlist is Empty
            </h2>
            <p className="body-text text-sm sm:text-base text-[#6B5E52] max-w-md mx-auto">
              Save your favorite organizer boxes and handcrafted jewellery pieces to view and acquire them later.
            </p>
            <div className="pt-2">
              <Link to="/shop" className="btn-luxury-primary">
                <span>Explore Boutique Catalogue</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {displayedItems.map((item, idx) => {
                const isOutOfStock = isItemOutOfStock(item);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.03 }}
                    key={item.id}
                    className="card-luxury p-3.5 sm:p-5 flex flex-col justify-between group hover:-translate-y-1.5 transition-all duration-300 relative"
                  >
                    <div>
                      {/* Image Box */}
                      <div className="aspect-square rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8DDD2] relative mb-3">
                        <img
                          src={getOptimizedImageUrl(item.image)}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => handleImageError(e, item.image)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Top-Right Trash Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 border border-[#E8DDD2] flex items-center justify-center text-[#9E9082] hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 transition-all shadow-xs cursor-pointer"
                          title="Remove from wishlist"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <span className="eyebrow-text block text-[11px] truncate">
                          {item.brand || item.category || "Zenzies"}
                        </span>
                        <Link
                          to={`/product/${item.id}`}
                          className="font-serif text-sm sm:text-base text-[#211A16] hover:text-[#956638] transition-colors leading-snug line-clamp-1 block"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="font-serif text-base sm:text-lg text-[#211A16] font-medium">
                            ₹{Number(item.price || 0).toLocaleString()}
                          </span>
                          {Number(item.original_price) > Number(item.price) && (
                            <span className="text-xs text-[#9E9082] line-through">
                              ₹{Number(item.original_price).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-3 border-t border-[#F2EBE1] mt-3">
                      {isOutOfStock ? (
                        <button
                          onClick={() => setNotifyProduct(item)}
                          className="btn-luxury-dark w-full text-xs min-h-[40px] justify-center"
                        >
                          <Bell size={13} className="text-[#C9A66B]" />
                          <span>Notify Me</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => moveToCart(item)}
                          disabled={movingItems[item.id]}
                          className="btn-luxury-primary w-full text-xs min-h-[40px] justify-center disabled:opacity-50"
                        >
                          {movingItems[item.id] ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <ShoppingBag size={13} />
                          )}
                          <span>{movingItems[item.id] ? "Moving..." : "Move to Bag"}</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}

        {/* Back in stock notification modal */}
        <NotifyMeModal
          isOpen={!!notifyProduct}
          onClose={() => setNotifyProduct(null)}
          product={notifyProduct}
        />

      </div>
    </div>
  );
};

export default Wishlist;
