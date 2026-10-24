// SiteSettingsManager.jsx
import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../components/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, Plus, Trash2, Edit3, Loader2, Video, Link2, Check,
  Image as ImageIcon, Upload, ChevronUp, ChevronDown, Sparkles,
  ArrowRight, Star, Heart, Layers, Grid, ShieldCheck, Gem, Leaf,
  Users, Gift, Truck, Eye, RefreshCw, AlertCircle
} from "lucide-react";
import { uploadToCloudinary, uploadToCloudinaryWithProgress } from "../../../config/cloudinary";
import IconPickerModal from "./IconPickerModal";
import { getIconComponent } from "../../../utils/iconRegistry";

const labelStyle = "block text-[13px] font-bold uppercase tracking-wider text-slate-500 mb-1.5";

const DEFAULT_HERO_BENEFITS = [
  { id: "b1", icon: "gem", text: "Trendy Designs" },
  { id: "b2", icon: "gift", text: "Perfect for Gifting" },
  { id: "b3", icon: "shield-check", text: "Secure Payment" },
  { id: "b4", icon: "truck", text: "Fast Delivery" },
];

const DEFAULT_TRUST_BENEFITS = [
  { id: 'tb1', icon: 'gem', title: 'Ethically Sourced', desc: 'Conflict-free diamonds', enabled: true },
  { id: 'tb2', icon: 'shield-check', title: 'Certified Quality', desc: 'Authenticity guaranteed', enabled: true },
  { id: 'tb3', icon: 'leaf', title: 'Sustainable Practices', desc: 'A brighter tomorrow', enabled: true },
  { id: 'tb4', icon: 'users', title: 'Trusted by 50K+', desc: 'Happy customers', enabled: true },
];

const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    name: "Priya S.",
    title: "Verified Buyer",
    quote: "Absolutely stunning quality! The ring is even more beautiful in person.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    enabled: true,
  },
  {
    id: 'rev-2',
    name: "Megha K.",
    title: "Verified Buyer",
    quote: "Elegant designs and excellent customer service. Highly recommended!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    enabled: true,
  },
  {
    id: 'rev-3',
    name: "Rohan M.",
    title: "Verified Buyer",
    quote: "The perfect gift for my anniversary. She loved it!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    enabled: true,
  }
];

