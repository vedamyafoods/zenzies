import React, { useEffect, useState } from "react";
import { db } from "../components/Firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  Tag,
  ChevronRight,
  Gift,
  Lock,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Package,
  Gem
} from "lucide-react";
import { useStore } from "../hooks/useStore";
import { useAuth } from "../components/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { getOptimizedImageUrl, handleImageError } from "../config/cloudinary";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, updateCartQuantity, removeFromCart } = useStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveStocks, setLiveStocks] = useState({});

  // Gift note state
  const [showGiftNote, setShowGiftNote] = useState(false);
  const [giftNoteText, setGiftNoteText] = useState("");
  const [savedGiftNote, setSavedGiftNote] = useState("");

  useEffect(() => {
    setItems(cartItems);

    if (cartItems.length === 0) {
      setLoading(false);
      setLiveStocks({});
      return undefined;
    }

    const unsubs = [];
    cartItems.forEach((item) => {
      if (!item.id || item.id.startsWith('bs-')) return;
      const pRef = doc(db, "products", item.id);
      const unsub = onSnapshot(pRef, async (snap) => {
        if (snap.exists()) {
          const actualStock = Number(snap.data().stock || 0);
          setLiveStocks((prev) => ({ ...prev, [item.id]: actualStock }));
          if (actualStock <= 0) {
            await removeFromCart(item.id);
          } else if (item.quantity > actualStock) {
            await updateCartQuantity(item.id, actualStock);
          }
        }
      }, (err) => {
        console.error("Live stock subscription error for item", item.id, err);
      });
      unsubs.push(unsub);
    });

    setLoading(false);

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [cartItems, updateCartQuantity, removeFromCart]);

  const removeItem = async (id) => {
    await removeFromCart(id);
  };

  const subtotal = items.reduce((sum, i) => sum + (Number(i.price) * (i.quantity || 1)), 0);
  const originalTotal = items.reduce((sum, i) => sum + (Number(i.original_price || i.price) * (i.quantity || 1)), 0);
  const productSavings = originalTotal - subtotal;
  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

  const handleSaveGiftNote = () => {
    setSavedGiftNote(giftNoteText);
    setShowGiftNote(false);
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

  const total = subtotal;

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-body text-[#211A16]">

      {/* ── Refined Light Header / Breadcrumb ── */}
      <div className="w-full bg-[#FAF7F2] border-b border-[#E8DDD2] pt-24 sm:pt-28 pb-5">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6B5E52] mb-3">
            <Link to="/" className="hover:text-[#956638] transition-colors">Home</Link>
            <ChevronRight size={13} className="text-[#9E9082]" />
            <Link to="/shop" className="hover:text-[#956638] transition-colors">Shop</Link>
            <ChevronRight size={13} className="text-[#9E9082]" />
            <span className="text-[#211A16] font-semibold">Shopping Bag</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#211A16] font-normal tracking-tight">
              Your Curated Bag
              <span className="ml-3 text-xs font-body font-semibold text-[#956638] bg-[#FAF2E8] border border-[#956638]/30 px-3 py-1 rounded-full uppercase tracking-wider">
                {itemCount} {itemCount === 1 ? 'Piece' : 'Pieces'}
              </span>
            </h1>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#956638] hover:text-[#211A16] transition-colors group self-start sm:self-auto"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12 pb-32 lg:pb-24">

        {items.length === 0 ? (
          /* Empty Bag State */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-luxury py-16 sm:py-20 px-6 text-center max-w-lg mx-auto space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-[#FAF2E8] border border-[#956638]/30 flex items-center justify-center mx-auto text-[#956638]">
              <ShoppingBag size={28} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#211A16] font-normal">
              Your Bag is Currently Empty
            </h2>
            <p className="body-text text-sm sm:text-base text-[#6B5E52] max-w-md mx-auto">
              Your personal jewellery collection is waiting. Explore our organizer boxes and handcrafted jewellery to curate your pieces.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="btn-luxury-primary"
              >
                <span>Explore Boutique Catalogue</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Main 2-Column Cart Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left Column: Cart Items List + Trust Cards (7-8 Cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">

              {/* Free Shipping Banner */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-3">
                <Truck size={18} className="text-emerald-800 shrink-0" />
                <p className="text-xs sm:text-sm text-emerald-900 font-medium">
                  <strong>Complimentary Insured Delivery:</strong> You qualify for free express doorstep shipping across India!
                </p>
              </div>

              {/* Item Cards List */}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => {
                    const unitPrice = Number(item.price);
                    const originalPrice = Number(item.original_price || item.price);
                    const itemSavings = originalPrice > unitPrice ? (originalPrice - unitPrice) * (item.quantity || 1) : 0;

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        key={item.id}
                        className="card-luxury p-4 sm:p-5 flex gap-4 sm:gap-6 items-start sm:items-center relative overflow-hidden"
                      >
                        {/* Thumbnail */}
                        <Link
                          to={`/product/${item.id}`}
                          className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8DDD2] shrink-0 group/img relative"
                        >
                          <img
                            src={getOptimizedImageUrl(item.image)}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => handleImageError(e, item.image)}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Info & Quantity */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <span className="eyebrow-text block text-[11px] mb-0.5">
                                {item.category || "Zenzies Exclusive"}
                              </span>
                              <Link
                                to={`/product/${item.id}`}
                                className="font-serif text-base sm:text-lg text-[#211A16] hover:text-[#956638] transition-colors leading-snug line-clamp-1"
                              >
                                {item.name}
                              </Link>
                            </div>

                            {/* Remove Item */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[#9E9082] hover:text-rose-700 hover:bg-rose-50 p-2 rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Remove piece"
                              aria-label="Remove piece"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Pricing & Quantity Controls */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F2EBE1]">
                            <div className="flex items-baseline gap-2">
                              <span className="font-serif text-lg sm:text-xl text-[#211A16] font-medium">
                                ₹{(unitPrice * (item.quantity || 1)).toLocaleString()}
                              </span>
                              {originalPrice > unitPrice && (
                                <span className="text-xs text-[#9E9082] line-through">
                                  ₹{(originalPrice * (item.quantity || 1)).toLocaleString()}
                                </span>
                              )}
                              {itemSavings > 0 && (
                                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  Save ₹{itemSavings.toLocaleString()}
                                </span>
                              )}
                            </div>

                            {/* Quantity Controls (- / 1 / +) */}
                            <div className="flex items-center border border-[#E8DDD2] rounded-lg overflow-hidden bg-white shadow-2xs">
                              <button
                                onClick={() => updateCartQuantity(item.id, (item.quantity || 1) - 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#211A16] hover:bg-[#FAF7F2] active:bg-[#E8DDD2] transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-xs font-semibold text-[#211A16]">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.id, (item.quantity || 1) + 1)}
                                disabled={(item.quantity || 1) >= Math.min(10, liveStocks[item.id] ?? item.stock ?? 1)}
                                className="w-8 h-8 flex items-center justify-center text-[#211A16] hover:bg-[#FAF7F2] active:bg-[#E8DDD2] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Guarantees Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="card-luxury p-3.5 flex items-center gap-3">
                  <Package size={20} className="text-[#956638] shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#211A16]">Signature Packaging</h4>
                    <p className="text-xs text-[#6B5E52]">Velvet gift box with certificate</p>
                  </div>
                </div>

                <div className="card-luxury p-3.5 flex items-center gap-3">
                  <ShieldCheck size={20} className="text-[#956638] shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#211A16]">Anti-Tarnish Assurance</h4>
                    <p className="text-xs text-[#6B5E52]">Sweat & water resistant lustre</p>
                  </div>
                </div>

                <div className="card-luxury p-3.5 flex items-center gap-3">
                  <RefreshCw size={20} className="text-[#956638] shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#211A16]">7-Day Easy Exchange</h4>
                    <p className="text-xs text-[#6B5E52]">Concierge customer support</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary Card (4-5 Cols) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="lg:sticky lg:top-24 card-luxury overflow-hidden border-t-4 border-t-[#956638]">

                {/* Header */}
                <div className="px-5 py-4 border-b border-[#E8DDD2] bg-[#FAF7F2] flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-[#211A16] uppercase tracking-[0.2em] flex items-center gap-2">
                    <Sparkles size={14} className="text-[#956638]" />
                    Order Summary
                  </h2>
                  <span className="text-xs text-[#6B5E52]">
                    {itemCount} {itemCount === 1 ? 'Piece' : 'Pieces'}
                  </span>
                </div>

                <div className="p-5 space-y-4">

                  {/* Line Items */}
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between items-center text-[#6B5E52]">
                      <span>Subtotal</span>
                      <span className="font-semibold text-[#211A16]">₹{originalTotal.toLocaleString()}</span>
                    </div>

                    {productSavings > 0 && (
                      <div className="flex justify-between items-center text-emerald-800">
                        <span>Privilege Discount</span>
                        <span className="font-semibold">−₹{productSavings.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[#6B5E52]">
                      <span>Insured Express Shipping</span>
                      <span className="text-emerald-800 font-semibold uppercase text-xs">Free</span>
                    </div>

                    <div className="flex justify-between items-center text-[#6B5E52]">
                      <span>Goods & Services Tax (GST)</span>
                      <span className="text-emerald-800 font-semibold text-xs">Included in price</span>
                    </div>
                  </div>

                  {/* Total Amount Box */}
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DDD2] space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#211A16]">
                        Grand Total
                      </span>
                      <span className="font-serif text-2xl sm:text-3xl font-normal text-[#211A16]">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#9E9082] text-right">
                      Inclusive of all applicable Indian taxes
                    </p>
                  </div>

                  {/* Personalized Gift Message Accordion */}
                  <div className="pt-1">
                    {!showGiftNote ? (
                      <button
                        onClick={() => setShowGiftNote(true)}
                        className="w-full flex items-center justify-between text-xs text-[#6B5E52] hover:text-[#956638] transition-colors py-2.5 border-t border-b border-[#E8DDD2] cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Gift size={14} className="text-[#956638]" />
                          {savedGiftNote ? 'Edit Personalized Gift Note' : 'Add Complimentary Gift Message'}
                        </span>
                        <ChevronRight size={14} />
                      </button>
                    ) : (
                      <div className="space-y-2.5 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E8DDD2]">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#211A16] flex items-center gap-1.5">
                          <Gift size={14} className="text-[#956638]" />
                          Complimentary Gift Message Card
                        </p>
                        <textarea
                          rows={2.5}
                          placeholder="Write a message to be hand-printed on luxury cardstock..."
                          value={giftNoteText}
                          onChange={(e) => setGiftNoteText(e.target.value)}
                          className="input-luxury w-full p-2.5 text-xs resize-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowGiftNote(false)}
                            className="px-3 py-1 text-xs text-[#6B5E52] hover:text-[#211A16] cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveGiftNote}
                            className="btn-luxury-dark text-xs px-3.5 py-1 min-h-[36px]"
                          >
                            Save Note
                          </button>
                        </div>
                      </div>
                    )}
                    {savedGiftNote && !showGiftNote && (
                      <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg mt-2 font-serif italic">
                        "{savedGiftNote}"
                      </p>
                    )}
                  </div>

                  {/* Primary Checkout Button */}
                  <button
                    onClick={() => navigate("/checkout")}
                    disabled={items.length === 0}
                    className="btn-luxury-primary w-full justify-center min-h-[50px] shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight size={15} />
                  </button>

                  {/* 256-Bit SSL Notice */}
                  <div className="flex items-center justify-center gap-1.5 text-xs text-[#9E9082]">
                    <Lock size={13} className="text-[#956638]" />
                    <span>256-Bit SSL Encrypted • Insured Pan-India Transit</span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── Mobile Sticky Bottom Checkout Bar ── */}
      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8DDD2] p-3 px-4 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[11px] text-[#9E9082] uppercase tracking-wider block">
              Total ({itemCount} {itemCount === 1 ? 'Piece' : 'Pieces'})
            </span>
            <span className="font-serif text-xl font-normal text-[#211A16]">
              ₹{total.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="btn-luxury-primary text-xs px-6 py-2.5 min-h-[44px]"
          >
            <span>Checkout</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

    </div>
  );
};

export default Cart;
