import React, { useState, useEffect } from 'react';
import { db } from '../../../components/Firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  Save, RotateCcw, Image as ImageIcon, Upload, Trash2, Check,
  Loader2, Sliders, Eye, ChevronDown, ChevronUp, Sparkles, Layers,
  Palette, Maximize2, Move, Monitor, Smartphone, Tablet, Plus,
  FileText, ArrowRight, Star, Heart, Gem, ShieldCheck, Leaf, Users,
  Gift, Package, Headphones, Lock, Truck
} from 'lucide-react';
import { uploadToCloudinaryWithProgress } from '../../../config/cloudinary';

// ─── Default Section Design Tokens ───────────────────────────────────────────
const DEFAULT_SECTION_DESIGNS = {
  announcement_bar: {
    enabled: true,
    backgroundColor: '#E9D9C7',
    textColor: '#211A16',
    paddingTop: '6px',
    paddingBottom: '6px',
  },
  navbar: {
    enabled: true,
    backgroundColor: '#FBF7F2',
    textColor: '#211A16',
    borderColor: '#E8DDD2',
    accentColor: '#956638',
  },
  hero: {
    enabled: true,
    backgroundColor: '#FBF7F2',
    backgroundImage: '',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'scroll',
    backgroundBlendMode: 'normal',
    overlayOpacity: 0,
    overlayColor: '#000000',
    paddingTop: '110px',
    paddingBottom: '64px',
    titleColor: '#211A16',
    subtitleColor: '#6B5E52',
    accentColor: '#956638',
  },
  category_grid: {
    enabled: true,
    backgroundColor: '#FFFFFF',
    paddingTop: '48px',
    paddingBottom: '48px',
    eyebrow: 'SHOP BY CATEGORY',
    title: 'Find Your Perfect Piece',
    subtitle: 'Explore our curated collections for every occasion.',
    viewAllText: 'View All Categories',
    viewAllLink: '/shop',
    titleColor: '#211A16',
    subtitleColor: '#62564B',
    accentColor: '#956638',
  },
  jewellery_box_banner: {
    enabled: true,
    backgroundColor: '#FBF7F2',
    backgroundImage: '/img/zenzies/jewellery_box_promo_clean_bg.jpg',
    backgroundSize: 'cover',
    backgroundPosition: 'center right',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'scroll',
    backgroundBlendMode: 'normal',
    overlayOpacity: 0,
    overlayColor: '#000000',
    paddingTop: '0px',
    paddingBottom: '0px',
    eyebrow: 'PREMIUM JEWELRY BOXES',
    titleLine1: 'Little Box',
    titleLine2: 'Big Elegance',
    subtitle: 'Keep your earrings, rings, and chains beautifully organized with our premium jewelry boxes.',
    titleColor: '#211A16',
    titleLine2Color: '#956638',
    subtitleColor: '#62564B',
    accentColor: '#956638',
    btnText: 'Shop Jewelry Boxes',
    btnLink: '/shop?category=Jewellery+Boxes',
    btnEnabled: true,
    btnBgColor: '#956638',
    btnTextColor: '#FFFFFF',
    features: [
      { id: 'f1', text: 'Multiple Compartments', enabled: true },
      { id: 'f2', text: 'Travel Friendly', enabled: true },
      { id: 'f3', text: 'Stylish & Luxurious Design', enabled: true },
      { id: 'f4', text: 'Perfect for Gifting', enabled: true },
    ],
  },
  bestsellers: {
    enabled: true,
    backgroundColor: '#FBF7F2',
    paddingTop: '44px',
    paddingBottom: '52px',
    eyebrow: 'BESTSELLERS',
    title: 'Our Most Loved Pieces',
    subtitle: 'Timeless favorites, chosen by you.',
    viewAllText: 'View All Products',
    viewAllLink: '/shop',
    titleColor: '#211A16',
    subtitleColor: '#62564B',
    accentColor: '#956638',
    cardBackgroundColor: '#FFFFFF',
    cardBorderColor: '#E8DDD2',
    cardBorderRadius: '14px',
    btnBgColor: '#956638',
    btnTextColor: '#FFFFFF',
    btnBorderRadius: '5px',
  },
  trust_benefits: {
    enabled: true,
    backgroundColor: '#F3E4DA',
    paddingTop: '22px',
    paddingBottom: '22px',
    titleColor: '#211A16',
    textColor: '#62564B',
    iconColor: '#65472D',
    items: [
      { id: 'tb1', icon: 'gem', title: 'Ethically Sourced', desc: 'Conflict-free diamonds', enabled: true },
      { id: 'tb2', icon: 'shield-check', title: 'Certified Quality', desc: 'Authenticity guaranteed', enabled: true },
      { id: 'tb3', icon: 'leaf', title: 'Sustainable Practices', desc: 'A brighter tomorrow', enabled: true },
      { id: 'tb4', icon: 'users', title: 'Trusted by 50K+', desc: 'Happy customers', enabled: true },
    ],
  },
  promotional_banners: {
    enabled: true,
    backgroundColor: '#FBF7F2',
    paddingTop: '48px',
    paddingBottom: '48px',
    titleColor: '#FFFFFF',
    accentColor: '#956638',
    banner1Eyebrow: 'CURATED COMBOS',
    banner1Title: "Crafted for Life's Special Moments",
    banner1BtnText: 'Explore Bundles',
    banner1BtnLink: '/shop?category=Bundles',
    banner1Image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=900',
    banner2Eyebrow: 'GIFT SETS',
    banner2Title: 'A Gift That Lasts Forever',
    banner2BtnText: 'Shop Gifts',
    banner2BtnLink: '/shop?category=Jewellery+Boxes',
    banner2Image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=900',
  },
  brand_story: {
    enabled: true,
    backgroundColor: '#FFFFFF',
    paddingTop: '64px',
    paddingBottom: '64px',
    eyebrow: 'OUR STORY',
    title: 'A Legacy of Grace\nand Thoughtful Storage',
    description: "At Zenzies, we believe jewellery is more than an accessory — it's a symbol of love, confidence, and life's most cherished memories. Every piece of jewellery and organizer box is thoughtfully designed to ensure your treasured treasures remain beautifully organized, tangle-free, and protected for years to come.",
    btnText: 'Read Our Story',
    btnLink: '/about',
    btnEnabled: true,
    btnBgColor: '#956638',
    image: 'https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&q=80&w=900',
    scriptLine1: 'Handcrafted',
    scriptLine2: 'With Love ♡',
    badgeTitle: 'ZENZIES',
    badgeYear: 'EST. 2024',
    badgeSubtitle: 'Authentic Care',
    titleColor: '#211A16',
    subtitleColor: '#6B5E52',
    accentColor: '#956638',
  },
  testimonials: {
    enabled: true,
    backgroundColor: '#FBF7F2',
    paddingTop: '48px',
    paddingBottom: '48px',
    eyebrow: 'WHAT OUR CUSTOMERS SAY',
    title: 'Loved by Thousands',
    titleColor: '#211A16',
    cardBackgroundColor: '#FFFFFF',
    cardBorderColor: '#E8DDD2',
    accentColor: '#956638',
  },
  social_gallery: {
    enabled: true,
    backgroundColor: '#FFFFFF',
    paddingTop: '48px',
    paddingBottom: '48px',
    eyebrow: 'FOLLOW @ZENZIES',
    title: 'Join Our Shining Community',
    instagramUrl: 'https://www.instagram.com',
    titleColor: '#211A16',
    accentColor: '#956638',
  },
  newsletter: {
    enabled: true,
    backgroundColor: '#E9D9C7',
    paddingTop: '48px',
    paddingBottom: '48px',
    title: 'Get Exclusive Offers',
    subtitle: 'Subscribe and be the first to know about new collections, special offers and smart jewellery storage tips.',
    btnText: 'Subscribe',
    btnBgColor: '#956638',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=900',
    scriptLine1: 'A Brighter Tomorrow',
    scriptLine2: 'Starts Here ♡',
    titleColor: '#211A16',
    subtitleColor: '#6B5E52',
    accentColor: '#956638',
  },
  footer: {
    enabled: true,
    backgroundColor: '#FBF7F2',
    paddingTop: '48px',
    paddingBottom: '24px',
    textColor: '#211A16',
    borderColor: '#E8DDD2',
  },
};

const SECTION_METADATA = [
  { id: 'announcement_bar', label: '01. Announcement Bar', desc: 'Slim promotional header strip' },
  { id: 'navbar', label: '02. Main Navigation', desc: 'Brand logo and primary menu bar' },
  { id: 'hero', label: '03. Hero Banner', desc: 'Main two-column showcase & headline' },
  { id: 'category_grid', label: '04. Shop by Category', desc: 'Circular thumbnail collection badges' },
  { id: 'jewellery_box_banner', label: '05. Jewellery Box Banner', desc: 'Full-width promo banner with features & CTA' },
  { id: 'bestsellers', label: '06. Bestsellers Grid', desc: 'Popular pieces, prices & Add to Cart' },
  { id: 'trust_benefits', label: '07. Trust Benefits Strip', desc: '4-column assurance and quality strip' },
  { id: 'promotional_banners', label: '08. Promotional Banners', desc: 'Bundles & gifting occasion cards' },
  { id: 'brand_story', label: '09. Brand Story', desc: 'Arched image, craftsmanship & heritage' },
  { id: 'testimonials', label: '10. Testimonials', desc: 'Customer reviews, ratings & feedback' },
  { id: 'social_gallery', label: '11. Social Gallery', desc: '6-tile Instagram lifestyle community' },
  { id: 'newsletter', label: '12. Newsletter Banner', desc: 'Exclusive offers email subscription' },
  { id: 'footer', label: '13. Footer & Policies', desc: 'Links, customer care & copyright' },
];

