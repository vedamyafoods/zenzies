import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Menu, X, ShoppingBag, Heart, User,
  ArrowRight, Loader2, Sparkles, Package, Gift, Gem
} from 'lucide-react';
import { useAuth } from './useAuth';
import { useStore } from '../hooks/useStore';
import { db } from './Firebase';
import { doc, collection, getDocs, onSnapshot } from 'firebase/firestore';

/* ─── Design Tokens ──────────────────────────────────── */
const CARAMEL_GOLD = '#956638';
const SOFT_BEIGE = '#E9D9C7';
const WARM_IVORY = '#FBF7F2';
const ESPRESSO = '#211A16';
const BORDER_WARM = '#E8DDD2';

const LuxuryHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([
    "Free Shipping on Orders Over ₹1000 • Easy 7-Day Returns • 100% Online Payment Safe"
  ]);
  const [annIndex, setAnnIndex] = useState(0);

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const unsubAnn = onSnapshot(doc(db, "site_settings", "announcements"), (snap) => {
      if (snap.exists() && snap.data().items && snap.data().items.length > 0) {
        setAnnouncements(snap.data().items);
      } else {
        setAnnouncements([
          "Free Shipping on Orders Over ₹1000",
          "Easy 7-Day Returns & Exchange Policy",
          "A Timeless Beauty, Always Yours — Welcome to Zenzies"
        ]);
      }
    }, (err) => console.warn("Error fetching announcements:", err));

    return () => unsubAnn();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setAnnIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [announcements]);

  const [scrolled, setScrolled] = useState(window.scrollY > 15);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user } = useAuth();
  const { cartCount, wishlistCount } = useStore();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Jewelry Boxes', href: '/shop?category=Jewellery+Boxes' },
    { name: 'Collections', href: '/shop?category=Bundles' },
    { name: 'Gifts', href: '/shop?category=Jewellery+Boxes' },
    { name: 'About', href: '/about' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (mobileOpen || isSearchOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, isSearchOpen]);

  return (
    <>
      {/* Section 01: Announcement Bar */}
      <div
        className="relative z-[60] text-center px-4 h-[30px] sm:h-[32px] overflow-hidden flex items-center justify-between shadow-xs border-b border-[#DFCBB9]/60"
        style={{ background: SOFT_BEIGE, position: 'fixed', top: 0, left: 0, right: 0 }}
      >
        {/* Desktop 3-item strip */}
        <div className="hidden lg:flex max-w-[1440px] mx-auto w-full items-center justify-between text-[11px] font-medium tracking-[0.2px] text-[#211A16]">
          <div className="flex items-center gap-1.5 opacity-90">
            <span>🚚</span>
            <span>Free Shipping on Orders Over ₹1000</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-[#956638]">
            <span>🔄</span>
            <span>Easy 7-Day Returns</span>
          </div>
          <div className="flex items-center gap-1.5 opacity-90">
            <span>✨</span>
            <span>A Timeless Beauty, Always Yours</span>
          </div>
        </div>

        {/* Mobile Rotating Carousel */}
        <div className="lg:hidden w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={annIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-[11px] font-medium tracking-[0.2px] text-[#211A16] truncate px-2 text-center"
            >
              {announcements[annIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Section 02: Main Navbar */}
      <header
        ref={(el) => {
          if (el) {
            document.documentElement.style.setProperty(
              '--header-height',
              el.getBoundingClientRect().bottom + 'px'
            );
          }
        }}
        className="w-full fixed z-50 transition-all duration-300 backdrop-blur-md"
        style={{
          top: 0,
          paddingTop: 32,
          background: 'rgba(251, 247, 242, 0.96)',
          borderBottom: `1px solid ${BORDER_WARM}`,
          boxShadow: scrolled ? '0 4px 20px rgba(33, 26, 22, 0.05)' : 'none'
        }}
      >
        <div
          className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between"
          style={{ height: '68px' }}
        >
          {/* Left: Mobile Toggle & Desktop Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-black/5 transition-all text-[#211A16] cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo Wordmark */}
            <Link to="/" className="inline-flex items-center gap-2.5 group transition-all duration-200">
              <img
                src="/img/logo.png"
                alt="Zenzies"
                className="h-9 sm:h-10 w-9 sm:w-10 rounded-full object-cover shadow-xs border border-[#956638]/20 group-hover:border-[#956638] transition-all"
              />
              <div className="flex flex-col leading-none">
                <span className="font-serif text-[22px] tracking-[0.14em] font-medium text-[#211A16] group-hover:text-[#956638] transition-colors">
                  ZENZIES
                </span>
                <span className="text-[9px] tracking-[0.3em] font-medium text-[#6B5E52] uppercase mt-0.5">
                  THE JEWELLERY
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="relative py-2 text-[13px] font-medium text-[#211A16] hover:text-[#956638] tracking-[0.05em] transition-colors duration-200 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#956638] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center" />
              </Link>
            ))}
          </nav>

          {/* Right: Search, Account, Wishlist, Cart */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:p-2.5 rounded-full hover:bg-[#E8DDD2]/50 text-[#211A16] hover:text-[#956638] transition-all cursor-pointer"
              title="Search Products"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Account */}
            <Link
              to={user ? '/account' : '/login'}
              className="p-2 sm:p-2.5 rounded-full hover:bg-[#E8DDD2]/50 text-[#211A16] hover:text-[#956638] transition-all"
              title={user ? "My Account" : "Sign In"}
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 sm:p-2.5 rounded-full hover:bg-[#E8DDD2]/50 text-[#211A16] hover:text-[#956638] transition-all"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && <BadgeDot count={wishlistCount} />}
            </Link>

            {/* Cart / Shopping Bag */}
            <Link
              to="/cart"
              className="relative p-2 sm:p-2.5 rounded-full hover:bg-[#E8DDD2]/50 text-[#211A16] hover:text-[#956638] transition-all"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <BadgeDot count={cartCount} />}
            </Link>
          </div>
        </div>
      </header>

      {/* Interactive Search Overlay Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlayModal onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 z-[100] w-[85vw] max-w-sm flex flex-col bg-[#FBF7F2] border-r border-[#E8DDD2] shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DDD2] bg-[#FFFFFF]">
                <div className="flex items-center gap-2.5">
                  <img src="/img/logo.png" alt="Zenzies" className="h-8 w-8 rounded-full object-cover border border-[#956638]/20" />
                  <span className="font-serif text-xl tracking-[0.12em] font-medium text-[#211A16]">ZENZIES</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-[#211A16]/70 hover:text-[#211A16] rounded-full cursor-pointer hover:bg-black/5"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Quick Category Shortcuts */}
              <div className="px-6 py-4 border-b border-[#E8DDD2] grid grid-cols-3 gap-2 bg-[#FFFFFF]">
                <Link
                  to="/shop?category=Jewellery+Boxes"
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#FBF7F2] border border-[#E8DDD2] hover:border-[#956638] text-center"
                >
                  <Package size={18} className="text-[#956638] mb-1" />
                  <span className="text-[11px] font-medium text-[#211A16]">Boxes</span>
                </Link>
                <Link
                  to="/shop?category=Jewellery"
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#FBF7F2] border border-[#E8DDD2] hover:border-[#956638] text-center"
                >
                  <Gem size={18} className="text-[#956638] mb-1" />
                  <span className="text-[11px] font-medium text-[#211A16]">Jewellery</span>
                </Link>
                <Link
                  to="/shop?category=Bundles"
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#FBF7F2] border border-[#E8DDD2] hover:border-[#956638] text-center"
                >
                  <Gift size={18} className="text-[#956638] mb-1" />
                  <span className="text-[11px] font-medium text-[#211A16]">Bundles</span>
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.name} className="border-b border-[#E8DDD2]/60">
                    <div
                      className="flex justify-between items-center py-3.5 cursor-pointer"
                      onClick={() => { setMobileOpen(false); navigate(link.href); }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-base text-[#211A16] font-medium hover:text-[#956638] transition-colors"
                      >
                        {link.name}
                      </Link>
                      <ArrowRight size={14} className="text-[#956638]" />
                    </div>
                  </div>
                ))}

                {/* Additional Links in Mobile Drawer */}
                <div className="pt-6 space-y-2">
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2 text-sm text-[#211A16] hover:text-[#956638]"
                  >
                    <Heart size={16} className="text-[#956638]" />
                    <span>My Wishlist ({wishlistCount})</span>
                  </Link>
                  <Link
                    to={user ? '/account' : '/login'}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2 text-sm text-[#211A16] hover:text-[#956638]"
                  >
                    <User size={16} className="text-[#956638]" />
                    <span>{user ? 'My Account' : 'Sign In / Register'}</span>
                  </Link>
                </div>
              </div>

              {/* Footer info in Mobile Drawer */}
              <div className="p-5 border-t border-[#E8DDD2] bg-[#FFFFFF] text-xs text-[#6B5E52] space-y-1">
                <p className="font-semibold text-[#211A16]">Zenzies Customer Care</p>
                <p>Phone: +91 9977712653</p>
                <p>Email: support@zenzies.in</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const BadgeDot = ({ count }) => (
  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-[#956638] border border-white">
    {count}
  </span>
);

/* ─── Interactive Search Overlay Modal ────────────────────── */
const SearchOverlayModal = ({ onClose }) => {
  const [queryStr, setQueryStr] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    setLoading(true);
    getDocs(collection(db, "products"))
      .then((snap) => {
        if (!snap.empty) {
          setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      })
      .catch((err) => console.error("Search fetch error:", err))
      .finally(() => setLoading(false));

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const searchResults = useMemo(() => {
    if (!queryStr.trim()) return [];
    const q = queryStr.toLowerCase().trim();
    return products.filter(p => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const catMatch = p.category?.toLowerCase().includes(q);
      const descMatch = p.description?.toLowerCase().includes(q);
      const tagMatch = Array.isArray(p.tags) && p.tags.some(t => String(t).toLowerCase().includes(q));
      return nameMatch || catMatch || descMatch || tagMatch;
    }).slice(0, 8);
  }, [queryStr, products]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (queryStr.trim()) {
      navigate(`/shop?search=${encodeURIComponent(queryStr.trim())}`);
      onClose();
    }
  };

  const handleTagClick = (tag) => {
    const cleanTag = tag.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    setQueryStr(cleanTag);
    navigate(`/shop?search=${encodeURIComponent(cleanTag)}`);
    onClose();
  };

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
    onClose();
  };

  const categories = [
    { label: "📦 Jewellery Boxes", category: "Jewellery Boxes" },
    { label: "✨ Jewellery", category: "Jewellery" },
    { label: "🎁 Curated Bundles", category: "Bundles" },
  ];

  const popularStyles = [
    { label: "💍 Rings", query: "Rings" },
    { label: "💎 Earrings", query: "Earrings" },
    { label: "📿 Necklaces", query: "Necklaces" },
    { label: "💫 Bracelets", query: "Bracelets" },
    { label: "🧳 Travel Boxes", query: "Travel" },
    { label: "⭐ Velvet Boxes", query: "Velvet" },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-start">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
      />

      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -25 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="relative z-10 w-full bg-[#FBF7F2] border-b border-[#E8DDD2] text-[#211A16] shadow-xl overflow-hidden"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">

          {/* Top Utility Header */}
          <div className="flex items-center justify-between border-b border-[#E8DDD2] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#956638]" />
              <span className="text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.2em] text-[#211A16]">
                Search Zenzies
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs font-mono uppercase tracking-wider text-[#6B5E52] bg-white border border-[#E8DDD2] px-2.5 py-1 rounded-full">
                Press ESC to exit
              </span>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-[#E8DDD2] hover:bg-[#956638] hover:text-white transition-all flex items-center justify-center text-[#211A16] cursor-pointer"
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center group">
            <Search className="absolute left-4 w-5 h-5 text-[#956638]" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search jewellery organizer boxes, earrings, rings, bundles..."
              value={queryStr}
              onChange={(e) => setQueryStr(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#E8DDD2] rounded-xl text-sm sm:text-base font-sans text-[#211A16] placeholder:text-[#6B5E52]/60 outline-none focus:border-[#956638] focus:ring-1 focus:ring-[#956638] transition-all"
            />
            {queryStr && (
              <button
                type="button"
                onClick={() => setQueryStr('')}
                className="absolute right-4 p-1 text-[#6B5E52] hover:text-[#211A16] rounded-full transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </form>

          {/* Quick Categories & Popular Searches */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-[#6B5E52] mr-1">
                Categories:
              </span>
              {categories.map((c) => (
                <button
                  key={c.category}
                  type="button"
                  onClick={() => handleCategoryClick(c.category)}
                  className="px-3 py-1 bg-white hover:bg-[#956638] hover:text-white border border-[#E8DDD2] rounded-full text-xs font-medium text-[#211A16] transition-all cursor-pointer"
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-sans font-bold uppercase tracking-[0.16em] text-[#6B5E52] mr-1">
                Popular:
              </span>
              {popularStyles.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleTagClick(chip.query)}
                  className="px-3 py-1 bg-white/70 hover:bg-[#956638] hover:text-white border border-[#E8DDD2] rounded-full text-xs font-medium text-[#6B5E52] hover:text-white transition-all cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Search Results Preview */}
          {queryStr.trim() !== '' && (
            <div className="space-y-3 pt-3 border-t border-[#E8DDD2] max-h-[55vh] overflow-y-auto pr-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-sans font-bold uppercase tracking-[0.18em] text-[#956638]">
                  Matching Products ({searchResults.length})
                </span>
                <button
                  onClick={handleSearchSubmit}
                  className="text-xs font-bold text-[#956638] hover:underline flex items-center gap-1 cursor-pointer font-sans"
                >
                  <span>View All in Shop</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {loading ? (
                <div className="py-8 text-center text-[#6B5E52] flex items-center justify-center gap-2 font-sans text-sm">
                  <Loader2 className="animate-spin text-[#956638]" size={18} />
                  <span>Searching products...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      onClick={onClose}
                      className="p-2.5 rounded-xl bg-white border border-[#E8DDD2] hover:border-[#956638] hover:shadow-md transition-all flex items-center gap-3 group"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#E8DDD2] shrink-0">
                        <img
                          src={item.image || '/img/jewellery/j.png'}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="overflow-hidden space-y-0.5 min-w-0">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.16em] text-[#956638] block truncate">
                          {item.category || "Zenzies"}
                        </span>
                        <h4 className="text-sm font-medium text-[#211A16] group-hover:text-[#956638] transition-colors truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs font-bold text-[#211A16]">
                          ₹{Number(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center bg-white border border-[#E8DDD2] rounded-xl space-y-2">
                  <p className="text-sm text-[#6B5E52] font-sans">
                    No products found for "{queryStr}"
                  </p>
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs font-bold text-[#956638] hover:underline uppercase tracking-wider font-sans cursor-pointer"
                  >
                    Search Full Catalogue →
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};

export default LuxuryHeader;