const SiteSettingsManager = ({ isDarkMode = false }) => {
  const [activeSubTab, setActiveSubTab] = useState("hero");

  const cardStyle = isDarkMode
    ? "p-5 sm:p-6 rounded-2xl border bg-slate-900 border-slate-700 shadow-sm text-white"
    : "p-5 sm:p-6 rounded-2xl border bg-white border-slate-100 shadow-sm text-slate-800";

  const inp = isDarkMode
    ? "w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#941232] transition-colors"
    : "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#941232] transition-colors";

  // ─── Hero Banner State ──────────────────────────────────────────────────────
  const [heroData, setHeroData] = useState({
    videoURL: "/img/video1.mp4",
    posterURL: "/img/zenzies/hero_banner_lifestyle.png",
    eyebrow: "JEWELLERY & EVERYDAY ORGANIZATION",
    line1: "Little Boxes.",
    line2: "Beautiful Things.",
    title: "Little Boxes.\nBeautiful Things.",
    subtitle: "Discover beautiful jewellery and practical organizer boxes designed for your everyday moments.",
    btn1Text: "Shop Jewellery",
    btn1Link: "/shop",
    btn2Text: "Explore Jewellery Boxes",
    btn2Link: "/shop?category=Jewellery+Boxes",
    benefits: DEFAULT_HERO_BENEFITS,
  });
  const [savingHero, setSavingHero] = useState(false);
  const [savedHero, setSavedHero] = useState(false);
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);
  const [heroVideoProgress, setHeroVideoProgress] = useState(0);
  const [uploadingHeroPoster, setUploadingHeroPoster] = useState(false);

  // ─── Announcements State ───────────────────────────────────────────────────
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [savingAnnouncements, setSavingAnnouncements] = useState(false);
  const [savedAnnouncements, setSavedAnnouncements] = useState(false);

  // ─── Bottom Hero Scroll Texts State ────────────────────────────────────────
  const [heroMarquee, setHeroMarquee] = useState([]);
  const [newMarqueeText, setNewMarqueeText] = useState("");
  const [savingMarquee, setSavingMarquee] = useState(false);
  const [savedMarquee, setSavedMarquee] = useState(false);

  // ─── Section Designs State (All other sections) ───────────────────────────
  const [sectionDesigns, setSectionDesigns] = useState({});
  const [savingSection, setSavingSection] = useState("");
  const [savedSection, setSavedSection] = useState("");

  // ─── Icon Picker Modal State ───────────────────────────────────────────────
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconPickerTarget, setIconPickerTarget] = useState(null); // { type: 'hero_benefit'|'trust_benefit', index: number }

  // ─── Homepage Sections Layout State ─────────────────────────────────────────
  const [homepageSections, setHomepageSections] = useState([
    { id: "hero", label: "Hero Video & Banner", enabled: true, order: 1 },
    { id: "category_grid", label: "Shop by Category", enabled: true, order: 2 },
    { id: "jewellery_box_banner", label: "Premium Jewelry Boxes Banner", enabled: true, order: 3 },
    { id: "bestsellers", label: "Our Most Loved Pieces (Bestsellers)", enabled: true, order: 4 },
    { id: "trust_benefits", label: "Trust Badges Strip", enabled: true, order: 5 },
    { id: "promotional_banners", label: "Promotional Banners (50/50 Split)", enabled: true, order: 6 },
    { id: "brand_story", label: "Our Story", enabled: true, order: 7 },
    { id: "testimonials", label: "What Our Customers Say", enabled: true, order: 8 },
    { id: "social_gallery", label: "Join Our Shining Community", enabled: true, order: 9 },
    { id: "newsletter", label: "Get Exclusive Offers", enabled: true, order: 10 },
  ]);
  const [savingSectionsLayout, setSavingSectionsLayout] = useState(false);
  const [savedSectionsLayout, setSavedSectionsLayout] = useState(false);

  // ─── Initial Load from Firebase ────────────────────────────────────────────
  useEffect(() => {
    // Read Homepage Sections Layout & Ordering
    getDoc(doc(db, "site_settings", "homepage_sections")).then((snap) => {
      if (snap.exists() && Array.isArray(snap.data().sections) && snap.data().sections.length > 0) {
        setHomepageSections(snap.data().sections);
      }
    });

    // Read Hero banner config
    const heroRef = doc(db, "site_settings", "hero");
    getDoc(heroRef).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        let l1 = d.line1;
        let l2 = d.line2;
        if (!l1 && !l2 && d.title) {
          const parts = d.title.split('\n');
          l1 = parts[0] || "";
          l2 = parts.slice(1).join(' ') || "";
        }
        setHeroData({
          videoURL: d.videoURL || "",
          posterURL: d.posterURL || "/img/zenzies/hero_banner_lifestyle.png",
          eyebrow: d.eyebrow !== undefined ? d.eyebrow : "JEWELLERY & EVERYDAY ORGANIZATION",
          line1: l1 || "Little Boxes.",
          line2: l2 || "Beautiful Things.",
          title: d.title || `${l1 || "Little Boxes."}\n${l2 || "Beautiful Things."}`,
          subtitle: d.subtitle || "Discover beautiful jewellery and practical organizer boxes designed for your everyday moments.",
          btn1Text: d.btn1Text || "Shop Jewellery",
          btn1Link: d.btn1Link || "/shop",
          btn2Text: d.btn2Text || "Explore Jewellery Boxes",
          btn2Link: d.btn2Link || "/shop?category=Jewellery+Boxes",
          benefits: Array.isArray(d.benefits) && d.benefits.length > 0 ? d.benefits : DEFAULT_HERO_BENEFITS,
        });
      }
    });

    // Read Top Header Announcements
    const announcementsRef = doc(db, "site_settings", "announcements");
    getDoc(announcementsRef).then((snap) => {
      if (snap.exists() && snap.data().items && snap.data().items.length > 0) {
        setAnnouncements(snap.data().items);
      } else {
        setAnnouncements([
          "✦ Express Shipping Across India ✦",
          "✦ Use Code ZENZIES5 for 5% OFF on Your First Order ✦",
          "✦ Artisanal Craftsmanship | Handcrafted Designs ✦"
        ]);
      }
    });

    // Read Bottom Hero Section Scroll Texts (Hero Marquee)
    const marqueeRef = doc(db, "site_settings", "hero_marquee");
    getDoc(marqueeRef).then((snap) => {
      if (snap.exists() && snap.data().items && snap.data().items.length > 0) {
        setHeroMarquee(snap.data().items);
      } else {
        setHeroMarquee([
          '✦ Ethically Sourced',
          '✦ Artisanal Craftsmanship',
          '✦ Anti-Tarnish Formula',
          '✦ Premium Jewellery Boxes',
          '✦ Skin Friendly Alloys',
          '✦ 4.9 ★ Patron Rated',
          '✦ Premium Gift Packaging',
          '✦ Easy & Seamless Returns',
        ]);
      }
    });

    // Read all section designs
    const secRef = doc(db, "site_settings", "section_designs");
    getDoc(secRef).then((snap) => {
      if (snap.exists()) {
        setSectionDesigns(snap.data());
      }
    });
  }, []);

  // ─── Hero video upload ──────────────────────────────────────────────────────
  const handleHeroVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHeroVideo(true);
    setHeroVideoProgress(0);
    try {
      const url = await uploadToCloudinaryWithProgress(file, (percent) => {
        setHeroVideoProgress(percent);
      });
      const updated = { ...heroData, videoURL: url };
      setHeroData(updated);
      await setDoc(doc(db, "site_settings", "hero"), updated, { merge: true });
    } catch (err) {
      console.error("Hero video upload failed:", err);
      alert("Failed to upload video. Please ensure file size is within limits.");
    } finally {
      setUploadingHeroVideo(false);
      e.target.value = '';
    }
  };

  const handleDeleteHeroVideo = async () => {
    if (window.confirm("Remove hero background video? The fallback image will be displayed.")) {
      const updated = { ...heroData, videoURL: "" };
      setHeroData(updated);
      await setDoc(doc(db, "site_settings", "hero"), updated, { merge: true });
    }
  };

  const handleHeroPosterUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHeroPoster(true);
    try {
      const url = await uploadToCloudinary(file);
      setHeroData((prev) => ({ ...prev, posterURL: url }));
    } catch (err) {
      console.error("Hero poster upload failed:", err);
      alert("Failed to upload image.");
    } finally {
      setUploadingHeroPoster(false);
      e.target.value = '';
    }
  };

  const handleSaveHero = async () => {
    setSavingHero(true);
    setSavedHero(false);
    try {
      const payload = {
        ...heroData,
        title: `${heroData.line1 || ""}\n${heroData.line2 || ""}`.trim(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, "site_settings", "hero"), payload, { merge: true });

      // Also keep section_designs.hero in sync
      await setDoc(doc(db, "site_settings", "section_designs"), {
        hero: {
          backgroundImage: heroData.posterURL || "",
          eyebrow: heroData.eyebrow,
          line1: heroData.line1,
          line2: heroData.line2,
          subtitle: heroData.subtitle,
          btn1Text: heroData.btn1Text,
          btn1Link: heroData.btn1Link,
          btn2Text: heroData.btn2Text,
          btn2Link: heroData.btn2Link,
          eyebrowFontSize: heroData.eyebrowFontSize || "",
          titleFontSize: heroData.titleFontSize || "",
          subtitleFontSize: heroData.subtitleFontSize || "",
          badgeFontSize: heroData.badgeFontSize || "",
        }
      }, { merge: true });

      window.dispatchEvent(new Event('zenzies_section_designs_updated'));
      setSavedHero(true);
      setTimeout(() => setSavedHero(false), 3000);
    } catch (err) {
      console.error("Save hero config failed:", err);
      alert("Error saving hero section.");
    } finally {
      setSavingHero(false);
    }
  };

  // ─── Hero Benefits CRUD ────────────────────────────────────────────────────
  const handleAddHeroBenefit = () => {
    const list = heroData.benefits || [];
    const newB = { id: 'b-' + Date.now(), icon: 'gem', text: 'New Feature' };
    setHeroData({ ...heroData, benefits: [...list, newB] });
  };

  const handleUpdateHeroBenefit = (idx, field, value) => {
    const list = [...(heroData.benefits || [])];
    if (list[idx]) {
      list[idx] = { ...list[idx], [field]: value };
      setHeroData({ ...heroData, benefits: list });
    }
  };

  const handleDeleteHeroBenefit = (idx) => {
    const list = (heroData.benefits || []).filter((_, i) => i !== idx);
    setHeroData({ ...heroData, benefits: list });
  };

  // ─── Announcements CRUD ────────────────────────────────────────────────────
  const handleAddAnnouncement = () => {
    if (!newAnnouncement.trim()) return;
    setAnnouncements((prev) => [...prev, newAnnouncement.trim()]);
    setNewAnnouncement("");
  };

  const handleUpdateAnnouncement = (index, val) => {
    setAnnouncements((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleMoveAnnouncement = (index, direction) => {
    setAnnouncements((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  };

  const handleRemoveAnnouncement = (index) => {
    setAnnouncements((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveAnnouncements = async () => {
    setSavingAnnouncements(true);
    setSavedAnnouncements(false);
    try {
      await setDoc(doc(db, "site_settings", "announcements"), { items: announcements });
      setSavedAnnouncements(true);
      setTimeout(() => setSavedAnnouncements(false), 3000);
    } catch (e) {
      console.error("Save announcements failed:", e);
    } finally {
      setSavingAnnouncements(false);
    }
  };

  // ─── Hero Marquee Scroll Texts CRUD ────────────────────────────────────────
  const handleAddMarquee = () => {
    if (!newMarqueeText.trim()) return;
    setHeroMarquee((prev) => [...prev, newMarqueeText.trim()]);
    setNewMarqueeText("");
  };

  const handleUpdateMarquee = (index, val) => {
    setHeroMarquee((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleMoveMarquee = (index, dir) => {
    setHeroMarquee((prev) => {
      const next = [...prev];
      const targetIndex = index + dir;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleRemoveMarquee = (index) => {
    setHeroMarquee((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveMarquee = async () => {
    setSavingMarquee(true);
    setSavedMarquee(false);
    try {
      await setDoc(doc(db, "site_settings", "hero_marquee"), { items: heroMarquee });
      setSavedMarquee(true);
      setTimeout(() => setSavedMarquee(false), 3000);
    } catch (e) {
      console.error("Save marquee failed:", e);
    } finally {
      setSavingMarquee(false);
    }
  };

  // ─── Generic Section Design Token Update & Save ───────────────────────────
  const updateSectionToken = (sectionKey, field, value) => {
    setSectionDesigns((prev) => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveSection = async (sectionKey) => {
    setSavingSection(sectionKey);
    setSavedSection("");
    try {
      const secData = sectionDesigns[sectionKey] || {};
      await setDoc(doc(db, "site_settings", "section_designs"), {
        [sectionKey]: secData
      }, { merge: true });

      window.dispatchEvent(new Event('zenzies_section_designs_updated'));
      setSavedSection(sectionKey);
      setTimeout(() => setSavedSection(""), 3000);
    } catch (err) {
      console.error(`Save section ${sectionKey} failed:`, err);
      alert(`Error saving section: ${err.message}`);
    } finally {
      setSavingSection("");
    }
  };

  // ─── Generic Cloudinary Upload for Sections ───────────────────────────────
  const [uploadingSectionImg, setUploadingSectionImg] = useState("");
  const handleGenericImageUpload = async (sectionKey, field, file) => {
    if (!file) return;
    setUploadingSectionImg(`${sectionKey}_${field}`);
    try {
      const url = await uploadToCloudinary(file);
      updateSectionToken(sectionKey, field, url);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image.");
    } finally {
      setUploadingSectionImg("");
    }
  };

  // ─── Icon Selection Handler ────────────────────────────────────────────────
  const handleIconSelected = (iconKey) => {
    if (!iconPickerTarget) return;
    if (iconPickerTarget.type === 'hero_benefit') {
      handleUpdateHeroBenefit(iconPickerTarget.index, 'icon', iconKey);
    } else if (iconPickerTarget.type === 'trust_benefit') {
      const items = [...(sectionDesigns.trust_benefits?.items || DEFAULT_TRUST_BENEFITS)];
      if (items[iconPickerTarget.index]) {
        items[iconPickerTarget.index] = { ...items[iconPickerTarget.index], icon: iconKey };
        updateSectionToken('trust_benefits', 'items', items);
      }
    }
    setIconPickerOpen(false);
    setIconPickerTarget(null);
  };

  // ─── Homepage Sections Layout Handlers ─────────────────────────────────────
  const handleSaveSectionsLayout = async () => {
    setSavingSectionsLayout(true);
    setSavedSectionsLayout(false);
    try {
      await setDoc(doc(db, "site_settings", "homepage_sections"), {
        sections: homepageSections,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setSavedSectionsLayout(true);
      setTimeout(() => setSavedSectionsLayout(false), 3000);
    } catch (err) {
      console.error("Save layout failed:", err);
      alert("Failed to save sections layout.");
    } finally {
      setSavingSectionsLayout(false);
    }
  };

  const handleMoveSectionLayout = (idx, dir) => {
    setHomepageSections((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      const temp = next[idx];
      next[idx] = next[target];
      next[target] = temp;
      return next.map((item, index) => ({ ...item, order: index + 1 }));
    });
  };

  const handleToggleSectionLayout = (idx, checked) => {
    setHomepageSections((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], enabled: checked };
      return next;
    });
  };

  // ─── Sub-tabs definitions ──────────────────────────────────────────────────
  const SUB_TABS = [
    { id: "sections_layout", label: "00. Layout & Section Order" },
    { id: "global_buttons", label: "✦ Button Gradients & Styling" },
    { id: "hero", label: "01. Hero Video & Banner" },
    { id: "announcements", label: "02. Top Header Texts" },
    { id: "hero_marquee", label: "03. Bottom Hero Scroll Texts" },
    { id: "category_grid", label: "04. Shop by Category" },
    { id: "jewellery_box_banner", label: "05. Premium Jewelry Boxes" },
    { id: "bestsellers", label: "06. Our Most Loved Pieces" },
    { id: "trust_benefits", label: "07. Trust Badges Strip" },
    { id: "promotional_banners", label: "08. Promotional Banners" },
    { id: "brand_story", label: "09. Our Story" },
    { id: "testimonials", label: "10. Customer Reviews" },
    { id: "social_gallery", label: "11. Social Gallery" },
    { id: "newsletter", label: "12. Get Exclusive Offers" },
  ];

  return (
    <div className="space-y-6">
      {/* Sub Tabs Pill Navigation */}
      <div className={`flex gap-2 border-b pb-3 overflow-x-auto no-scrollbar ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? "bg-[#941232] text-white shadow-sm"
                : isDarkMode
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 00: HOMEPAGE SECTIONS LAYOUT & ORDER BUILDER
      ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "sections_layout" && (
        <div className={cardStyle}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Homepage Sections Layout & Order</h3>
              <p className="text-xs text-slate-400">Reorder sections or toggle visibility on the live storefront in real time</p>
            </div>
            <button
              onClick={handleSaveSectionsLayout}
              disabled={savingSectionsLayout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingSectionsLayout ? <Loader2 size={14} className="animate-spin" /> : savedSectionsLayout ? <Check size={14} /> : <Save size={14} />}
              {savingSectionsLayout ? "Saving..." : savedSectionsLayout ? "Saved!" : "Save Section Order"}
            </button>
          </div>

          <div className="space-y-3 max-w-3xl">
            {homepageSections.map((sec, idx) => (
              <div
                key={sec.id || idx}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  sec.enabled !== false
                    ? isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                    : isDarkMode ? "bg-slate-950/40 border-slate-800/40 opacity-60" : "bg-slate-100/60 border-slate-200/60 opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#941232]/10 text-[#941232] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold">{sec.label}</h4>
                    <span className="text-[11px] font-mono text-slate-400">ID: {sec.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer mr-2">
                    <input
                      type="checkbox"
                      checked={sec.enabled !== false}
                      onChange={(e) => handleToggleSectionLayout(idx, e.target.checked)}
                      className="cursor-pointer"
                    />
                    <span>{sec.enabled !== false ? "Visible" : "Hidden"}</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => handleMoveSectionLayout(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveSectionLayout(idx, 1)}
                    disabled={idx === homepageSections.length - 1}
                    className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB: GLOBAL BUTTON GRADIENTS & STYLING
      ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "global_buttons" && (
        <div className={cardStyle}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                  Global Button Gradients & Styling
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure luxury gradient colors applied across all primary CTA buttons on the live storefront
              </p>
            </div>
            <button
              onClick={() => handleSaveSection('global_buttons')}
              disabled={savingSection === 'global_buttons'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingSection === 'global_buttons' ? <Loader2 size={14} className="animate-spin" /> : savedSection === 'global_buttons' ? <Check size={14} /> : <Save size={14} />}
              {savingSection === 'global_buttons' ? "Saving..." : savedSection === 'global_buttons' ? "Saved!" : "Save Button Styling"}
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-12 max-w-5xl">
            {/* Left Column: Color Controls & Quick Presets */}
            <div className="space-y-5 lg:col-span-7">
              {/* Presets */}
              <div>
                <label className={labelStyle}>Curated Luxury Gradient Presets</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { name: "Royal Bronze", from: "#A26B38", to: "#7B4F26", angle: "135deg" },
                    { name: "Imperial Crimson", from: "#941232", to: "#680A20", angle: "135deg" },
                    { name: "Caramel Gold", from: "#B37D42", to: "#875323", angle: "135deg" },
                    { name: "Champagne Sunset", from: "#C89B58", to: "#9C682A", angle: "135deg" },
                    { name: "Rose Gold Luxury", from: "#B76E79", to: "#88424D", angle: "135deg" },
                    { name: "Deep Espresso", from: "#3E2719", to: "#1E120A", angle: "135deg" },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        updateSectionToken('global_buttons', 'btnGradientFrom', preset.from);
                        updateSectionToken('global_buttons', 'btnGradientTo', preset.to);
                        updateSectionToken('global_buttons', 'btnGradientAngle', preset.angle);
                        updateSectionToken('global_buttons', 'btnGradient', `linear-gradient(${preset.angle}, ${preset.from} 0%, ${preset.to} 100%)`);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 hover:scale-[1.02] ${
                        (sectionDesigns.global_buttons?.btnGradientFrom === preset.from)
                          ? "border-[#941232] ring-2 ring-[#941232]/20"
                          : isDarkMode ? "border-slate-800 bg-slate-950" : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div
                        className="w-full h-5 rounded-lg shadow-xs"
                        style={{ background: `linear-gradient(${preset.angle}, ${preset.from} 0%, ${preset.to} 100%)` }}
                      />
                      <span className="text-[11px] font-bold truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Gradient Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Gradient Start Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={sectionDesigns.global_buttons?.btnGradientFrom || "#A26B38"}
                      onChange={(e) => {
                        const from = e.target.value;
                        const to = sectionDesigns.global_buttons?.btnGradientTo || "#7B4F26";
                        const angle = sectionDesigns.global_buttons?.btnGradientAngle || "135deg";
                        updateSectionToken('global_buttons', 'btnGradientFrom', from);
                        updateSectionToken('global_buttons', 'btnGradient', `linear-gradient(${angle}, ${from} 0%, ${to} 100%)`);
                      }}
                      className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={sectionDesigns.global_buttons?.btnGradientFrom || "#A26B38"}
                      onChange={(e) => {
                        const from = e.target.value;
                        const to = sectionDesigns.global_buttons?.btnGradientTo || "#7B4F26";
                        const angle = sectionDesigns.global_buttons?.btnGradientAngle || "135deg";
                        updateSectionToken('global_buttons', 'btnGradientFrom', from);
                        updateSectionToken('global_buttons', 'btnGradient', `linear-gradient(${angle}, ${from} 0%, ${to} 100%)`);
                      }}
                      className={`${inp} py-1.5 text-xs font-mono`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Gradient End Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={sectionDesigns.global_buttons?.btnGradientTo || "#7B4F26"}
                      onChange={(e) => {
                        const from = sectionDesigns.global_buttons?.btnGradientFrom || "#A26B38";
                        const to = e.target.value;
                        const angle = sectionDesigns.global_buttons?.btnGradientAngle || "135deg";
                        updateSectionToken('global_buttons', 'btnGradientTo', to);
                        updateSectionToken('global_buttons', 'btnGradient', `linear-gradient(${angle}, ${from} 0%, ${to} 100%)`);
                      }}
                      className="w-9 h-9 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={sectionDesigns.global_buttons?.btnGradientTo || "#7B4F26"}
                      onChange={(e) => {
                        const from = sectionDesigns.global_buttons?.btnGradientFrom || "#A26B38";
                        const to = e.target.value;
                        const angle = sectionDesigns.global_buttons?.btnGradientAngle || "135deg";
                        updateSectionToken('global_buttons', 'btnGradientTo', to);
                        updateSectionToken('global_buttons', 'btnGradient', `linear-gradient(${angle}, ${from} 0%, ${to} 100%)`);
                      }}
                      className={`${inp} py-1.5 text-xs font-mono`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Gradient Angle</label>
                  <select
                    value={sectionDesigns.global_buttons?.btnGradientAngle || "135deg"}
                    onChange={(e) => {
                      const from = sectionDesigns.global_buttons?.btnGradientFrom || "#A26B38";
                      const to = sectionDesigns.global_buttons?.btnGradientTo || "#7B4F26";
                      const angle = e.target.value;
                      updateSectionToken('global_buttons', 'btnGradientAngle', angle);
                      updateSectionToken('global_buttons', 'btnGradient', `linear-gradient(${angle}, ${from} 0%, ${to} 100%)`);
                    }}
                    className={`${inp} py-1.5 text-xs font-mono`}
                  >
                    <option value="90deg">90° (Left to Right)</option>
                    <option value="135deg">135° (Diagonal Luxury)</option>
                    <option value="180deg">180° (Top to Bottom)</option>
                    <option value="45deg">45° (Upward Diagonal)</option>
                  </select>
                </div>
              </div>

              {/* Text Color & Radius */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Button Text Color</label>
                  <input
                    type="text"
                    value={sectionDesigns.global_buttons?.btnTextColor || "#FFFFFF"}
                    onChange={(e) => updateSectionToken('global_buttons', 'btnTextColor', e.target.value)}
                    className={`${inp} py-1.5 text-xs font-mono`}
                    placeholder="#FFFFFF"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Button Corner Radius</label>
                  <input
                    type="text"
                    value={sectionDesigns.global_buttons?.btnBorderRadius || "6px"}
                    onChange={(e) => updateSectionToken('global_buttons', 'btnBorderRadius', e.target.value)}
                    className={`${inp} py-1.5 text-xs font-mono`}
                    placeholder="e.g. 6px, 8px, 9999px"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Preview */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl border bg-[#FAF7F2] dark:bg-slate-950 border-[#E8DDD2] dark:border-slate-800 text-slate-800 dark:text-white space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#956638] dark:text-amber-400 block mb-1">
                  Live Storefront Preview
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time interactive simulation of buttons with current gradient & shadow
                </p>
              </div>

              <div className="space-y-4 py-4 flex flex-col items-center">
                {/* Simulated Hero Button */}
                <div
                  className="inline-flex items-center justify-center gap-3 px-7 py-3.5 text-sm font-semibold tracking-wide shadow-md transition-all cursor-pointer hover:brightness-105 hover:scale-[1.02]"
                  style={{
                    background: sectionDesigns.global_buttons?.btnGradient || `linear-gradient(${sectionDesigns.global_buttons?.btnGradientAngle || '135deg'}, ${sectionDesigns.global_buttons?.btnGradientFrom || '#A26B38'} 0%, ${sectionDesigns.global_buttons?.btnGradientTo || '#7B4F26'} 100%)`,
                    color: sectionDesigns.global_buttons?.btnTextColor || '#FFFFFF',
                    borderRadius: sectionDesigns.global_buttons?.btnBorderRadius || '6px',
                  }}
                >
                  <span>Shop Jewellery</span>
                  <ArrowRight size={16} />
                </div>

                {/* Simulated Add to Cart Button */}
                <div
                  className="w-full max-w-[200px] py-2.5 px-4 text-xs font-semibold tracking-wider uppercase text-center shadow-md transition-all cursor-pointer hover:brightness-105"
                  style={{
                    background: sectionDesigns.global_buttons?.btnGradient || `linear-gradient(${sectionDesigns.global_buttons?.btnGradientAngle || '135deg'}, ${sectionDesigns.global_buttons?.btnGradientFrom || '#A26B38'} 0%, ${sectionDesigns.global_buttons?.btnGradientTo || '#7B4F26'} 100%)`,
                    color: sectionDesigns.global_buttons?.btnTextColor || '#FFFFFF',
                    borderRadius: sectionDesigns.global_buttons?.btnBorderRadius || '6px',
                  }}
                >
                  Add to Cart
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono text-center border-t border-slate-200 dark:border-slate-800 pt-3">
                CSS: {sectionDesigns.global_buttons?.btnGradient || `linear-gradient(135deg, #A26B38 0%, #7B4F26 100%)`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 1: HERO VIDEO & BANNER
      ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "hero" && (
        <div className={cardStyle}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Hero Video & Content</h3>
              <p className="text-xs text-slate-400">Configure title, subtitle, background video, poster and CTA buttons live</p>
            </div>
            <button
              onClick={handleSaveHero}
              disabled={savingHero}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingHero ? <Loader2 size={14} className="animate-spin" /> : savedHero ? <Check size={14} /> : <Save size={14} />}
              {savingHero ? "Saving..." : savedHero ? "Saved!" : "Save Hero Section"}
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column: Form Fields */}
            <div className="space-y-4 lg:col-span-7">
              {/* Hero Video Source */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className={labelStyle}>Hero Video Source (MP4 / Webm)</label>
                  {heroData.videoURL && (
                    <button
                      type="button"
                      onClick={handleDeleteHeroVideo}
                      className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Trash2 size={12} /> Remove Video
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={heroData.videoURL || ""}
                    onChange={(e) => setHeroData({ ...heroData, videoURL: e.target.value })}
                    className={inp}
                    placeholder="Enter video URL link (e.g. /img/video1.mp4 or Cloudinary URL)"
                  />
                  <label
                    className={`flex items-center justify-center px-3.5 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer shrink-0 ${
                      isDarkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                    title="Upload video to Cloudinary"
                  >
                    <Video size={16} />
                    <span className="text-xs font-semibold ml-1.5 hidden sm:inline">Upload</span>
                    <input type="file" accept="video/*" className="hidden" onChange={handleHeroVideoUpload} />
                  </label>
                </div>
                {uploadingHeroVideo && (
                  <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-amber-600">
                      <span className="flex items-center gap-1.5">
                        <Loader2 size={13} className="animate-spin" /> Uploading Video to Cloudinary...
                      </span>
                      <span className="font-mono text-xs">{heroVideoProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${heroVideoProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Hero Fallback Poster Image */}
              <div>
                <label className={labelStyle}>Hero Fallback Poster / Background Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={heroData.posterURL || ""}
                    onChange={(e) => setHeroData({ ...heroData, posterURL: e.target.value })}
                    className={inp}
                    placeholder="e.g. /img/zenzies/hero_banner_lifestyle.png"
                  />
                  <label
                    className={`flex items-center justify-center px-3.5 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer shrink-0 ${
                      isDarkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                    title="Upload poster image"
                  >
                    {uploadingHeroPoster ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                    <span className="text-xs font-semibold ml-1.5 hidden sm:inline">Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleHeroPosterUpload} />
                  </label>
                </div>
              </div>

              {/* Eyebrow */}
              <div>
                <label className={labelStyle}>Eyebrow Subtitle</label>
                <input
                  type="text"
                  value={heroData.eyebrow}
                  onChange={(e) => setHeroData({ ...heroData, eyebrow: e.target.value })}
                  className={inp}
                  placeholder="e.g. JEWELLERY & EVERYDAY ORGANIZATION"
                />
              </div>

              {/* Main Headline Split: Line 1 & Line 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Headline Line 1 (Dark)</label>
                  <input
                    type="text"
                    value={heroData.line1}
                    onChange={(e) => setHeroData({ ...heroData, line1: e.target.value })}
                    className={inp}
                    placeholder="e.g. Little Boxes."
                  />
                </div>
                <div>
                  <label className={labelStyle}>Headline Line 2 (Gold Accent)</label>
                  <input
                    type="text"
                    value={heroData.line2}
                    onChange={(e) => setHeroData({ ...heroData, line2: e.target.value })}
                    className={inp}
                    placeholder="e.g. Beautiful Things."
                  />
                </div>
              </div>

              {/* Subtitle Description */}
              <div>
                <label className={labelStyle}>Hero Sub-copy Description</label>
                <textarea
                  rows={2}
                  value={heroData.subtitle}
                  onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                  className={`${inp} resize-none`}
                  placeholder="e.g. Discover beautiful jewellery and practical organizer boxes..."
                />
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Button 1 Label</label>
                  <input
                    type="text"
                    value={heroData.btn1Text}
                    onChange={(e) => setHeroData({ ...heroData, btn1Text: e.target.value })}
                    className={inp}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Button 1 Link</label>
                  <input
                    type="text"
                    value={heroData.btn1Link}
                    onChange={(e) => setHeroData({ ...heroData, btn1Link: e.target.value })}
                    className={inp}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Button 2 Label</label>
                  <input
                    type="text"
                    value={heroData.btn2Text}
                    onChange={(e) => setHeroData({ ...heroData, btn2Text: e.target.value })}
                    className={inp}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Button 2 Link</label>
                  <input
                    type="text"
                    value={heroData.btn2Link}
                    onChange={(e) => setHeroData({ ...heroData, btn2Link: e.target.value })}
                    className={inp}
                  />
                </div>
              </div>

              {/* Dynamic Typography & Font Sizes */}
              <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Typography Font Sizes (Customizable)</h4>
                  <span className="text-[11px] text-slate-400 font-mono">Headings: Cormorant Garamond · Body: Montserrat</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Eyebrow Size</label>
                    <input
                      type="text"
                      value={heroData.eyebrowFontSize || ""}
                      onChange={(e) => setHeroData({ ...heroData, eyebrowFontSize: e.target.value })}
                      className={`${inp} py-1.5 text-xs`}
                      placeholder="e.g. 13px"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Title Size</label>
                    <input
                      type="text"
                      value={heroData.titleFontSize || ""}
                      onChange={(e) => setHeroData({ ...heroData, titleFontSize: e.target.value })}
                      className={`${inp} py-1.5 text-xs`}
                      placeholder="e.g. 56px"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Subtitle Size</label>
                    <input
                      type="text"
                      value={heroData.subtitleFontSize || ""}
                      onChange={(e) => setHeroData({ ...heroData, subtitleFontSize: e.target.value })}
                      className={`${inp} py-1.5 text-xs`}
                      placeholder="e.g. 16px"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Badges Size</label>
                    <input
                      type="text"
                      value={heroData.badgeFontSize || ""}
                      onChange={(e) => setHeroData({ ...heroData, badgeFontSize: e.target.value })}
                      className={`${inp} py-1.5 text-xs`}
                      placeholder="e.g. 13px"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Bottom Benefit Badges (CRUD) */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className={labelStyle}>Hero Bottom Benefit Badges (CRUD)</label>
                  <button
                    type="button"
                    onClick={handleAddHeroBenefit}
                    className="text-xs font-bold text-[#941232] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Add Benefit
                  </button>
                </div>
                <div className="space-y-2">
                  {(heroData.benefits || []).map((b, idx) => {
                    const IconComp = getIconComponent(b.icon);
                    return (
                      <div
                        key={b.id || idx}
                        className={`flex items-center gap-2 p-2 rounded-xl border ${
                          isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setIconPickerTarget({ type: 'hero_benefit', index: idx });
                            setIconPickerOpen(true);
                          }}
                          className="p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 cursor-pointer shrink-0"
                          title="Change icon"
                        >
                          <IconComp size={18} />
                        </button>
                        <input
                          type="text"
                          value={b.text}
                          onChange={(e) => handleUpdateHeroBenefit(idx, 'text', e.target.value)}
                          className={`${inp} py-1.5`}
                          placeholder="e.g. Trendy Designs"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteHeroBenefit(idx)}
                          className="p-2 text-rose-500 hover:text-rose-600 cursor-pointer shrink-0"
                          title="Delete badge"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Live Video & Background Preview */}
            <div className="lg:col-span-5 space-y-4">
              <label className={labelStyle}>Live Visual Preview</label>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/90 border border-slate-200 dark:border-slate-800 shadow-inner flex flex-col justify-end p-5 text-white">
                {heroData.videoURL ? (
                  <video
                    key={heroData.videoURL}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={heroData.posterURL || "/img/zenzies/hero_banner_lifestyle.png"}
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                  >
                    <source src={heroData.videoURL} type="video/mp4" />
                  </video>
                ) : heroData.posterURL ? (
                  <img
                    src={heroData.posterURL}
                    alt="Hero Preview"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs">
                    No visual media configured
                  </div>
                )}

                {/* Gradient overlay for text legibility in preview */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[1]" />

                {/* Content preview */}
                <div className="relative z-[2] space-y-1">
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-300 block">
                    {heroData.eyebrow}
                  </span>
                  <div className="font-serif text-lg leading-tight font-medium">
                    <span className="block text-white">{heroData.line1}</span>
                    <span className="block text-amber-400">{heroData.line2}</span>
                  </div>
                  <p className="text-[11px] text-white/80 line-clamp-2 leading-relaxed">
                    {heroData.subtitle}
                  </p>
                  <div className="flex gap-2 pt-2">
                    <span className="px-2.5 py-1 rounded bg-[#B8752A] text-white text-[10px] font-semibold">
                      {heroData.btn1Text}
                    </span>
                    <span className="px-2.5 py-1 rounded border border-amber-300 text-amber-200 text-[10px] font-semibold">
                      {heroData.btn2Text}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 2: TOP HEADER TEXTS (ANNOUNCEMENTS)
      ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "announcements" && (
        <div className={cardStyle}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Top Header Announcements</h3>
              <p className="text-xs text-slate-400">Rotating notifications shown in the slim top announcement header bar</p>
            </div>
            <button
              onClick={handleSaveAnnouncements}
              disabled={savingAnnouncements}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingAnnouncements ? <Loader2 size={14} className="animate-spin" /> : savedAnnouncements ? <Check size={14} /> : <Save size={14} />}
              {savingAnnouncements ? "Saving..." : savedAnnouncements ? "Saved!" : "Save Announcements"}
            </button>
          </div>

          <div className="space-y-4 max-w-3xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddAnnouncement()}
                placeholder="e.g. ✦ Use Code ZENZIES5 for 5% OFF on Your First Order ✦"
                className={inp}
              />
              <button
                type="button"
                onClick={handleAddAnnouncement}
                className="px-4 py-2 bg-[#941232] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {announcements.map((text, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                    isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-slate-400 w-6 text-center">{idx + 1}</span>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => handleUpdateAnnouncement(idx, e.target.value)}
                    className={`${inp} py-1.5`}
                  />
                  <button
                    type="button"
                    onClick={() => handleMoveAnnouncement(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Move up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveAnnouncement(idx, 1)}
                    disabled={idx === announcements.length - 1}
                    className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="Move down"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveAnnouncement(idx)}
                    className="p-1.5 text-rose-500 hover:text-rose-600 cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 3: BOTTOM HERO SCROLL TEXTS (MARQUEE)
      ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "hero_marquee" && (
        <div className={cardStyle}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Bottom Hero Marquee Scroll Texts</h3>
              <p className="text-xs text-slate-400">Continuous infinite ticker scroll texts displayed beneath the hero section</p>
            </div>
            <button
              onClick={handleSaveMarquee}
              disabled={savingMarquee}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingMarquee ? <Loader2 size={14} className="animate-spin" /> : savedMarquee ? <Check size={14} /> : <Save size={14} />}
              {savingMarquee ? "Saving..." : savedMarquee ? "Saved!" : "Save Marquee"}
            </button>
          </div>

          <div className="space-y-4 max-w-3xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMarqueeText}
                onChange={(e) => setNewMarqueeText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddMarquee()}
                placeholder="e.g. ✦ Artisanal Craftsmanship"
                className={inp}
              />
              <button
                type="button"
                onClick={handleAddMarquee}
                className="px-4 py-2 bg-[#941232] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {heroMarquee.map((text, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                    isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <span className="text-xs font-mono font-bold text-slate-400 w-6 text-center">{idx + 1}</span>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => handleUpdateMarquee(idx, e.target.value)}
                    className={`${inp} py-1.5`}
                  />
                  <button
                    type="button"
                    onClick={() => handleMoveMarquee(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveMarquee(idx, 1)}
                    disabled={idx === heroMarquee.length - 1}
                    className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMarquee(idx)}
                    className="p-1.5 text-rose-500 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 4: SHOP BY CATEGORY
      ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "category_grid" && (
        <div className={cardStyle}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Shop by Category Header</h3>
              <p className="text-xs text-slate-400">Configure section eyebrow, title, description and View All destination</p>
            </div>
            <button
              onClick={() => handleSaveSection('category_grid')}
              disabled={savingSection === 'category_grid'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingSection === 'category_grid' ? <Loader2 size={14} className="animate-spin" /> : savedSection === 'category_grid' ? <Check size={14} /> : <Save size={14} />}
              {savingSection === 'category_grid' ? "Saving..." : savedSection === 'category_grid' ? "Saved!" : "Save Section"}
            </button>
          </div>

          <div className="grid gap-4 max-w-3xl">
            <div>
              <label className={labelStyle}>Eyebrow Subtitle</label>
              <input
                type="text"
                value={sectionDesigns.category_grid?.eyebrow || "SHOP BY CATEGORY"}
                onChange={(e) => updateSectionToken('category_grid', 'eyebrow', e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className={labelStyle}>Main Section Title</label>
              <input
                type="text"
                value={sectionDesigns.category_grid?.title || "Find Your Perfect Piece"}
                onChange={(e) => updateSectionToken('category_grid', 'title', e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className={labelStyle}>Section Subtitle / Description</label>
              <input
                type="text"
                value={sectionDesigns.category_grid?.subtitle || "Explore our curated collections for every occasion."}
                onChange={(e) => updateSectionToken('category_grid', 'subtitle', e.target.value)}
                className={inp}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>View All Link Text</label>
                <input
                  type="text"
                  value={sectionDesigns.category_grid?.viewAllText || "View All Categories"}
                  onChange={(e) => updateSectionToken('category_grid', 'viewAllText', e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className={labelStyle}>View All Link URL</label>
                <input
                  type="text"
                  value={sectionDesigns.category_grid?.viewAllLink || "/shop"}
                  onChange={(e) => updateSectionToken('category_grid', 'viewAllLink', e.target.value)}
                  className={inp}
                />
              </div>
            </div>

            {/* Dynamic Typography & Font Sizes */}
            <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Typography Font Sizes (Customizable)</h4>
                <span className="text-[11px] text-slate-400 font-mono">Headings: Cormorant Garamond · Body: Montserrat</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Eyebrow Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.category_grid?.eyebrowFontSize || ""}
                    onChange={(e) => updateSectionToken('category_grid', 'eyebrowFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 11px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Title Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.category_grid?.titleFontSize || ""}
                    onChange={(e) => updateSectionToken('category_grid', 'titleFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 38px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Subtitle Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.category_grid?.subtitleFontSize || ""}
                    onChange={(e) => updateSectionToken('category_grid', 'subtitleFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 14px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Card Label Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.category_grid?.cardLabelFontSize || ""}
                    onChange={(e) => updateSectionToken('category_grid', 'cardLabelFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 13px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 5: PREMIUM JEWELRY BOXES BANNER
      ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "jewellery_box_banner" && (
        <div className={cardStyle}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Premium Jewelry Boxes Banner</h3>
              <p className="text-xs text-slate-400">Manage headline, description, background image, CTA and bullet features</p>
            </div>
            <button
              onClick={() => handleSaveSection('jewellery_box_banner')}
              disabled={savingSection === 'jewellery_box_banner'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingSection === 'jewellery_box_banner' ? <Loader2 size={14} className="animate-spin" /> : savedSection === 'jewellery_box_banner' ? <Check size={14} /> : <Save size={14} />}
              {savingSection === 'jewellery_box_banner' ? "Saving..." : savedSection === 'jewellery_box_banner' ? "Saved!" : "Save Section"}
            </button>
          </div>

          <div className="grid gap-4 max-w-3xl">
            <div>
              <label className={labelStyle}>Eyebrow Subtitle</label>
              <input
                type="text"
                value={sectionDesigns.jewellery_box_banner?.eyebrow || "PREMIUM JEWELRY BOXES"}
                onChange={(e) => updateSectionToken('jewellery_box_banner', 'eyebrow', e.target.value)}
                className={inp}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Title Line 1</label>
                <input
                  type="text"
                  value={sectionDesigns.jewellery_box_banner?.titleLine1 || "Little Box"}
                  onChange={(e) => updateSectionToken('jewellery_box_banner', 'titleLine1', e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className={labelStyle}>Title Line 2 (Accent)</label>
                <input
                  type="text"
                  value={sectionDesigns.jewellery_box_banner?.titleLine2 || "Big Elegance"}
                  onChange={(e) => updateSectionToken('jewellery_box_banner', 'titleLine2', e.target.value)}
                  className={inp}
                />
              </div>
            </div>
            <div>
              <label className={labelStyle}>Description Subtitle</label>
              <textarea
                rows={2}
                value={sectionDesigns.jewellery_box_banner?.subtitle || "Keep your earrings, rings, and chains beautifully organized with our premium jewelry boxes."}
                onChange={(e) => updateSectionToken('jewellery_box_banner', 'subtitle', e.target.value)}
                className={`${inp} resize-none`}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>CTA Button Label</label>
                <input
                  type="text"
                  value={sectionDesigns.jewellery_box_banner?.btnText || "Shop Jewelry Boxes"}
                  onChange={(e) => updateSectionToken('jewellery_box_banner', 'btnText', e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className={labelStyle}>CTA Button Link</label>
                <input
                  type="text"
                  value={sectionDesigns.jewellery_box_banner?.btnLink || "/shop?category=Jewellery+Boxes"}
                  onChange={(e) => updateSectionToken('jewellery_box_banner', 'btnLink', e.target.value)}
                  className={inp}
                />
              </div>
            </div>

            {/* Background Image Upload */}
            <div>
              <label className={labelStyle}>Banner Background Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sectionDesigns.jewellery_box_banner?.backgroundImage || "/img/zenzies/jewellery_box_promo_clean_bg.jpg"}
                  onChange={(e) => updateSectionToken('jewellery_box_banner', 'backgroundImage', e.target.value)}
                  className={inp}
                />
                <label className={`flex items-center justify-center px-3.5 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer shrink-0 ${
                  isDarkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}>
                  {uploadingSectionImg === 'jewellery_box_banner_backgroundImage' ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  <span className="text-xs font-semibold ml-1.5 hidden sm:inline">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleGenericImageUpload('jewellery_box_banner', 'backgroundImage', e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>

            {/* Dynamic Typography & Font Sizes */}
            <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Typography Font Sizes (Customizable)</h4>
                <span className="text-[11px] text-slate-400 font-mono">Headings: Cormorant Garamond · Body: Montserrat</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Eyebrow Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.jewellery_box_banner?.eyebrowFontSize || ""}
                    onChange={(e) => updateSectionToken('jewellery_box_banner', 'eyebrowFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 11px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Heading Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.jewellery_box_banner?.titleFontSize || ""}
                    onChange={(e) => updateSectionToken('jewellery_box_banner', 'titleFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 48px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Subtitle Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.jewellery_box_banner?.subtitleFontSize || ""}
                    onChange={(e) => updateSectionToken('jewellery_box_banner', 'subtitleFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 14px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Features Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.jewellery_box_banner?.featuresFontSize || ""}
                    onChange={(e) => updateSectionToken('jewellery_box_banner', 'featuresFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 13px"
                  />
                </div>
              </div>
            </div>

            {/* Features List (CRUD) */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                <label className={labelStyle}>Box Features Checklist (CRUD)</label>
                <button
                  type="button"
                  onClick={() => {
                    const list = sectionDesigns.jewellery_box_banner?.features || [];
                    updateSectionToken('jewellery_box_banner', 'features', [...list, { id: 'f-' + Date.now(), text: 'New Feature', enabled: true }]);
                  }}
                  className="text-xs font-bold text-[#941232] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={13} /> Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {(sectionDesigns.jewellery_box_banner?.features || []).map((f, idx) => (
                  <div
                    key={f.id || idx}
                    className={`flex items-center gap-2 p-2 rounded-xl border ${
                      isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={f.enabled !== false}
                      onChange={(e) => {
                        const list = [...(sectionDesigns.jewellery_box_banner?.features || [])];
                        list[idx] = { ...list[idx], enabled: e.target.checked };
                        updateSectionToken('jewellery_box_banner', 'features', list);
                      }}
                      className="cursor-pointer"
                      title="Toggle visibility"
                    />
                    <input
                      type="text"
                      value={f.text}
                      onChange={(e) => {
                        const list = [...(sectionDesigns.jewellery_box_banner?.features || [])];
                        list[idx] = { ...list[idx], text: e.target.value };
                        updateSectionToken('jewellery_box_banner', 'features', list);
                      }}
                      className={`${inp} py-1.5`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const list = (sectionDesigns.jewellery_box_banner?.features || []).filter((_, i) => i !== idx);
                        updateSectionToken('jewellery_box_banner', 'features', list);
                      }}
                      className="p-1.5 text-rose-500 hover:text-rose-600 cursor-pointer shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 6: OUR MOST LOVED PIECES (BESTSELLERS)
      ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "bestsellers" && (
        <div className={cardStyle}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Our Most Loved Pieces Header</h3>
              <p className="text-xs text-slate-400">Configure eyebrow, title, subtitle and View All link for bestsellers</p>
            </div>
            <button
              onClick={() => handleSaveSection('bestsellers')}
              disabled={savingSection === 'bestsellers'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingSection === 'bestsellers' ? <Loader2 size={14} className="animate-spin" /> : savedSection === 'bestsellers' ? <Check size={14} /> : <Save size={14} />}
              {savingSection === 'bestsellers' ? "Saving..." : savedSection === 'bestsellers' ? "Saved!" : "Save Section"}
            </button>
          </div>

          <div className="grid gap-4 max-w-3xl">
            <div>
              <label className={labelStyle}>Eyebrow Subtitle</label>
              <input
                type="text"
                value={sectionDesigns.bestsellers?.eyebrow || "BESTSELLERS"}
                onChange={(e) => updateSectionToken('bestsellers', 'eyebrow', e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className={labelStyle}>Main Section Title</label>
              <input
                type="text"
                value={sectionDesigns.bestsellers?.title || "Our Most Loved Pieces"}
                onChange={(e) => updateSectionToken('bestsellers', 'title', e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className={labelStyle}>Section Subtitle / Description</label>
              <input
                type="text"
                value={sectionDesigns.bestsellers?.subtitle || "Timeless favorites, chosen by you."}
                onChange={(e) => updateSectionToken('bestsellers', 'subtitle', e.target.value)}
                className={inp}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>View All Link Text</label>
                <input
                  type="text"
                  value={sectionDesigns.bestsellers?.viewAllText || "View All Products"}
                  onChange={(e) => updateSectionToken('bestsellers', 'viewAllText', e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className={labelStyle}>View All Link URL</label>
                <input
                  type="text"
                  value={sectionDesigns.bestsellers?.viewAllLink || "/shop"}
                  onChange={(e) => updateSectionToken('bestsellers', 'viewAllLink', e.target.value)}
                  className={inp}
                />
              </div>
            </div>

            {/* Dynamic Typography & Font Sizes */}
            <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Typography Font Sizes (Customizable)</h4>
                <span className="text-[11px] text-slate-400 font-mono">Headings: Cormorant Garamond · Body: Montserrat</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Eyebrow Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.bestsellers?.eyebrowFontSize || ""}
                    onChange={(e) => updateSectionToken('bestsellers', 'eyebrowFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 11px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Title Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.bestsellers?.titleFontSize || ""}
                    onChange={(e) => updateSectionToken('bestsellers', 'titleFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 40px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Subtitle Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.bestsellers?.subtitleFontSize || ""}
                    onChange={(e) => updateSectionToken('bestsellers', 'subtitleFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 14px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 7: TRUST BENEFITS STRIP (WHY CHOOSE ZENZIES)
      ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "trust_benefits" && (
        <div className={cardStyle}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Trust Badges Strip (Why Choose Zenzies)</h3>
              <p className="text-xs text-slate-400">Manage 4 trust badges (Ethically Sourced, Certified Quality, Sustainable Practices, Trusted by 50K+)</p>
            </div>
            <button
              onClick={() => handleSaveSection('trust_benefits')}
              disabled={savingSection === 'trust_benefits'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingSection === 'trust_benefits' ? <Loader2 size={14} className="animate-spin" /> : savedSection === 'trust_benefits' ? <Check size={14} /> : <Save size={14} />}
              {savingSection === 'trust_benefits' ? "Saving..." : savedSection === 'trust_benefits' ? "Saved!" : "Save Section"}
            </button>
          </div>

          <div className="space-y-4 max-w-4xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400">Add, edit, or customize any badge and choose from 40+ curated luxury icons</span>
              <button
                type="button"
                onClick={() => {
                  const items = sectionDesigns.trust_benefits?.items || DEFAULT_TRUST_BENEFITS;
                  updateSectionToken('trust_benefits', 'items', [
                    ...items,
                    { id: 'tb-' + Date.now(), icon: 'gem', title: 'New Badge', desc: 'Badge description', enabled: true }
                  ]);
                }}
                className="text-xs font-bold text-[#941232] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add Trust Badge
              </button>
            </div>

            <div className="grid gap-3">
              {(sectionDesigns.trust_benefits?.items || DEFAULT_TRUST_BENEFITS).map((item, idx) => {
                const IconComp = getIconComponent(item.icon);
                return (
                  <div
                    key={item.id || idx}
                    className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 rounded-xl border ${
                      isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.enabled !== false}
                        onChange={(e) => {
                          const items = [...(sectionDesigns.trust_benefits?.items || DEFAULT_TRUST_BENEFITS)];
                          items[idx] = { ...items[idx], enabled: e.target.checked };
                          updateSectionToken('trust_benefits', 'items', items);
                        }}
                        className="cursor-pointer"
                        title="Enable/Disable badge"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIconPickerTarget({ type: 'trust_benefit', index: idx });
                          setIconPickerOpen(true);
                        }}
                        className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 cursor-pointer shrink-0 flex items-center gap-1.5"
                        title="Choose icon"
                      >
                        <IconComp size={20} />
                        <span className="text-[11px] font-mono hidden md:inline">{item.icon}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const items = [...(sectionDesigns.trust_benefits?.items || DEFAULT_TRUST_BENEFITS)];
                          items[idx] = { ...items[idx], title: e.target.value };
                          updateSectionToken('trust_benefits', 'items', items);
                        }}
                        placeholder="Badge Title (e.g. Ethically Sourced)"
                        className={`${inp} py-1.5 font-semibold`}
                      />
                      <input
                        type="text"
                        value={item.desc}
                        onChange={(e) => {
                          const items = [...(sectionDesigns.trust_benefits?.items || DEFAULT_TRUST_BENEFITS)];
                          items[idx] = { ...items[idx], desc: e.target.value };
                          updateSectionToken('trust_benefits', 'items', items);
                        }}
                        placeholder="Subtitle (e.g. Conflict-free diamonds)"
                        className={`${inp} py-1.5`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const items = (sectionDesigns.trust_benefits?.items || DEFAULT_TRUST_BENEFITS).filter((_, i) => i !== idx);
                        updateSectionToken('trust_benefits', 'items', items);
                      }}
                      className="p-2 text-rose-500 hover:text-rose-600 cursor-pointer shrink-0 self-end sm:self-center"
                      title="Delete badge"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Typography & Font Sizes */}
            <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Typography Font Sizes (Customizable)</h4>
                <span className="text-[11px] text-slate-400 font-mono">Headings: Cormorant Garamond · Body: Montserrat</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Badge Title Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.trust_benefits?.titleFontSize || ""}
                    onChange={(e) => updateSectionToken('trust_benefits', 'titleFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 13px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Badge Description Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.trust_benefits?.descFontSize || ""}
                    onChange={(e) => updateSectionToken('trust_benefits', 'descFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 12px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 8: PROMOTIONAL BANNERS (50/50 SPLIT)
      ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "promotional_banners" && (
        <div className={cardStyle}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Promotional Banners (50/50 Split Layout)</h3>
              <p className="text-xs text-slate-400">Full-width dual split promotional showcase (Crafted for Life's Special Moments & A Gift That Lasts Forever)</p>
            </div>
            <button
              onClick={() => handleSaveSection('promotional_banners')}
              disabled={savingSection === 'promotional_banners'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingSection === 'promotional_banners' ? <Loader2 size={14} className="animate-spin" /> : savedSection === 'promotional_banners' ? <Check size={14} /> : <Save size={14} />}
              {savingSection === 'promotional_banners' ? "Saving..." : savedSection === 'promotional_banners' ? "Saved!" : "Save Section"}
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Banner 1: Left */}
            <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <span className="text-xs font-bold text-[#941232] uppercase tracking-wider block">Banner 1 (Left Showcase)</span>
              <div>
                <label className={labelStyle}>Headline</label>
                <input
                  type="text"
                  value={sectionDesigns.promotional_banners?.banner1Title || "Crafted for Life's Special Moments"}
                  onChange={(e) => updateSectionToken('promotional_banners', 'banner1Title', e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className={labelStyle}>Headline Font Size</label>
                <input
                  type="text"
                  value={sectionDesigns.promotional_banners?.banner1TitleFontSize || ""}
                  onChange={(e) => updateSectionToken('promotional_banners', 'banner1TitleFontSize', e.target.value)}
                  className={`${inp} py-1.5 text-xs`}
                  placeholder="e.g. 36px or clamp(24px, 2.8vw, 36px)"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelStyle}>Button Label</label>
                  <input
                    type="text"
                    value={sectionDesigns.promotional_banners?.banner1BtnText || "Explore Wedding"}
                    onChange={(e) => updateSectionToken('promotional_banners', 'banner1BtnText', e.target.value)}
                    className={inp}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Button Link</label>
                  <input
                    type="text"
                    value={sectionDesigns.promotional_banners?.banner1BtnLink || "/shop?category=Wedding"}
                    onChange={(e) => updateSectionToken('promotional_banners', 'banner1BtnLink', e.target.value)}
                    className={inp}
                  />
                </div>
              </div>
              <div>
                <label className={labelStyle}>Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sectionDesigns.promotional_banners?.banner1Image || "/img/zenzies/wedding_rings_banner.jpg"}
                    onChange={(e) => updateSectionToken('promotional_banners', 'banner1Image', e.target.value)}
                    className={inp}
                  />
                  <label className="flex items-center justify-center px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer shrink-0 bg-white dark:bg-slate-800">
                    <Upload size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleGenericImageUpload('promotional_banners', 'banner1Image', e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Banner 2: Right */}
            <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <span className="text-xs font-bold text-[#941232] uppercase tracking-wider block">Banner 2 (Right Showcase)</span>
              <div>
                <label className={labelStyle}>Headline</label>
                <input
                  type="text"
                  value={sectionDesigns.promotional_banners?.banner2Title || "A Gift That Lasts Forever"}
                  onChange={(e) => updateSectionToken('promotional_banners', 'banner2Title', e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className={labelStyle}>Headline Font Size</label>
                <input
                  type="text"
                  value={sectionDesigns.promotional_banners?.banner2TitleFontSize || ""}
                  onChange={(e) => updateSectionToken('promotional_banners', 'banner2TitleFontSize', e.target.value)}
                  className={`${inp} py-1.5 text-xs`}
                  placeholder="e.g. 36px or clamp(24px, 2.8vw, 36px)"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelStyle}>Button Label</label>
                  <input
                    type="text"
                    value={sectionDesigns.promotional_banners?.banner2BtnText || "Shop Gifts"}
                    onChange={(e) => updateSectionToken('promotional_banners', 'banner2BtnText', e.target.value)}
                    className={inp}
                  />
                </div>
                <div>
                  <label className={labelStyle}>Button Link</label>
                  <input
                    type="text"
                    value={sectionDesigns.promotional_banners?.banner2BtnLink || "/shop?category=Jewellery+Boxes"}
                    onChange={(e) => updateSectionToken('promotional_banners', 'banner2BtnLink', e.target.value)}
                    className={inp}
                  />
                </div>
              </div>
              <div>
                <label className={labelStyle}>Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sectionDesigns.promotional_banners?.banner2Image || "/img/zenzies/gift_necklace_banner.jpg"}
                    onChange={(e) => updateSectionToken('promotional_banners', 'banner2Image', e.target.value)}
                    className={inp}
                  />
                  <label className="flex items-center justify-center px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer shrink-0 bg-white dark:bg-slate-800">
                    <Upload size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleGenericImageUpload('promotional_banners', 'banner2Image', e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 9: OUR STORY (BRAND STORY)
      ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "brand_story" && (
        <div className={cardStyle}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Our Story (Brand Story)</h3>
              <p className="text-xs text-slate-400">Configure heritage copy, artisan photography, watermark seal and handwritten signature</p>
            </div>
            <button
              onClick={() => handleSaveSection('brand_story')}
              disabled={savingSection === 'brand_story'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingSection === 'brand_story' ? <Loader2 size={14} className="animate-spin" /> : savedSection === 'brand_story' ? <Check size={14} /> : <Save size={14} />}
              {savingSection === 'brand_story' ? "Saving..." : savedSection === 'brand_story' ? "Saved!" : "Save Section"}
            </button>
          </div>

          <div className="grid gap-4 max-w-3xl">
            <div>
              <label className={labelStyle}>Eyebrow Subtitle</label>
              <input
                type="text"
                value={sectionDesigns.brand_story?.eyebrow || "OUR STORY"}
                onChange={(e) => updateSectionToken('brand_story', 'eyebrow', e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className={labelStyle}>Headline (supports multi-line)</label>
              <textarea
                rows={2}
                value={sectionDesigns.brand_story?.title || "A Legacy of Grace\nand Craftsmanship"}
                onChange={(e) => updateSectionToken('brand_story', 'title', e.target.value)}
                className={`${inp} resize-none`}
              />
            </div>
            <div>
              <label className={labelStyle}>Story Description Body</label>
              <textarea
                rows={4}
                value={sectionDesigns.brand_story?.description || "At Zenzies, we believe jewelry is more than an accessory — it's a symbol of love, confidence and life's most beautiful moments. Each piece is thoughtfully designed and ethically crafted to be cherished forever."}
                onChange={(e) => updateSectionToken('brand_story', 'description', e.target.value)}
                className={`${inp} resize-none`}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Button Label</label>
                <input
                  type="text"
                  value={sectionDesigns.brand_story?.btnText || "Our Story"}
                  onChange={(e) => updateSectionToken('brand_story', 'btnText', e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className={labelStyle}>Button Link</label>
                <input
                  type="text"
                  value={sectionDesigns.brand_story?.btnLink || "/about"}
                  onChange={(e) => updateSectionToken('brand_story', 'btnLink', e.target.value)}
                  className={inp}
                />
              </div>
            </div>
            <div>
              <label className={labelStyle}>Story Artisan Photo</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sectionDesigns.brand_story?.image || "/img/zenzies/jeweler_craftsmanship.jpg"}
                  onChange={(e) => updateSectionToken('brand_story', 'image', e.target.value)}
                  className={inp}
                />
                <label className="flex items-center justify-center px-3.5 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer shrink-0 bg-white dark:bg-slate-800">
                  <Upload size={16} />
                  <span className="text-xs font-semibold ml-1.5 hidden sm:inline">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleGenericImageUpload('brand_story', 'image', e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>

            {/* Seal & Script */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className={labelStyle}>Seal Brand Text</label>
                <input
                  type="text"
                  value={sectionDesigns.brand_story?.sealBrand || "ZENZIES"}
                  onChange={(e) => updateSectionToken('brand_story', 'sealBrand', e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className={labelStyle}>Seal Year</label>
                <input
                  type="text"
                  value={sectionDesigns.brand_story?.sealYear || "EST. 2024"}
                  onChange={(e) => updateSectionToken('brand_story', 'sealYear', e.target.value)}
                  className={inp}
                />
              </div>
            </div>

            {/* Dynamic Typography & Font Sizes */}
            <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Typography Font Sizes (Customizable)</h4>
                <span className="text-[11px] text-slate-400 font-mono">Headings: Cormorant Garamond · Body: Montserrat</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Eyebrow Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.brand_story?.eyebrowFontSize || ""}
                    onChange={(e) => updateSectionToken('brand_story', 'eyebrowFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 11px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Headline Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.brand_story?.titleFontSize || ""}
                    onChange={(e) => updateSectionToken('brand_story', 'titleFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 42px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Story Body Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.brand_story?.descFontSize || ""}
                    onChange={(e) => updateSectionToken('brand_story', 'descFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 13.5px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 10: CUSTOMER TESTIMONIALS (REVIEWS)
      ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "testimonials" && (
        <div className={cardStyle}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Customer Reviews (Testimonials)</h3>
              <p className="text-xs text-slate-400">Manage headline and verified customer reviews carousel with star ratings & avatars</p>
            </div>
            <button
              onClick={() => handleSaveSection('testimonials')}
              disabled={savingSection === 'testimonials'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingSection === 'testimonials' ? <Loader2 size={14} className="animate-spin" /> : savedSection === 'testimonials' ? <Check size={14} /> : <Save size={14} />}
              {savingSection === 'testimonials' ? "Saving..." : savedSection === 'testimonials' ? "Saved!" : "Save Section"}
            </button>
          </div>

          <div className="space-y-4 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Eyebrow Subtitle</label>
                <input
                  type="text"
                  value={sectionDesigns.testimonials?.eyebrow || "WHAT OUR CUSTOMERS SAY"}
                  onChange={(e) => updateSectionToken('testimonials', 'eyebrow', e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className={labelStyle}>Main Section Title</label>
                <input
                  type="text"
                  value={sectionDesigns.testimonials?.title || "Loved by Thousands"}
                  onChange={(e) => updateSectionToken('testimonials', 'title', e.target.value)}
                  className={inp}
                />
              </div>
            </div>

            {/* Dynamic Typography & Font Sizes */}
            <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Typography Font Sizes (Customizable)</h4>
                <span className="text-[11px] text-slate-400 font-mono">Headings: Cormorant Garamond · Body: Montserrat</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Eyebrow Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.testimonials?.eyebrowFontSize || ""}
                    onChange={(e) => updateSectionToken('testimonials', 'eyebrowFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 11px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Heading Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.testimonials?.titleFontSize || ""}
                    onChange={(e) => updateSectionToken('testimonials', 'titleFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 40px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Review Quote Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.testimonials?.quoteFontSize || ""}
                    onChange={(e) => updateSectionToken('testimonials', 'quoteFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 13px"
                  />
                </div>
              </div>
            </div>

            {/* Reviews CRUD */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2">
                <label className={labelStyle}>Customer Reviews List (CRUD)</label>
                <button
                  type="button"
                  onClick={() => {
                    const list = sectionDesigns.testimonials?.reviews || DEFAULT_REVIEWS;
                    updateSectionToken('testimonials', 'reviews', [
                      ...list,
                      {
                        id: 'rev-' + Date.now(),
                        name: 'Verified Customer',
                        title: 'Verified Buyer',
                        quote: 'Stunning craftsmanship and luxurious packaging!',
                        rating: 5,
                        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
                        enabled: true
                      }
                    ]);
                  }}
                  className="text-xs font-bold text-[#941232] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Review
                </button>
              </div>

              <div className="space-y-3">
                {(sectionDesigns.testimonials?.reviews || DEFAULT_REVIEWS).map((rev, idx) => (
                  <div
                    key={rev.id || idx}
                    className={`p-3.5 rounded-xl border space-y-3 ${
                      isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rev.enabled !== false}
                          onChange={(e) => {
                            const list = [...(sectionDesigns.testimonials?.reviews || DEFAULT_REVIEWS)];
                            list[idx] = { ...list[idx], enabled: e.target.checked };
                            updateSectionToken('testimonials', 'reviews', list);
                          }}
                          className="cursor-pointer"
                        />
                        <span className="text-xs font-bold uppercase text-slate-500">Review #{idx + 1}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const list = (sectionDesigns.testimonials?.reviews || DEFAULT_REVIEWS).filter((_, i) => i !== idx);
                          updateSectionToken('testimonials', 'reviews', list);
                        }}
                        className="text-rose-500 hover:text-rose-600 cursor-pointer p-1"
                        title="Delete review"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={rev.name}
                        onChange={(e) => {
                          const list = [...(sectionDesigns.testimonials?.reviews || DEFAULT_REVIEWS)];
                          list[idx] = { ...list[idx], name: e.target.value };
                          updateSectionToken('testimonials', 'reviews', list);
                        }}
                        placeholder="Customer Name (e.g. Priya S.)"
                        className={inp}
                      />
                      <input
                        type="text"
                        value={rev.title}
                        onChange={(e) => {
                          const list = [...(sectionDesigns.testimonials?.reviews || DEFAULT_REVIEWS)];
                          list[idx] = { ...list[idx], title: e.target.value };
                          updateSectionToken('testimonials', 'reviews', list);
                        }}
                        placeholder="Tag (e.g. Verified Buyer)"
                        className={inp}
                      />
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-400">Stars:</label>
                        <select
                          value={rev.rating || 5}
                          onChange={(e) => {
                            const list = [...(sectionDesigns.testimonials?.reviews || DEFAULT_REVIEWS)];
                            list[idx] = { ...list[idx], rating: Number(e.target.value) };
                            updateSectionToken('testimonials', 'reviews', list);
                          }}
                          className={inp}
                        >
                          {[5, 4, 3, 2, 1].map((r) => (
                            <option key={r} value={r}>{r} Stars ★</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={rev.quote}
                      onChange={(e) => {
                        const list = [...(sectionDesigns.testimonials?.reviews || DEFAULT_REVIEWS)];
                        list[idx] = { ...list[idx], quote: e.target.value };
                        updateSectionToken('testimonials', 'reviews', list);
                      }}
                      placeholder="Customer quote / feedback..."
                      className={`${inp} resize-none`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 11: SOCIAL GALLERY (JOIN OUR SHINING COMMUNITY)
      ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "social_gallery" && (
        <div className={cardStyle}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Social Gallery (Instagram Community)</h3>
              <p className="text-xs text-slate-400">Manage headline and Instagram link (photos are dynamically served from Gallery Manager)</p>
            </div>
            <button
              onClick={() => handleSaveSection('social_gallery')}
              disabled={savingSection === 'social_gallery'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingSection === 'social_gallery' ? <Loader2 size={14} className="animate-spin" /> : savedSection === 'social_gallery' ? <Check size={14} /> : <Save size={14} />}
              {savingSection === 'social_gallery' ? "Saving..." : savedSection === 'social_gallery' ? "Saved!" : "Save Section"}
            </button>
          </div>

          <div className="grid gap-4 max-w-3xl">
            <div>
              <label className={labelStyle}>Eyebrow Subtitle</label>
              <input
                type="text"
                value={sectionDesigns.social_gallery?.eyebrow || "FOLLOW @ZENZIES"}
                onChange={(e) => updateSectionToken('social_gallery', 'eyebrow', e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className={labelStyle}>Main Section Title</label>
              <input
                type="text"
                value={sectionDesigns.social_gallery?.title || "Join Our Shining Community"}
                onChange={(e) => updateSectionToken('social_gallery', 'title', e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className={labelStyle}>Instagram Profile URL</label>
              <input
                type="text"
                value={sectionDesigns.social_gallery?.instagramUrl || "https://www.instagram.com"}
                onChange={(e) => updateSectionToken('social_gallery', 'instagramUrl', e.target.value)}
                className={inp}
              />
            </div>

            {/* Dynamic Typography & Font Sizes */}
            <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Typography Font Sizes (Customizable)</h4>
                <span className="text-[11px] text-slate-400 font-mono">Headings: Cormorant Garamond · Body: Montserrat</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Eyebrow Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.social_gallery?.eyebrowFontSize || ""}
                    onChange={(e) => updateSectionToken('social_gallery', 'eyebrowFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 11px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Heading Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.social_gallery?.titleFontSize || ""}
                    onChange={(e) => updateSectionToken('social_gallery', 'titleFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 40px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          TAB 12: NEWSLETTER (GET EXCLUSIVE OFFERS)
      ──────────────────────────────────────────────────────────────────────── */}
      {activeSubTab === "newsletter" && (
        <div className={cardStyle}>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Newsletter Banner (Get Exclusive Offers)</h3>
              <p className="text-xs text-slate-400">Manage headline, subscription description, CTA button label and background image</p>
            </div>
            <button
              onClick={() => handleSaveSection('newsletter')}
              disabled={savingSection === 'newsletter'}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#941232] hover:bg-[#b01540] text-white text-xs sm:text-sm font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {savingSection === 'newsletter' ? <Loader2 size={14} className="animate-spin" /> : savedSection === 'newsletter' ? <Check size={14} /> : <Save size={14} />}
              {savingSection === 'newsletter' ? "Saving..." : savedSection === 'newsletter' ? "Saved!" : "Save Section"}
            </button>
          </div>

          <div className="grid gap-4 max-w-3xl">
            <div>
              <label className={labelStyle}>Main Headline</label>
              <input
                type="text"
                value={sectionDesigns.newsletter?.title || "Get Exclusive Offers"}
                onChange={(e) => updateSectionToken('newsletter', 'title', e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className={labelStyle}>Subtitle / Description</label>
              <textarea
                rows={2}
                value={sectionDesigns.newsletter?.subtitle || "Subscribe and be the first to know about new collections, special offers and smart jewellery storage tips."}
                onChange={(e) => updateSectionToken('newsletter', 'subtitle', e.target.value)}
                className={`${inp} resize-none`}
              />
            </div>
            <div>
              <label className={labelStyle}>Submit Button Text</label>
              <input
                type="text"
                value={sectionDesigns.newsletter?.btnText || "Subscribe"}
                onChange={(e) => updateSectionToken('newsletter', 'btnText', e.target.value)}
                className={inp}
              />
            </div>
            <div>
              <label className={labelStyle}>Gift Box / Banner Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sectionDesigns.newsletter?.image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=900"}
                  onChange={(e) => updateSectionToken('newsletter', 'image', e.target.value)}
                  className={inp}
                />
                <label className="flex items-center justify-center px-3.5 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 cursor-pointer shrink-0 bg-white dark:bg-slate-800">
                  <Upload size={16} />
                  <span className="text-xs font-semibold ml-1.5 hidden sm:inline">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleGenericImageUpload('newsletter', 'image', e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Accent Script Line 1</label>
                <input
                  type="text"
                  value={sectionDesigns.newsletter?.scriptLine1 || "A Brighter Tomorrow"}
                  onChange={(e) => updateSectionToken('newsletter', 'scriptLine1', e.target.value)}
                  className={inp}
                />
              </div>
              <div>
                <label className={labelStyle}>Accent Script Line 2</label>
                <input
                  type="text"
                  value={sectionDesigns.newsletter?.scriptLine2 || "Starts Here ♡"}
                  onChange={(e) => updateSectionToken('newsletter', 'scriptLine2', e.target.value)}
                  className={inp}
                />
              </div>
            </div>

            {/* Dynamic Typography & Font Sizes */}
            <div className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Typography Font Sizes (Customizable)</h4>
                <span className="text-[11px] text-slate-400 font-mono">Headings: Cormorant Garamond · Body: Montserrat</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Headline Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.newsletter?.titleFontSize || ""}
                    onChange={(e) => updateSectionToken('newsletter', 'titleFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 36px"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">Subtitle Body Size</label>
                  <input
                    type="text"
                    value={sectionDesigns.newsletter?.subtitleFontSize || ""}
                    onChange={(e) => updateSectionToken('newsletter', 'subtitleFontSize', e.target.value)}
                    className={`${inp} py-1.5 text-xs`}
                    placeholder="e.g. 14px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          GLOBAL ICON PICKER MODAL
      ──────────────────────────────────────────────────────────────────────── */}
      <IconPickerModal
        isOpen={iconPickerOpen}
        onClose={() => {
          setIconPickerOpen(false);
          setIconPickerTarget(null);
        }}
        isDarkMode={isDarkMode}
        onSelectIcon={handleIconSelected}
      />
    </div>
  );
};

export default SiteSettingsManager;