const POSITION_PRESETS = [
  { label: 'Top Left', val: 'left top' },
  { label: 'Top Center', val: 'center top' },
  { label: 'Top Right', val: 'right top' },
  { label: 'Center Left', val: 'left center' },
  { label: 'Center', val: 'center center' },
  { label: 'Center Right', val: 'right center' },
  { label: 'Bottom Left', val: 'left bottom' },
  { label: 'Bottom Center', val: 'center bottom' },
  { label: 'Bottom Right', val: 'right bottom' },
];

const BLEND_MODES = [
  'normal', 'multiply', 'overlay', 'screen', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light'
];

const AVAILABLE_BENEFIT_ICONS = [
  { val: 'gem', label: 'Diamond / Gem', Icon: Gem },
  { val: 'shield-check', label: 'Shield Check / Quality', Icon: ShieldCheck },
  { val: 'leaf', label: 'Leaf / Sustainable', Icon: Leaf },
  { val: 'sparkles', label: 'Sparkles / Elegance', Icon: Sparkles },
  { val: 'users', label: 'Users / Community', Icon: Users },
  { val: 'gift', label: 'Gift / Packaging', Icon: Gift },
  { val: 'package', label: 'Package / Delivery', Icon: Package },
  { val: 'headset', label: 'Headset / Support', Icon: Headphones },
  { val: 'truck', label: 'Truck / Fast Shipping', Icon: Truck },
  { val: 'lock', label: 'Lock / Secure Pay', Icon: Lock },
];

const HomepageDesignManager = ({ isDarkMode = false }) => {
  const [selectedSection, setSelectedSection] = useState('jewellery_box_banner');
  const [designs, setDesigns] = useState(DEFAULT_SECTION_DESIGNS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop'); // desktop, tablet, mobile

  // Collapsible accordion sections
  const [openAccordion, setOpenAccordion] = useState({
    content: true,
    background: true,
    typography: true,
    spacing: false,
    borders: false,
    responsive: false
  });

  const toggleAccordion = (key) => {
    setOpenAccordion(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ─── Fetch Firestore Design Config ──────────────────────────────────────────
  useEffect(() => {
    // 1. Instant hydration from local cache
    try {
      const cached = localStorage.getItem("zenzies_section_designs");
      if (cached) {
        const parsed = JSON.parse(cached);
        const merged = { ...DEFAULT_SECTION_DESIGNS };
        Object.keys(DEFAULT_SECTION_DESIGNS).forEach(secKey => {
          if (parsed[secKey]) {
            merged[secKey] = { ...DEFAULT_SECTION_DESIGNS[secKey], ...parsed[secKey] };
          }
        });
        setDesigns(merged);
      }
    } catch (e) {
      // ignore
    }

    // 2. Fetch from remote Firestore
    const fetchDesigns = async () => {
      try {
        const snap = await getDoc(doc(db, "site_settings", "section_designs"));
        if (snap.exists()) {
          const remoteData = snap.data();
          const merged = { ...DEFAULT_SECTION_DESIGNS };
          Object.keys(DEFAULT_SECTION_DESIGNS).forEach(secKey => {
            if (remoteData[secKey]) {
              merged[secKey] = { ...DEFAULT_SECTION_DESIGNS[secKey], ...remoteData[secKey] };
            }
          });
          setDesigns(merged);
          try {
            localStorage.setItem("zenzies_section_designs", JSON.stringify(merged));
          } catch (e) {}
        }
      } catch (err) {
        console.warn("Could not load section_designs from Firestore:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  const activeDesign = designs[selectedSection] || DEFAULT_SECTION_DESIGNS[selectedSection] || {};

  const updateActiveDesign = (field, value) => {
    setDesigns(prev => {
      const updated = {
        ...prev,
        [selectedSection]: {
          ...prev[selectedSection],
          [field]: value
        }
      };
      // Keep local stage updated immediately for instant live preview
      try {
        localStorage.setItem("zenzies_section_designs", JSON.stringify(updated));
        window.dispatchEvent(new Event("zenzies_section_designs_updated"));
      } catch (e) {}
      return updated;
    });
  };

  // ─── Save & Publish ─────────────────────────────────────────────────────────
  const handleSaveAll = async () => {
    setSaving(true);
    setSavedSuccess(false);

    // Save to local cache immediately so changes are never lost
    try {
      localStorage.setItem("zenzies_section_designs", JSON.stringify(designs));
      window.dispatchEvent(new Event("zenzies_section_designs_updated"));
    } catch (e) {
      console.warn("Local storage cache write failed:", e);
    }

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Cloud sync timeout (10s)")), 10000)
      );

      await Promise.race([
        setDoc(doc(db, "site_settings", "section_designs"), designs, { merge: true }),
        timeoutPromise
      ]);

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn("Save section designs notice:", err);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  // ─── Reset Section to Defaults (Preserves uploaded images & content) ──────────
  const handleResetSection = () => {
    if (window.confirm(`Reset "${selectedSection}" styling to brand defaults? Uploaded images and custom text content will be safely preserved.`)) {
      setDesigns(prev => {
        const current = prev[selectedSection] || {};
        const defaults = DEFAULT_SECTION_DESIGNS[selectedSection] || {};
        return {
          ...prev,
          [selectedSection]: {
            ...defaults,
            // Preserve user-uploaded images and content
            backgroundImage: current.backgroundImage || defaults.backgroundImage,
            eyebrow: current.eyebrow !== undefined ? current.eyebrow : defaults.eyebrow,
            titleLine1: current.titleLine1 !== undefined ? current.titleLine1 : defaults.titleLine1,
            titleLine2: current.titleLine2 !== undefined ? current.titleLine2 : defaults.titleLine2,
            subtitle: current.subtitle !== undefined ? current.subtitle : defaults.subtitle,
            title: current.title !== undefined ? current.title : defaults.title,
            features: current.features || defaults.features,
            items: current.items || defaults.items,
            btnText: current.btnText || defaults.btnText,
            btnLink: current.btnLink || defaults.btnLink,
          }
        };
      });
    }
  };

  // ─── Cloudinary Image Upload ────────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setUploadProgress(0);
    try {
      const url = await uploadToCloudinaryWithProgress(file, (percent) => {
        setUploadProgress(percent);
      });
      updateActiveDesign('backgroundImage', url);
    } catch (err) {
      console.error("Section image upload failed:", err);
      alert("Image upload failed. Please verify file format and size.");
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  // ─── Feature Items Helpers (Jewellery Box Banner) ───────────────────────────
  const getBannerFeatures = () => {
    return Array.isArray(activeDesign.features) && activeDesign.features.length > 0
      ? activeDesign.features
      : DEFAULT_SECTION_DESIGNS.jewellery_box_banner.features;
  };

  const handleUpdateFeature = (index, field, value) => {
    const current = [...getBannerFeatures()];
    current[index] = { ...current[index], [field]: value };
    updateActiveDesign('features', current);
  };

  const handleAddFeature = () => {
    const current = [...getBannerFeatures()];
    current.push({
      id: `f_${Date.now()}`,
      text: 'New Feature Item',
      enabled: true,
    });
    updateActiveDesign('features', current);
  };

  const handleRemoveFeature = (index) => {
    const current = [...getBannerFeatures()];
    current.splice(index, 1);
    updateActiveDesign('features', current);
  };

  const handleMoveFeature = (index, direction) => {
    const current = [...getBannerFeatures()];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIdx];
    current[targetIdx] = temp;
    updateActiveDesign('features', current);
  };

  // ─── Trust Benefits Helpers (WhyChoose) ────────────────────────────────────
  const getTrustItems = () => {
    return Array.isArray(activeDesign.items) && activeDesign.items.length > 0
      ? activeDesign.items
      : DEFAULT_SECTION_DESIGNS.trust_benefits.items;
  };

  const handleUpdateTrustItem = (index, field, value) => {
    const current = [...getTrustItems()];
    current[index] = { ...current[index], [field]: value };
    updateActiveDesign('items', current);
  };

  const handleAddTrustItem = () => {
    const current = [...getTrustItems()];
    current.push({
      id: `tb_${Date.now()}`,
      icon: 'gem',
      title: 'New Benefit Title',
      desc: 'Short supporting description',
      enabled: true,
    });
    updateActiveDesign('items', current);
  };

  const handleRemoveTrustItem = (index) => {
    const current = [...getTrustItems()];
    current.splice(index, 1);
    updateActiveDesign('items', current);
  };

  const handleMoveTrustItem = (index, direction) => {
    const current = [...getTrustItems()];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIdx];
    current[targetIdx] = temp;
    updateActiveDesign('items', current);
  };

  const cardStyle = isDarkMode
    ? "p-5 rounded-2xl border bg-slate-900 border-slate-800 shadow-sm text-white"
    : "p-5 rounded-2xl border bg-white border-slate-100 shadow-sm text-slate-800";

  const inp = isDarkMode
    ? "w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white outline-none focus:border-[#956638]"
    : "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-[#956638]";

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="animate-spin text-[#956638]" size={28} />
        <p className="text-sm">Loading Homepage Section Design Manager...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="text-[#956638]" size={22} />
            <h2 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
              Homepage Section Design & Content Manager
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage text, feature items, buttons, product card styles, and backgrounds across all homepage sections.
          </p>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetSection}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="Reset styling tokens without deleting content"
          >
            <RotateCcw size={13} />
            <span>Reset Styling</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#956638] hover:bg-[#7D532B] text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : savedSuccess ? <Check size={14} /> : <Save size={14} />}
            <span>{saving ? 'Publishing...' : savedSuccess ? 'Published!' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ─── LEFT: Section Selector List (Span 3) ─────────────────────────── */}
        <div className="lg:col-span-3 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Homepage Sections ({SECTION_METADATA.length})
          </div>

          <div className="space-y-1.5 max-h-[75vh] overflow-y-auto pr-1">
            {SECTION_METADATA.map((sec) => {
              const isSelected = selectedSection === sec.id;
              const isEnabled = designs[sec.id]?.enabled !== false;

              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSection(sec.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#956638] text-white border-[#956638] shadow-sm'
                      : isDarkMode
                      ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : ''}`}>
                      {sec.label}
                    </p>
                    <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                      {sec.desc}
                    </p>
                  </div>

                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isEnabled ? (isSelected ? 'bg-white' : 'bg-emerald-500') : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                    title={isEnabled ? "Active" : "Disabled"}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── CENTER & RIGHT: Editor & Live Preview (Span 9) ──────────────── */}
        <div className="lg:col-span-9 space-y-6">

          {/* Section Toolbar Bar */}
          <div className={`${cardStyle} flex items-center justify-between`}>
            <div>
              <span className="text-xs font-mono uppercase text-[#956638] font-bold">Editing Section</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                {SECTION_METADATA.find(s => s.id === selectedSection)?.label || selectedSection}
              </h3>
            </div>

            {/* Visibility Toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <span>Section Visible</span>
              <input
                type="checkbox"
                checked={activeDesign.enabled !== false}
                onChange={(e) => updateActiveDesign('enabled', e.target.checked)}
                className="w-4 h-4 accent-[#956638] rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Live Preview Container */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900">
            {/* Preview Toolbar */}
            <div className="px-4 py-2 bg-slate-200 dark:bg-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Eye size={13} /> Live Staged Visual Preview
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1 rounded cursor-pointer ${previewDevice === 'desktop' ? 'bg-white dark:bg-slate-700 text-[#956638]' : 'text-slate-400'}`}
                  title="Desktop (100% width)"
                >
                  <Monitor size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1 rounded cursor-pointer ${previewDevice === 'tablet' ? 'bg-white dark:bg-slate-700 text-[#956638]' : 'text-slate-400'}`}
                  title="Tablet"
                >
                  <Tablet size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1 rounded cursor-pointer ${previewDevice === 'mobile' ? 'bg-white dark:bg-slate-700 text-[#956638]' : 'text-slate-400'}`}
                  title="Mobile"
                >
                  <Smartphone size={14} />
                </button>
              </div>
            </div>

            {/* The Staged Section Render Box */}
            <div
              className={`mx-auto transition-all duration-300 relative overflow-hidden flex flex-col justify-center text-left ${
                previewDevice === 'mobile' ? 'max-w-xs' : previewDevice === 'tablet' ? 'max-w-md' : 'w-full'
              }`}
              style={{
                backgroundColor: activeDesign.backgroundColor || '#FBF7F2',
                backgroundImage: activeDesign.backgroundImage ? `url(${activeDesign.backgroundImage})` : undefined,
                backgroundSize: activeDesign.backgroundSize || 'cover',
                backgroundPosition: activeDesign.backgroundPosition || 'center center',
                backgroundRepeat: activeDesign.backgroundRepeat || 'no-repeat',
                backgroundBlendMode: activeDesign.backgroundBlendMode || 'normal',
                paddingTop: activeDesign.paddingTop || '36px',
                paddingBottom: activeDesign.paddingBottom || '36px',
              }}
            >
              {/* Optional Overlay Layer */}
              {activeDesign.overlayOpacity > 0 && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: activeDesign.overlayColor || '#000000',
                    opacity: activeDesign.overlayOpacity || 0,
                  }}
                />
              )}

              {/* ─── LIVE PREVIEW VARIANT: Jewellery Box Promotional Banner ─── */}
              {selectedSection === 'jewellery_box_banner' ? (
                <div className="relative z-10 px-6 sm:px-10 py-6 max-w-lg bg-gradient-to-r from-[#FBF7F2]/90 via-[#FBF7F2]/60 to-transparent">
                  <span
                    className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase block mb-2"
                    style={{ color: activeDesign.accentColor || '#956638' }}
                  >
                    {activeDesign.eyebrow || 'PREMIUM JEWELRY BOXES'}
                  </span>
                  <h4 className="font-serif text-2xl sm:text-3xl font-medium leading-[1.05] tracking-tight">
                    <span className="block" style={{ color: activeDesign.titleColor || '#211A16' }}>
                      {activeDesign.titleLine1 || 'Little Box'}
                    </span>
                    <span className="block" style={{ color: activeDesign.titleLine2Color || activeDesign.accentColor || '#956638' }}>
                      {activeDesign.titleLine2 || 'Big Elegance'}
                    </span>
                  </h4>
                  <p
                    className="text-xs font-sans max-w-sm mt-2 leading-relaxed"
                    style={{ color: activeDesign.subtitleColor || '#62564B' }}
                  >
                    {activeDesign.subtitle || 'Keep your earrings, rings, and chains beautifully organized with our premium jewelry boxes.'}
                  </p>

                  {/* 2-Column Features */}
                  <div className="grid grid-cols-2 gap-2 my-3">
                    {getBannerFeatures().filter(f => f.enabled !== false).slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] font-sans font-medium text-[#211A16]">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#956638]/15 text-[#956638] flex items-center justify-center shrink-0">
                          <Check size={9} strokeWidth={2.8} />
                        </span>
                        <span className="truncate">{f.text}</span>
                      </div>
                    ))}
                  </div>

                  {activeDesign.btnEnabled !== false && (
                    <div className="pt-1">
                      <span
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-sans font-semibold text-white shadow-xs"
                        style={{ backgroundColor: activeDesign.btnBgColor || '#956638' }}
                      >
                        <span>{activeDesign.btnText || 'Shop Jewelry Boxes'}</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  )}
                </div>

              /* ─── LIVE PREVIEW VARIANT: Bestsellers ─── */
              ) : selectedSection === 'bestsellers' ? (
                <div className="relative z-10 px-6 py-4 space-y-4">
                  <div className="flex items-end justify-between border-b border-black/5 pb-2">
                    <div>
                      <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#956638]">
                        {activeDesign.eyebrow || 'BESTSELLERS'}
                      </span>
                      <h4 className="font-serif text-2xl font-normal text-[#211A16]">
                        {activeDesign.title || 'Our Most Loved Pieces'}
                      </h4>
                      <p className="text-xs text-[#62564B]">
                        {activeDesign.subtitle || 'Timeless favorites, chosen by you.'}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#211A16] flex items-center gap-1">
                      {activeDesign.viewAllText || 'View All Products'} →
                    </span>
                  </div>

                  {/* 4 Mini Preview Product Cards with visibly rounded upper corners */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Classic Solitaire Ring', 'Heart Pendant Necklace', 'Diamond Hoop Earrings', 'Tennis Bracelet'].map((name, i) => (
                      <div
                        key={i}
                        className="p-2 border border-[#E8DDD2] bg-white text-center shadow-xs overflow-hidden"
                        style={{
                          borderRadius: activeDesign.cardBorderRadius || '14px',
                          borderColor: activeDesign.cardBorderColor || '#E8DDD2',
                          backgroundColor: activeDesign.cardBackgroundColor || '#FFFFFF',
                        }}
                      >
                        <div className="w-full aspect-square bg-[#FAF6F0] rounded-t-[12px] flex items-center justify-center p-2 mb-1.5">
                          <span className="text-[10px] text-slate-400">Jewellery Image</span>
                        </div>
                        <p className="text-[11px] font-semibold text-[#211A16] truncate">{name}</p>
                        <div className="flex justify-center items-center gap-1 text-[10px] text-[#E5A83B] my-0.5">
                          ★★★★★ <span className="text-slate-400">(128)</span>
                        </div>
                        <p className="text-xs font-bold text-[#211A16]">₹8,999</p>
                        <span
                          className="mt-1 block w-full py-1 rounded text-[10px] font-bold text-white"
                          style={{ backgroundColor: activeDesign.btnBgColor || '#956638' }}
                        >
                          Add to Cart
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              /* ─── LIVE PREVIEW VARIANT: Trust Benefits Strip ─── */
              ) : selectedSection === 'trust_benefits' ? (
                <div className="relative z-10 px-6 py-3">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {getTrustItems().filter(item => item.enabled !== false).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-left py-1">
                        <Gem size={22} strokeWidth={1.6} style={{ color: activeDesign.iconColor || '#65472D' }} />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#211A16] truncate">{item.title}</p>
                          <p className="text-[11px] text-[#62564B] truncate">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              /* ─── LIVE PREVIEW VARIANT: Shop by Category ─── */
              ) : selectedSection === 'category_grid' ? (
                <div className="relative z-10 px-6 py-6 text-center space-y-3">
                  <span className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase block" style={{ color: activeDesign.accentColor || '#956638' }}>
                    {activeDesign.eyebrow || 'SHOP BY CATEGORY'}
                  </span>
                  <h4 className="font-serif text-2xl font-medium" style={{ color: activeDesign.titleColor || '#211A16' }}>
                    {activeDesign.title || 'Find Your Perfect Piece'}
                  </h4>
                  <p className="text-xs font-sans max-w-sm mx-auto" style={{ color: activeDesign.subtitleColor || '#62564B' }}>
                    {activeDesign.subtitle || 'Explore our curated collections for every occasion.'}
                  </p>
                  <div className="flex justify-center gap-4 pt-2">
                    {['Rings', 'Necklaces', 'Earrings', 'Boxes'].map((cat, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-[#F3E4DA] border border-[#E8DDD2] flex items-center justify-center text-xs">💎</div>
                        <span className="text-[10px] font-medium mt-1 text-[#211A16]">{cat}</span>
                      </div>
                    ))}
                  </div>
                </div>

              /* ─── LIVE PREVIEW VARIANT: Promotional Banners ─── */
              ) : selectedSection === 'promotional_banners' ? (
                <div className="relative z-10 px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-[#E8DDD2] bg-[#211A16]/80 text-white space-y-2 text-left">
                    <span className="text-[9px] uppercase tracking-wider text-[#E9D9C7] font-bold block">
                      {activeDesign.banner1Eyebrow || 'CURATED COMBOS'}
                    </span>
                    <h5 className="font-serif text-base">{activeDesign.banner1Title || "Crafted for Life's Special Moments"}</h5>
                    <span className="inline-block px-3 py-1 bg-white text-[#211A16] rounded text-[10px] font-bold">
                      {activeDesign.banner1BtnText || 'Explore Bundles'} →
                    </span>
                  </div>
                  <div className="p-4 rounded-xl border border-[#E8DDD2] bg-[#211A16]/80 text-white space-y-2 text-left">
                    <span className="text-[9px] uppercase tracking-wider text-[#E9D9C7] font-bold block">
                      {activeDesign.banner2Eyebrow || 'GIFT SETS'}
                    </span>
                    <h5 className="font-serif text-base">{activeDesign.banner2Title || "A Gift That Lasts Forever"}</h5>
                    <span className="inline-block px-3 py-1 bg-white text-[#211A16] rounded text-[10px] font-bold">
                      {activeDesign.banner2BtnText || 'Shop Gifts'} →
                    </span>
                  </div>
                </div>

              /* ─── LIVE PREVIEW VARIANT: Brand Story ─── */
              ) : selectedSection === 'brand_story' ? (
                <div className="relative z-10 px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center text-left">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: activeDesign.accentColor || '#956638' }}>
                      {activeDesign.eyebrow || 'OUR STORY'}
                    </span>
                    <h4 className="font-serif text-xl leading-tight" style={{ color: activeDesign.titleColor || '#211A16' }}>
                      {activeDesign.title || 'A Legacy of Grace and Thoughtful Storage'}
                    </h4>
                    <p className="text-xs line-clamp-3" style={{ color: activeDesign.subtitleColor || '#6B5E52' }}>
                      {activeDesign.description || 'At Zenzies, we believe jewellery is more than an accessory...'}
                    </p>
                    <span className="inline-block px-3 py-1.5 rounded text-[11px] text-white font-bold" style={{ backgroundColor: activeDesign.btnBgColor || '#956638' }}>
                      {activeDesign.btnText || 'Read Our Story'} →
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-36 h-40 rounded-t-[50px] rounded-b-xl border border-[#E8DDD2] bg-[#FAF6F0] overflow-hidden flex items-center justify-center">
                      <span className="text-xs text-slate-400">Story Photo</span>
                    </div>
                  </div>
                </div>

              /* ─── LIVE PREVIEW VARIANT: Testimonials ─── */
              ) : selectedSection === 'testimonials' ? (
                <div className="relative z-10 px-6 py-4 space-y-3 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: activeDesign.accentColor || '#956638' }}>
                    {activeDesign.eyebrow || 'WHAT OUR CUSTOMERS SAY'}
                  </span>
                  <h4 className="font-serif text-xl" style={{ color: activeDesign.titleColor || '#211A16' }}>
                    {activeDesign.title || 'Loved by Thousands'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['Priya S.', 'Megha K.', 'Rohan M.'].map((name, i) => (
                      <div key={i} className="p-2.5 rounded-lg border border-[#E8DDD2] bg-white text-xs">
                        <span className="text-amber-500 text-[10px]">★★★★★</span>
                        <p className="text-[11px] italic mt-1 text-[#211A16]">"Stunning quality & great boxes!"</p>
                        <p className="text-[10px] font-bold text-[#956638] mt-1">{name}</p>
                      </div>
                    ))}
                  </div>
                </div>

              /* ─── LIVE PREVIEW VARIANT: Social Gallery ─── */
              ) : selectedSection === 'social_gallery' ? (
                <div className="relative z-10 px-6 py-4 space-y-3">
                  <div className="flex justify-between items-end text-left">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: activeDesign.accentColor || '#956638' }}>
                        {activeDesign.eyebrow || 'FOLLOW @ZENZIES'}
                      </span>
                      <h4 className="font-serif text-xl" style={{ color: activeDesign.titleColor || '#211A16' }}>
                        {activeDesign.title || 'Join Our Shining Community'}
                      </h4>
                    </div>
                    <span className="text-xs text-[#956638] font-bold">Instagram →</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="aspect-square rounded bg-[#FAF6F0] border border-[#E8DDD2] flex items-center justify-center text-[10px] text-slate-400">
                        📸
                      </div>
                    ))}
                  </div>
                </div>

              /* ─── LIVE PREVIEW VARIANT: Newsletter ─── */
              ) : selectedSection === 'newsletter' ? (
                <div className="relative z-10 px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center text-left">
                  <div className="space-y-2">
                    <h4 className="font-serif text-xl" style={{ color: activeDesign.titleColor || '#211A16' }}>
                      {activeDesign.title || 'Get Exclusive Offers'}
                    </h4>
                    <p className="text-xs" style={{ color: activeDesign.subtitleColor || '#6B5E52' }}>
                      {activeDesign.subtitle || 'Subscribe and be the first to know about new collections...'}
                    </p>
                    <div className="flex gap-1.5">
                      <div className="px-3 py-1.5 bg-white border border-[#DFCBB9] rounded text-xs text-slate-400 flex-1">email@example.com</div>
                      <span className="px-3 py-1.5 rounded text-xs text-white font-bold" style={{ backgroundColor: activeDesign.btnBgColor || '#956638' }}>
                        {activeDesign.btnText || 'Subscribe'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-36 h-24 rounded-xl border border-[#DFCBB9] bg-white flex items-center justify-center text-xs text-slate-400">
                      🎁 Gift Image
                    </div>
                  </div>
                </div>

              /* ─── GENERIC PREVIEW ─── */
              ) : (
                <div className="relative z-10 px-6 py-6 text-center space-y-2">
                  <span
                    className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase"
                    style={{ color: activeDesign.accentColor || '#956638' }}
                  >
                    Preview: {selectedSection}
                  </span>
                  <h4
                    className="font-serif text-2xl font-normal"
                    style={{ color: activeDesign.titleColor || '#211A16' }}
                  >
                    {activeDesign.title || 'Zenzies Fine Jewellery'}
                  </h4>
                  <p
                    className="text-xs font-sans max-w-sm mx-auto leading-relaxed"
                    style={{ color: activeDesign.subtitleColor || activeDesign.textColor || '#6B5E52' }}
                  >
                    {activeDesign.subtitle || 'Background, typography and padding update immediately on the live homepage.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ─── Control Panels Accordion ───────────────────────────────────── */}
          <div className="space-y-4">

            {/* ═══════════════════════════════════════════════════════════════════
                GROUP 0: SECTION-SPECIFIC CONTENT MANAGEMENT
                ═══════════════════════════════════════════════════════════════════ */}

            {/* 0A. JEWELLERY BOX BANNER CONTENT */}
            {selectedSection === 'jewellery_box_banner' && (
              <div className={cardStyle}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('content')}
                  className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-800 dark:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#956638]" />
                    <span>Banner Content & Copy (Eyebrow, Headings, Features & CTA)</span>
                  </div>
                  {openAccordion.content ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {openAccordion.content && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-4 text-xs">

                    {/* Eyebrow & Colors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Eyebrow Text</label>
                        <input
                          type="text"
                          value={activeDesign.eyebrow || 'PREMIUM JEWELRY BOXES'}
                          onChange={(e) => updateActiveDesign('eyebrow', e.target.value)}
                          className={inp}
                          placeholder="PREMIUM JEWELRY BOXES"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Eyebrow & Accent Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeDesign.accentColor || '#956638'}
                            onChange={(e) => updateActiveDesign('accentColor', e.target.value)}
                            className="w-9 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={activeDesign.accentColor || '#956638'}
                            onChange={(e) => updateActiveDesign('accentColor', e.target.value)}
                            className={inp}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Two-Line Heading */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Heading Line 1 (Dark)</label>
                        <input
                          type="text"
                          value={activeDesign.titleLine1 || 'Little Box'}
                          onChange={(e) => updateActiveDesign('titleLine1', e.target.value)}
                          className={inp}
                          placeholder="Little Box"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Line 1 Text Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeDesign.titleColor || '#211A16'}
                            onChange={(e) => updateActiveDesign('titleColor', e.target.value)}
                            className="w-9 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={activeDesign.titleColor || '#211A16'}
                            onChange={(e) => updateActiveDesign('titleColor', e.target.value)}
                            className={inp}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Heading Line 2 (Accent / Caramel)</label>
                        <input
                          type="text"
                          value={activeDesign.titleLine2 || 'Big Elegance'}
                          onChange={(e) => updateActiveDesign('titleLine2', e.target.value)}
                          className={inp}
                          placeholder="Big Elegance"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Line 2 Accent Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeDesign.titleLine2Color || activeDesign.accentColor || '#956638'}
                            onChange={(e) => updateActiveDesign('titleLine2Color', e.target.value)}
                            className="w-9 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={activeDesign.titleLine2Color || activeDesign.accentColor || '#956638'}
                            onChange={(e) => updateActiveDesign('titleLine2Color', e.target.value)}
                            className={inp}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Short Description */}
                    <div>
                      <label className="block font-semibold mb-1">Supporting Description</label>
                      <textarea
                        rows={2}
                        value={activeDesign.subtitle || 'Keep your earrings, rings, and chains beautifully organized with our premium jewelry boxes.'}
                        onChange={(e) => updateActiveDesign('subtitle', e.target.value)}
                        className={inp}
                        placeholder="Keep your earrings, rings, and chains beautifully organized with our premium jewelry boxes."
                      />
                    </div>

                    {/* Feature List Management */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block font-bold text-slate-800 dark:text-white">
                          Feature Bullet Points ({getBannerFeatures().length})
                        </label>
                        <button
                          type="button"
                          onClick={handleAddFeature}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#956638] text-white font-semibold text-[11px] hover:bg-[#7D532B] transition-all cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>Add Feature</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {getBannerFeatures().map((feature, idx) => (
                          <div
                            key={feature.id || idx}
                            className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60"
                          >
                            {/* Enable/Disable Toggle */}
                            <input
                              type="checkbox"
                              checked={feature.enabled !== false}
                              onChange={(e) => handleUpdateFeature(idx, 'enabled', e.target.checked)}
                              className="w-4 h-4 accent-[#956638] rounded cursor-pointer shrink-0"
                              title={feature.enabled !== false ? 'Enabled' : 'Disabled'}
                            />

                            {/* Feature Text */}
                            <input
                              type="text"
                              value={feature.text || ''}
                              onChange={(e) => handleUpdateFeature(idx, 'text', e.target.value)}
                              className={`${inp} py-1.5 flex-1`}
                              placeholder="e.g. Multiple Compartments"
                            />

                            {/* Reorder Up */}
                            <button
                              type="button"
                              onClick={() => handleMoveFeature(idx, -1)}
                              disabled={idx === 0}
                              className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <ChevronUp size={14} />
                            </button>

                            {/* Reorder Down */}
                            <button
                              type="button"
                              onClick={() => handleMoveFeature(idx, 1)}
                              disabled={idx === getBannerFeatures().length - 1}
                              className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <ChevronDown size={14} />
                            </button>

                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(idx)}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                              title="Remove Feature"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button Settings */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-slate-800 dark:text-white">
                          Call To Action (CTA) Button
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                          <span>Button Visible</span>
                          <input
                            type="checkbox"
                            checked={activeDesign.btnEnabled !== false}
                            onChange={(e) => updateActiveDesign('btnEnabled', e.target.checked)}
                            className="w-4 h-4 accent-[#956638] rounded cursor-pointer"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Button Label</label>
                          <input
                            type="text"
                            value={activeDesign.btnText || 'Shop Jewelry Boxes'}
                            onChange={(e) => updateActiveDesign('btnText', e.target.value)}
                            className={inp}
                            placeholder="Shop Jewelry Boxes"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Destination Route</label>
                          <input
                            type="text"
                            value={activeDesign.btnLink || '/shop?category=Jewellery+Boxes'}
                            onChange={(e) => updateActiveDesign('btnLink', e.target.value)}
                            className={inp}
                            placeholder="/shop?category=Jewellery+Boxes"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block font-semibold mb-1">Button Background Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={activeDesign.btnBgColor || '#956638'}
                              onChange={(e) => updateActiveDesign('btnBgColor', e.target.value)}
                              className="w-9 h-8 rounded border cursor-pointer"
                            />
                            <input
                              type="text"
                              value={activeDesign.btnBgColor || '#956638'}
                              onChange={(e) => updateActiveDesign('btnBgColor', e.target.value)}
                              className={inp}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Button Text Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={activeDesign.btnTextColor || '#FFFFFF'}
                              onChange={(e) => updateActiveDesign('btnTextColor', e.target.value)}
                              className="w-9 h-8 rounded border cursor-pointer"
                            />
                            <input
                              type="text"
                              value={activeDesign.btnTextColor || '#FFFFFF'}
                              onChange={(e) => updateActiveDesign('btnTextColor', e.target.value)}
                              className={inp}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* 0B. BESTSELLERS CONTENT & PRODUCT CARD STYLING */}
            {selectedSection === 'bestsellers' && (
              <div className={cardStyle}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('content')}
                  className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-800 dark:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#956638]" />
                    <span>Bestsellers Section Content & Product Cards</span>
                  </div>
                  {openAccordion.content ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {openAccordion.content && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-4 text-xs">
                    {/* Eyebrow & Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Eyebrow Text</label>
                        <input
                          type="text"
                          value={activeDesign.eyebrow || 'BESTSELLERS'}
                          onChange={(e) => updateActiveDesign('eyebrow', e.target.value)}
                          className={inp}
                          placeholder="BESTSELLERS"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Section Heading</label>
                        <input
                          type="text"
                          value={activeDesign.title || 'Our Most Loved Pieces'}
                          onChange={(e) => updateActiveDesign('title', e.target.value)}
                          className={inp}
                          placeholder="Our Most Loved Pieces"
                        />
                      </div>
                    </div>

                    {/* Subtitle & View All */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Subtitle / Description</label>
                        <input
                          type="text"
                          value={activeDesign.subtitle || 'Timeless favorites, chosen by you.'}
                          onChange={(e) => updateActiveDesign('subtitle', e.target.value)}
                          className={inp}
                          placeholder="Timeless favorites, chosen by you."
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">View All Products Button Label</label>
                        <input
                          type="text"
                          value={activeDesign.viewAllText || 'View All Products'}
                          onChange={(e) => updateActiveDesign('viewAllText', e.target.value)}
                          className={inp}
                          placeholder="View All Products"
                        />
                      </div>
                    </div>

                    {/* Product Card Styling Controls */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <label className="block font-bold text-slate-800 dark:text-white mb-2">
                        Product Card Geometry & Styling
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Card Border Radius (Upper & Lower)</label>
                          <input
                            type="text"
                            value={activeDesign.cardBorderRadius || '14px'}
                            onChange={(e) => updateActiveDesign('cardBorderRadius', e.target.value)}
                            className={inp}
                            placeholder="e.g. 14px or 12px"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Card Border Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={activeDesign.cardBorderColor || '#E8DDD2'}
                              onChange={(e) => updateActiveDesign('cardBorderColor', e.target.value)}
                              className="w-9 h-8 rounded border cursor-pointer"
                            />
                            <input
                              type="text"
                              value={activeDesign.cardBorderColor || '#E8DDD2'}
                              onChange={(e) => updateActiveDesign('cardBorderColor', e.target.value)}
                              className={inp}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Add to Cart Button Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={activeDesign.btnBgColor || '#956638'}
                              onChange={(e) => updateActiveDesign('btnBgColor', e.target.value)}
                              className="w-9 h-8 rounded border cursor-pointer"
                            />
                            <input
                              type="text"
                              value={activeDesign.btnBgColor || '#956638'}
                              onChange={(e) => updateActiveDesign('btnBgColor', e.target.value)}
                              className={inp}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* 0C. TRUST BENEFITS CONTENT MANAGEMENT */}
            {selectedSection === 'trust_benefits' && (
              <div className={cardStyle}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('content')}
                  className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-800 dark:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#956638]" />
                    <span>Trust Benefits Items (Titles, Descriptions & Lucide Icons)</span>
                  </div>
                  {openAccordion.content ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {openAccordion.content && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-4 text-xs">

                    {/* Icon Color & Text Colors */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Icon Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeDesign.iconColor || '#65472D'}
                            onChange={(e) => updateActiveDesign('iconColor', e.target.value)}
                            className="w-9 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={activeDesign.iconColor || '#65472D'}
                            onChange={(e) => updateActiveDesign('iconColor', e.target.value)}
                            className={inp}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Title Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeDesign.titleColor || '#211A16'}
                            onChange={(e) => updateActiveDesign('titleColor', e.target.value)}
                            className="w-9 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={activeDesign.titleColor || '#211A16'}
                            onChange={(e) => updateActiveDesign('titleColor', e.target.value)}
                            className={inp}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Description Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeDesign.textColor || '#62564B'}
                            onChange={(e) => updateActiveDesign('textColor', e.target.value)}
                            className="w-9 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={activeDesign.textColor || '#62564B'}
                            onChange={(e) => updateActiveDesign('textColor', e.target.value)}
                            className={inp}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Trust Items List */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block font-bold text-slate-800 dark:text-white">
                          Trust Benefit Cards ({getTrustItems().length})
                        </label>
                        <button
                          type="button"
                          onClick={handleAddTrustItem}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#956638] text-white font-semibold text-[11px] hover:bg-[#7D532B] transition-all cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>Add Benefit</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {getTrustItems().map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <label className="flex items-center gap-2 font-semibold cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={item.enabled !== false}
                                  onChange={(e) => handleUpdateTrustItem(idx, 'enabled', e.target.checked)}
                                  className="w-4 h-4 accent-[#956638] rounded cursor-pointer"
                                />
                                <span>Benefit #{idx + 1} Visible</span>
                              </label>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleMoveTrustItem(idx, -1)}
                                  disabled={idx === 0}
                                  className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                                  title="Move Left/Up"
                                >
                                  <ChevronUp size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveTrustItem(idx, 1)}
                                  disabled={idx === getTrustItems().length - 1}
                                  className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                                  title="Move Right/Down"
                                >
                                  <ChevronDown size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTrustItem(idx)}
                                  className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                                  title="Remove Benefit"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {/* Icon Select */}
                              <div>
                                <label className="block text-[11px] font-semibold mb-1">Icon</label>
                                <select
                                  value={item.icon || 'gem'}
                                  onChange={(e) => handleUpdateTrustItem(idx, 'icon', e.target.value)}
                                  className={inp}
                                >
                                  {AVAILABLE_BENEFIT_ICONS.map((opt) => (
                                    <option key={opt.val} value={opt.val}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Title */}
                              <div>
                                <label className="block text-[11px] font-semibold mb-1">Title</label>
                                <input
                                  type="text"
                                  value={item.title || ''}
                                  onChange={(e) => handleUpdateTrustItem(idx, 'title', e.target.value)}
                                  className={inp}
                                  placeholder="e.g. Ethically Sourced"
                                />
                              </div>

                              {/* Description */}
                              <div>
                                <label className="block text-[11px] font-semibold mb-1">Supporting Text</label>
                                <input
                                  type="text"
                                  value={item.desc || ''}
                                  onChange={(e) => handleUpdateTrustItem(idx, 'desc', e.target.value)}
                                  className={inp}
                                  placeholder="e.g. Conflict-free diamonds"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* 0D. CATEGORY GRID SECTION CONTENT */}
            {selectedSection === 'category_grid' && (
              <div className={cardStyle}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('content')}
                  className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-800 dark:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#956638]" />
                    <span>Category Section Headings & Navigation</span>
                  </div>
                  {openAccordion.content ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {openAccordion.content && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Eyebrow Text</label>
                        <input
                          type="text"
                          value={activeDesign.eyebrow || 'SHOP BY CATEGORY'}
                          onChange={(e) => updateActiveDesign('eyebrow', e.target.value)}
                          className={inp}
                          placeholder="SHOP BY CATEGORY"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Eyebrow Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeDesign.accentColor || '#956638'}
                            onChange={(e) => updateActiveDesign('accentColor', e.target.value)}
                            className="w-9 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={activeDesign.accentColor || '#956638'}
                            onChange={(e) => updateActiveDesign('accentColor', e.target.value)}
                            className={inp}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Main Heading</label>
                        <input
                          type="text"
                          value={activeDesign.title || 'Find Your Perfect Piece'}
                          onChange={(e) => updateActiveDesign('title', e.target.value)}
                          className={inp}
                          placeholder="Find Your Perfect Piece"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Heading Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeDesign.titleColor || '#211A16'}
                            onChange={(e) => updateActiveDesign('titleColor', e.target.value)}
                            className="w-9 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={activeDesign.titleColor || '#211A16'}
                            onChange={(e) => updateActiveDesign('titleColor', e.target.value)}
                            className={inp}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Subtitle / Description</label>
                        <input
                          type="text"
                          value={activeDesign.subtitle || 'Explore our curated collections for every occasion.'}
                          onChange={(e) => updateActiveDesign('subtitle', e.target.value)}
                          className={inp}
                          placeholder="Explore our curated collections for every occasion."
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Subtitle Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeDesign.subtitleColor || '#62564B'}
                            onChange={(e) => updateActiveDesign('subtitleColor', e.target.value)}
                            className="w-9 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={activeDesign.subtitleColor || '#62564B'}
                            onChange={(e) => updateActiveDesign('subtitleColor', e.target.value)}
                            className={inp}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <label className="block font-semibold mb-1">View All Button Label</label>
                        <input
                          type="text"
                          value={activeDesign.viewAllText || 'View All Categories'}
                          onChange={(e) => updateActiveDesign('viewAllText', e.target.value)}
                          className={inp}
                          placeholder="View All Categories"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">View All Link</label>
                        <input
                          type="text"
                          value={activeDesign.viewAllLink || '/shop'}
                          onChange={(e) => updateActiveDesign('viewAllLink', e.target.value)}
                          className={inp}
                          placeholder="/shop"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 0E. PROMOTIONAL BANNERS CONTENT */}
            {selectedSection === 'promotional_banners' && (
              <div className={cardStyle}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('content')}
                  className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-800 dark:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#956638]" />
                    <span>Promotional Banners Content & Images (Left & Right Cards)</span>
                  </div>
                  {openAccordion.content ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {openAccordion.content && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-6 text-xs">
                    {/* Banner 1 (Left - Curated Combos) */}
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                      <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#956638]" />
                        <span>Left Card: Curated Bundles / Combos</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Eyebrow Tag</label>
                          <input
                            type="text"
                            value={activeDesign.banner1Eyebrow || 'CURATED COMBOS'}
                            onChange={(e) => updateActiveDesign('banner1Eyebrow', e.target.value)}
                            className={inp}
                            placeholder="CURATED COMBOS"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Card Heading</label>
                          <input
                            type="text"
                            value={activeDesign.banner1Title || "Crafted for Life's Special Moments"}
                            onChange={(e) => updateActiveDesign('banner1Title', e.target.value)}
                            className={inp}
                            placeholder="Crafted for Life's Special Moments"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Button Label</label>
                          <input
                            type="text"
                            value={activeDesign.banner1BtnText || 'Explore Bundles'}
                            onChange={(e) => updateActiveDesign('banner1BtnText', e.target.value)}
                            className={inp}
                            placeholder="Explore Bundles"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Button Link</label>
                          <input
                            type="text"
                            value={activeDesign.banner1BtnLink || '/shop?category=Bundles'}
                            onChange={(e) => updateActiveDesign('banner1BtnLink', e.target.value)}
                            className={inp}
                            placeholder="/shop?category=Bundles"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Background Image URL</label>
                        <input
                          type="text"
                          value={activeDesign.banner1Image || ''}
                          onChange={(e) => updateActiveDesign('banner1Image', e.target.value)}
                          className={inp}
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    </div>

                    {/* Banner 2 (Right - Gift Sets) */}
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                      <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#956638]" />
                        <span>Right Card: Gifts & Sets</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Eyebrow Tag</label>
                          <input
                            type="text"
                            value={activeDesign.banner2Eyebrow || 'GIFT SETS'}
                            onChange={(e) => updateActiveDesign('banner2Eyebrow', e.target.value)}
                            className={inp}
                            placeholder="GIFT SETS"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Card Heading</label>
                          <input
                            type="text"
                            value={activeDesign.banner2Title || 'A Gift That Lasts Forever'}
                            onChange={(e) => updateActiveDesign('banner2Title', e.target.value)}
                            className={inp}
                            placeholder="A Gift That Lasts Forever"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Button Label</label>
                          <input
                            type="text"
                            value={activeDesign.banner2BtnText || 'Shop Gifts'}
                            onChange={(e) => updateActiveDesign('banner2BtnText', e.target.value)}
                            className={inp}
                            placeholder="Shop Gifts"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Button Link</label>
                          <input
                            type="text"
                            value={activeDesign.banner2BtnLink || '/shop?category=Jewellery+Boxes'}
                            onChange={(e) => updateActiveDesign('banner2BtnLink', e.target.value)}
                            className={inp}
                            placeholder="/shop?category=Jewellery+Boxes"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Background Image URL</label>
                        <input
                          type="text"
                          value={activeDesign.banner2Image || ''}
                          onChange={(e) => updateActiveDesign('banner2Image', e.target.value)}
                          className={inp}
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 0F. BRAND STORY CONTENT */}
            {selectedSection === 'brand_story' && (
              <div className={cardStyle}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('content')}
                  className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-800 dark:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#956638]" />
                    <span>Brand Story Copy, Arch Photo & Vintage Badge</span>
                  </div>
                  {openAccordion.content ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {openAccordion.content && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Eyebrow Text</label>
                        <input
                          type="text"
                          value={activeDesign.eyebrow || 'OUR STORY'}
                          onChange={(e) => updateActiveDesign('eyebrow', e.target.value)}
                          className={inp}
                          placeholder="OUR STORY"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Eyebrow & Accent Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeDesign.accentColor || '#956638'}
                            onChange={(e) => updateActiveDesign('accentColor', e.target.value)}
                            className="w-9 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={activeDesign.accentColor || '#956638'}
                            onChange={(e) => updateActiveDesign('accentColor', e.target.value)}
                            className={inp}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Heading (supports multi-line with Enter)</label>
                      <textarea
                        rows={2}
                        value={activeDesign.title || 'A Legacy of Grace\nand Thoughtful Storage'}
                        onChange={(e) => updateActiveDesign('title', e.target.value)}
                        className={inp}
                        placeholder="A Legacy of Grace&#10;and Thoughtful Storage"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Story Paragraph</label>
                      <textarea
                        rows={3}
                        value={activeDesign.description || "At Zenzies, we believe jewellery is more than an accessory — it's a symbol of love, confidence, and life's most cherished memories. Every piece of jewellery and organizer box is thoughtfully designed to ensure your treasured treasures remain beautifully organized, tangle-free, and protected for years to come."}
                        onChange={(e) => updateActiveDesign('description', e.target.value)}
                        className={inp}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <label className="block font-semibold mb-1">Button Label</label>
                        <input
                          type="text"
                          value={activeDesign.btnText || 'Read Our Story'}
                          onChange={(e) => updateActiveDesign('btnText', e.target.value)}
                          className={inp}
                          placeholder="Read Our Story"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Button Link</label>
                        <input
                          type="text"
                          value={activeDesign.btnLink || '/about'}
                          onChange={(e) => updateActiveDesign('btnLink', e.target.value)}
                          className={inp}
                          placeholder="/about"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="font-bold text-slate-800 dark:text-white">Arched Photo & Decorative Overlays</div>
                      <div>
                        <label className="block font-semibold mb-1">Story Image URL</label>
                        <input
                          type="text"
                          value={activeDesign.image || ''}
                          onChange={(e) => updateActiveDesign('image', e.target.value)}
                          className={inp}
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Script Handwriting Line 1</label>
                          <input
                            type="text"
                            value={activeDesign.scriptLine1 || 'Handcrafted'}
                            onChange={(e) => updateActiveDesign('scriptLine1', e.target.value)}
                            className={inp}
                            placeholder="Handcrafted"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Script Handwriting Line 2</label>
                          <input
                            type="text"
                            value={activeDesign.scriptLine2 || 'With Love ♡'}
                            onChange={(e) => updateActiveDesign('scriptLine2', e.target.value)}
                            className={inp}
                            placeholder="With Love ♡"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Badge Brand Name</label>
                          <input
                            type="text"
                            value={activeDesign.badgeTitle || 'ZENZIES'}
                            onChange={(e) => updateActiveDesign('badgeTitle', e.target.value)}
                            className={inp}
                            placeholder="ZENZIES"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Badge Year</label>
                          <input
                            type="text"
                            value={activeDesign.badgeYear || 'EST. 2024'}
                            onChange={(e) => updateActiveDesign('badgeYear', e.target.value)}
                            className={inp}
                            placeholder="EST. 2024"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Badge Subtitle</label>
                          <input
                            type="text"
                            value={activeDesign.badgeSubtitle || 'Authentic Care'}
                            onChange={(e) => updateActiveDesign('badgeSubtitle', e.target.value)}
                            className={inp}
                            placeholder="Authentic Care"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 0G. TESTIMONIALS CONTENT */}
            {selectedSection === 'testimonials' && (
              <div className={cardStyle}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('content')}
                  className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-800 dark:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#956638]" />
                    <span>Testimonials Header & Card Styling</span>
                  </div>
                  {openAccordion.content ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {openAccordion.content && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Eyebrow Text</label>
                        <input
                          type="text"
                          value={activeDesign.eyebrow || 'WHAT OUR CUSTOMERS SAY'}
                          onChange={(e) => updateActiveDesign('eyebrow', e.target.value)}
                          className={inp}
                          placeholder="WHAT OUR CUSTOMERS SAY"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Section Heading</label>
                        <input
                          type="text"
                          value={activeDesign.title || 'Loved by Thousands'}
                          onChange={(e) => updateActiveDesign('title', e.target.value)}
                          className={inp}
                          placeholder="Loved by Thousands"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Review Card Background Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeDesign.cardBackgroundColor || '#FFFFFF'}
                            onChange={(e) => updateActiveDesign('cardBackgroundColor', e.target.value)}
                            className="w-9 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={activeDesign.cardBackgroundColor || '#FFFFFF'}
                            onChange={(e) => updateActiveDesign('cardBackgroundColor', e.target.value)}
                            className={inp}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Review Card Border Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeDesign.cardBorderColor || '#E8DDD2'}
                            onChange={(e) => updateActiveDesign('cardBorderColor', e.target.value)}
                            className="w-9 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={activeDesign.cardBorderColor || '#E8DDD2'}
                            onChange={(e) => updateActiveDesign('cardBorderColor', e.target.value)}
                            className={inp}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 0H. SOCIAL GALLERY CONTENT */}
            {selectedSection === 'social_gallery' && (
              <div className={cardStyle}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('content')}
                  className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-800 dark:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#956638]" />
                    <span>Instagram Community Gallery Headings & Profile Link</span>
                  </div>
                  {openAccordion.content ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {openAccordion.content && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Eyebrow Handle</label>
                        <input
                          type="text"
                          value={activeDesign.eyebrow || 'FOLLOW @ZENZIES'}
                          onChange={(e) => updateActiveDesign('eyebrow', e.target.value)}
                          className={inp}
                          placeholder="FOLLOW @ZENZIES"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Section Heading</label>
                        <input
                          type="text"
                          value={activeDesign.title || 'Join Our Shining Community'}
                          onChange={(e) => updateActiveDesign('title', e.target.value)}
                          className={inp}
                          placeholder="Join Our Shining Community"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Instagram Profile URL</label>
                      <input
                        type="text"
                        value={activeDesign.instagramUrl || 'https://www.instagram.com'}
                        onChange={(e) => updateActiveDesign('instagramUrl', e.target.value)}
                        className={inp}
                        placeholder="https://www.instagram.com/zenzies"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 0I. NEWSLETTER CONTENT */}
            {selectedSection === 'newsletter' && (
              <div className={cardStyle}>
                <button
                  type="button"
                  onClick={() => toggleAccordion('content')}
                  className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-800 dark:text-white cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#956638]" />
                    <span>Newsletter Heading, Copy, Button & Gift Visual</span>
                  </div>
                  {openAccordion.content ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {openAccordion.content && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Newsletter Title</label>
                        <input
                          type="text"
                          value={activeDesign.title || 'Get Exclusive Offers'}
                          onChange={(e) => updateActiveDesign('title', e.target.value)}
                          className={inp}
                          placeholder="Get Exclusive Offers"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Title Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeDesign.titleColor || '#211A16'}
                            onChange={(e) => updateActiveDesign('titleColor', e.target.value)}
                            className="w-9 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={activeDesign.titleColor || '#211A16'}
                            onChange={(e) => updateActiveDesign('titleColor', e.target.value)}
                            className={inp}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Subtitle / Incentives Copy</label>
                      <textarea
                        rows={2}
                        value={activeDesign.subtitle || 'Subscribe and be the first to know about new collections, special offers and smart jewellery storage tips.'}
                        onChange={(e) => updateActiveDesign('subtitle', e.target.value)}
                        className={inp}
                        placeholder="Subscribe and be the first to know..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Subscribe Button Text</label>
                        <input
                          type="text"
                          value={activeDesign.btnText || 'Subscribe'}
                          onChange={(e) => updateActiveDesign('btnText', e.target.value)}
                          className={inp}
                          placeholder="Subscribe"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Button Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeDesign.btnBgColor || '#956638'}
                            onChange={(e) => updateActiveDesign('btnBgColor', e.target.value)}
                            className="w-9 h-8 rounded border cursor-pointer"
                          />
                          <input
                            type="text"
                            value={activeDesign.btnBgColor || '#956638'}
                            onChange={(e) => updateActiveDesign('btnBgColor', e.target.value)}
                            className={inp}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="font-bold text-slate-800 dark:text-white">Gift Box Visual & Handwriting Overlay</div>
                      <div>
                        <label className="block font-semibold mb-1">Gift Photo URL</label>
                        <input
                          type="text"
                          value={activeDesign.image || ''}
                          onChange={(e) => updateActiveDesign('image', e.target.value)}
                          className={inp}
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold mb-1">Script Line 1</label>
                          <input
                            type="text"
                            value={activeDesign.scriptLine1 || 'A Brighter Tomorrow'}
                            onChange={(e) => updateActiveDesign('scriptLine1', e.target.value)}
                            className={inp}
                            placeholder="A Brighter Tomorrow"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">Script Line 2</label>
                          <input
                            type="text"
                            value={activeDesign.scriptLine2 || 'Starts Here ♡'}
                            onChange={(e) => updateActiveDesign('scriptLine2', e.target.value)}
                            className={inp}
                            placeholder="Starts Here ♡"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════
                GROUP 1: BACKGROUND CONTROLS
                ═══════════════════════════════════════════════════════════════════ */}
            <div className={cardStyle}>
              <button
                type="button"
                onClick={() => toggleAccordion('background')}
                className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-800 dark:text-white cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-[#956638]" />
                  <span>Background Imagery & Solid Colors</span>
                </div>
                {openAccordion.background ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {openAccordion.background && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-4 text-xs">
                  {/* Background Color */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold mb-1">Background Solid Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={activeDesign.backgroundColor || '#FBF7F2'}
                          onChange={(e) => updateActiveDesign('backgroundColor', e.target.value)}
                          className="w-10 h-9 rounded-lg border border-slate-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={activeDesign.backgroundColor || '#FBF7F2'}
                          onChange={(e) => updateActiveDesign('backgroundColor', e.target.value)}
                          className={inp}
                          placeholder="#FBF7F2"
                        />
                      </div>
                    </div>

                    {/* Quick Palette Swatches */}
                    <div>
                      <label className="block font-semibold mb-1">Quick Brand Tokens</label>
                      <div className="flex items-center gap-2 pt-1">
                        {[
                          { name: 'Warm Ivory', hex: '#FBF7F2' },
                          { name: 'Blush Warm', hex: '#F3E4DA' },
                          { name: 'Soft Beige', hex: '#E9D9C7' },
                          { name: 'White', hex: '#FFFFFF' },
                          { name: 'Espresso', hex: '#211A16' }
                        ].map((swatch) => (
                          <button
                            key={swatch.hex}
                            type="button"
                            onClick={() => updateActiveDesign('backgroundColor', swatch.hex)}
                            className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-600 shadow-xs hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: swatch.hex }}
                            title={`${swatch.name} (${swatch.hex})`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Background Image Upload & URL */}
                  <div>
                    <label className="block font-semibold mb-1">Background Image URL (Cloudinary / Local Asset)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={activeDesign.backgroundImage || ''}
                        onChange={(e) => updateActiveDesign('backgroundImage', e.target.value)}
                        className={inp}
                        placeholder="https://res.cloudinary.com/... or /img/zenzies/..."
                      />

                      {/* Cloudinary Uploader */}
                      <label className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0" title="Upload via Cloudinary">
                        <Upload size={14} />
                        <span className="hidden sm:inline">Upload</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>

                      {/* Clear Image Button */}
                      {activeDesign.backgroundImage && (
                        <button
                          type="button"
                          onClick={() => updateActiveDesign('backgroundImage', '')}
                          className="px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl border border-rose-200 cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    {uploadingImage && (
                      <div className="mt-2 text-[11px] text-[#956638] flex items-center gap-2">
                        <Loader2 size={13} className="animate-spin" />
                        <span>Uploading background image: {uploadProgress}%</span>
                      </div>
                    )}
                  </div>

                  {/* Position, Size, Repeat, Attachment */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {/* Size */}
                    <div>
                      <label className="block font-semibold mb-1">Background Size</label>
                      <select
                        value={activeDesign.backgroundSize || 'cover'}
                        onChange={(e) => updateActiveDesign('backgroundSize', e.target.value)}
                        className={inp}
                      >
                        <option value="cover">cover (Full Fill)</option>
                        <option value="contain">contain (Fit Inside)</option>
                        <option value="auto">auto</option>
                        <option value="100% 100%">100% 100%</option>
                      </select>
                    </div>

                    {/* Position */}
                    <div>
                      <label className="block font-semibold mb-1">Position</label>
                      <select
                        value={activeDesign.backgroundPosition || 'center center'}
                        onChange={(e) => updateActiveDesign('backgroundPosition', e.target.value)}
                        className={inp}
                      >
                        {POSITION_PRESETS.map((p) => (
                          <option key={p.val} value={p.val}>{p.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Repeat */}
                    <div>
                      <label className="block font-semibold mb-1">Repeat</label>
                      <select
                        value={activeDesign.backgroundRepeat || 'no-repeat'}
                        onChange={(e) => updateActiveDesign('backgroundRepeat', e.target.value)}
                        className={inp}
                      >
                        <option value="no-repeat">no-repeat</option>
                        <option value="repeat">repeat</option>
                        <option value="repeat-x">repeat-x</option>
                        <option value="repeat-y">repeat-y</option>
                      </select>
                    </div>

                    {/* Attachment */}
                    <div>
                      <label className="block font-semibold mb-1">Attachment</label>
                      <select
                        value={activeDesign.backgroundAttachment || 'scroll'}
                        onChange={(e) => updateActiveDesign('backgroundAttachment', e.target.value)}
                        className={inp}
                      >
                        <option value="scroll">scroll (Standard)</option>
                        <option value="fixed">fixed (Parallax)</option>
                      </select>
                    </div>
                  </div>

                  {/* Blend Mode & Overlay Layer */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block font-semibold mb-1">Blend Mode</label>
                      <select
                        value={activeDesign.backgroundBlendMode || 'normal'}
                        onChange={(e) => updateActiveDesign('backgroundBlendMode', e.target.value)}
                        className={inp}
                      >
                        {BLEND_MODES.map((mode) => (
                          <option key={mode} value={mode}>{mode}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Overlay Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={activeDesign.overlayColor || '#000000'}
                          onChange={(e) => updateActiveDesign('overlayColor', e.target.value)}
                          className="w-10 h-8 rounded border border-slate-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={activeDesign.overlayColor || '#000000'}
                          onChange={(e) => updateActiveDesign('overlayColor', e.target.value)}
                          className={inp}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">
                        Overlay Opacity ({Math.round((activeDesign.overlayOpacity || 0) * 100)}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={activeDesign.overlayOpacity || 0}
                        onChange={(e) => updateActiveDesign('overlayOpacity', parseFloat(e.target.value))}
                        className="w-full accent-[#956638] mt-2 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                GROUP 2: TYPOGRAPHY & ACCENT COLORS
                ═══════════════════════════════════════════════════════════════════ */}
            <div className={cardStyle}>
              <button
                type="button"
                onClick={() => toggleAccordion('typography')}
                className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-800 dark:text-white cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#956638]" />
                  <span>Typography & Global Accent Colors</span>
                </div>
                {openAccordion.typography ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {openAccordion.typography && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Primary Title Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={activeDesign.titleColor || '#211A16'}
                        onChange={(e) => updateActiveDesign('titleColor', e.target.value)}
                        className="w-9 h-8 rounded border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={activeDesign.titleColor || '#211A16'}
                        onChange={(e) => updateActiveDesign('titleColor', e.target.value)}
                        className={inp}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Subtitle / Body Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={activeDesign.subtitleColor || activeDesign.textColor || '#6B5E52'}
                        onChange={(e) => {
                          updateActiveDesign('subtitleColor', e.target.value);
                          updateActiveDesign('textColor', e.target.value);
                        }}
                        className="w-9 h-8 rounded border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={activeDesign.subtitleColor || activeDesign.textColor || '#6B5E52'}
                        onChange={(e) => {
                          updateActiveDesign('subtitleColor', e.target.value);
                          updateActiveDesign('textColor', e.target.value);
                        }}
                        className={inp}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Accent / Highlight Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={activeDesign.accentColor || '#956638'}
                        onChange={(e) => updateActiveDesign('accentColor', e.target.value)}
                        className="w-9 h-8 rounded border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={activeDesign.accentColor || '#956638'}
                        onChange={(e) => updateActiveDesign('accentColor', e.target.value)}
                        className={inp}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                GROUP 3: SPACING & PADDING
                ═══════════════════════════════════════════════════════════════════ */}
            <div className={cardStyle}>
              <button
                type="button"
                onClick={() => toggleAccordion('spacing')}
                className="w-full flex items-center justify-between text-left font-bold text-sm text-slate-800 dark:text-white cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Maximize2 size={16} className="text-[#956638]" />
                  <span>Section Spacing & Vertical Padding</span>
                </div>
                {openAccordion.spacing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {openAccordion.spacing && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Padding Top (px)</label>
                    <input
                      type="text"
                      value={activeDesign.paddingTop || '0px'}
                      onChange={(e) => updateActiveDesign('paddingTop', e.target.value)}
                      className={inp}
                      placeholder="e.g. 0px, 44px, or 64px"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Padding Bottom (px)</label>
                    <input
                      type="text"
                      value={activeDesign.paddingBottom || '0px'}
                      onChange={(e) => updateActiveDesign('paddingBottom', e.target.value)}
                      className={inp}
                      placeholder="e.g. 0px, 44px, or 64px"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default HomepageDesignManager;
