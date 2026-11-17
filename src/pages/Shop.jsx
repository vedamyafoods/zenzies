import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../components/Firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import {
  Search, SlidersHorizontal, X, RotateCcw, Check, Sparkles, Tag,
  ShoppingBag, Gem
} from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import QuickView from '../components/QuickView';
import Breadcrumb from '../components/Breadcrumb';
import AddToCartModal from '../components/AddToCartModal';
import ProductCard from '../components/ProductCard';
import { listenToTags } from '../services/tagsService';
import useSEO from '../hooks/useSEO';

const fallbackProducts = [
  {
    id: 'shop-1',
    name: 'Luxury Velvet Jewellery Organizer Box',
    category: 'Jewellery Boxes',
    productType: 'box',
    brand: 'ZENZIES',
    price: 1499,
    original_price: 2499,
    material: 'Velvet',
    image: 'img/jewellery/j.png',
    stock: 10,
    tags: ['Jewellery Boxes', 'Best Sellers']
  }
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [addModalProduct, setAddModalProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter States
  const [priceLimit, setPriceLimit] = useState(100000);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [availability, setAvailability] = useState('all');

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Dynamic SEO based on active category
  const seoCategory = selectedCategory !== 'All' ? selectedCategory : null;
  const seoTitle = seoCategory
    ? `Shop ${seoCategory} | Zenzies Fine Jewellery & Organizers`
    : 'Shop Jewellery Organizer Boxes & Handcrafted Jewellery | Zenzies';
  const seoDescription = seoCategory
    ? `Explore Zenzies ${seoCategory.toLowerCase()} collection. Premium anti-tarnish quality, velvet packaging, and express insured delivery across India.`
    : 'Discover our complete catalogue of travel jewellery organizer boxes, anti-tarnish jewellery, and gift sets. Pan-India express delivery.';

  useSEO({
    title: seoTitle,
    description: seoDescription,
    keywords: `zenzies shop, buy jewellery box online, jewellery organizer box india, fine jewellery india, jewellery bundles, ring organizer, earring box`,
    canonical: '/shop',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": seoTitle,
      "url": "https://www.zenzies.in/shop",
      "description": seoDescription
    }
  });

  useEffect(() => {
    const unsub = listenToTags((tagsList) => setAvailableTags(tagsList));
    return () => unsub();
  }, []);

  // Helper to sync query parameters with URL
  const updateFilterParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'all' || (Array.isArray(value) && value.length === 0)) {
      newParams.delete(key);
    } else if (Array.isArray(value)) {
      newParams.set(key, value.join(','));
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    const searchVal = searchParams.get('search') || searchParams.get('q');
    const categoryQuery = searchParams.get('category');
    const itemQuery = searchParams.get('item');
    const filterQuery = searchParams.get('filter');
    const materialQuery = searchParams.get('material');
    const tagQuery = searchParams.get('tag');
    const sortQuery = searchParams.get('sort');
    const maxPriceQuery = searchParams.get('maxPrice');

    if (searchVal) {
      setSearchTerm(searchVal);
    } else if (itemQuery) {
      setSearchTerm(itemQuery.replace(/-/g, ' '));
    } else {
      setSearchTerm('');
    }

    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    } else {
      setSelectedCategory('All');
    }

    if (materialQuery) {
      setSelectedMaterials(materialQuery.split(',').filter(Boolean));
    } else {
      setSelectedMaterials([]);
    }

    if (tagQuery) {
      setSelectedTags(tagQuery.split(',').filter(Boolean));
    } else if (filterQuery === 'new' || filterQuery === 'new-arrivals') {
      setSelectedTags(['New Arrivals']);
    } else if (filterQuery === 'bestsellers') {
      setSelectedTags(['Bestsellers']);
    } else {
      setSelectedTags([]);
    }

    if (sortQuery) {
      setSortBy(sortQuery);
    } else if (filterQuery === 'new') {
      setSortBy('newest');
    }

    if (maxPriceQuery && !isNaN(Number(maxPriceQuery))) {
      setPriceLimit(Number(maxPriceQuery));
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const dbProducts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(dbProducts);
      } else {
        setProducts(fallbackProducts);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to products:", error);
      setProducts(fallbackProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const maxProductPrice = useMemo(() => {
    if (!products || products.length === 0) return 20000;
    const maxP = Math.max(...products.map(p => Number(p.price) || 0));
    return Math.max(maxP, 10000);
  }, [products]);

  useEffect(() => {
    if (products.length > 0 && !searchParams.get('maxPrice')) {
      setPriceLimit(maxProductPrice);
    }
  }, [maxProductPrice, products.length, searchParams]);

  const categories = ['All', 'Jewellery Boxes', 'Jewellery', 'Bundles', 'Earrings', 'Rings', 'Necklace', 'Bracelet', 'Bangles'];
  const materialsList = ['Velvet', 'Leatherette', 'Kundan', 'Gold Plated', 'Silver', 'Pearl', 'Crystal'];

  const isProductInCategory = (product, cat) => {
    if (cat === 'All') return true;
    const catLower = cat.toLowerCase();
    const pType = (product.productType || '').toLowerCase();
    const pCat = (product.category || '').toLowerCase();

    if (catLower === 'jewellery boxes' || catLower === 'boxes') {
      return pType === 'box' || pCat.includes('box');
    }
    if (catLower === 'bundles' || catLower === 'bundle') {
      return pType === 'bundle' || pCat.includes('bundle');
    }
    if (catLower === 'jewellery') {
      return pType === 'jewellery' || (!pCat.includes('box') && !pCat.includes('bundle'));
    }
    return pCat === catLower || pCat.includes(catLower);
  };

  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    categories.forEach(cat => {
      if (cat === 'All') return;
      counts[cat] = products.filter(p => isProductInCategory(p, cat)).length;
    });
    return counts;
  }, [products]);

  const toggleMaterial = (mat) => {
    const nextMaterials = selectedMaterials.includes(mat)
      ? selectedMaterials.filter(m => m !== mat)
      : [...selectedMaterials, mat];
    setSelectedMaterials(nextMaterials);
    updateFilterParam('material', nextMaterials);
  };

  const toggleTag = (tagName) => {
    const nextTags = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName];
    setSelectedTags(nextTags);
    updateFilterParam('tag', nextTags);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceLimit(maxProductPrice);
    setSelectedMaterials([]);
    setSelectedTags([]);
    setAvailability('all');
    setSortBy('newest');
    setSearchParams({});
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== 'All') count++;
    if (priceLimit < maxProductPrice) count++;
    if (selectedMaterials.length > 0) count += selectedMaterials.length;
    if (selectedTags.length > 0) count += selectedTags.length;
    if (availability !== 'all') count++;
    return count;
  }, [searchTerm, selectedCategory, priceLimit, maxProductPrice, selectedMaterials, selectedTags, availability]);

  const filteredProducts = products.filter(p => {
    const price = Number(p.price) || 0;
    const queryStr = searchTerm.toLowerCase().trim();

    const matchesSearch = !queryStr ||
      (p.name && p.name.toLowerCase().includes(queryStr)) ||
      (p.category && p.category.toLowerCase().includes(queryStr)) ||
      (p.productType && p.productType.toLowerCase().includes(queryStr)) ||
      (p.brand && p.brand.toLowerCase().includes(queryStr)) ||
      (p.description && p.description.toLowerCase().includes(queryStr)) ||
      (Array.isArray(p.tags) && p.tags.some(t => String(t).toLowerCase().includes(queryStr)));

    const matchesCategory = isProductInCategory(p, selectedCategory);
    const matchesPrice = price <= priceLimit;

    const matchesMaterial = selectedMaterials.length === 0 || selectedMaterials.some(m => {
      const mat = m.toLowerCase();
      return (p.name && p.name.toLowerCase().includes(mat)) ||
        (p.description && p.description.toLowerCase().includes(mat)) ||
        (p.material && p.material.toLowerCase().includes(mat)) ||
        (Array.isArray(p.tags) && p.tags.some(t => String(t).toLowerCase().includes(mat)));
    });

    const matchesTags = selectedTags.length === 0 || selectedTags.some(t => {
      const tagStr = t.toLowerCase().trim();
      return Array.isArray(p.tags) && p.tags.some(pt => String(pt).toLowerCase() === tagStr);
    });

    let matchesAvailability = true;
    if (availability === 'inStock') {
      matchesAvailability = Number(p.stock) > 0;
    } else if (availability === 'onSale') {
      matchesAvailability = Number(p.original_price) > Number(p.price);
    }

    return matchesSearch && matchesCategory && matchesPrice && matchesMaterial && matchesTags && matchesAvailability;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'bestsellers') return (b.salesCount || b.stock || 0) - (a.salesCount || a.stock || 0);
    return 0;
  });

  const handleAddToCartSuccess = (product) => {
    setAddModalProduct(product);
    setIsAddModalOpen(true);
  };

  // Reusable Sidebar Content
  const FilterSidebarContent = () => (
    <div className="space-y-6 text-[#211A16] font-body">
      {/* Title */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E8DDD2]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#956638]" />
          <h3 className="font-serif text-lg text-[#211A16] font-normal tracking-wide">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#956638] text-white text-[11px] font-semibold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold uppercase tracking-wider text-[#956638] hover:text-[#211A16] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={11} /> Reset
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#956638]">
          Categories
        </h4>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  updateFilterParam('category', cat);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FAF2E8] text-[#956638] font-semibold border border-[#956638]/40 shadow-2xs'
                    : 'text-[#6B5E52] hover:bg-white hover:text-[#211A16]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#956638] text-white' : 'bg-[#F2EBE1] text-[#9E9082]'}`}>
                  {categoryCounts[cat] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-2.5 pt-3 border-t border-[#E8DDD2]">
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-[#211A16]">
          <span>Max Price</span>
          <span className="text-[#956638] font-serif text-sm">₹{Number(priceLimit).toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxProductPrice}
          step={250}
          value={priceLimit}
          onChange={(e) => {
            const val = Number(e.target.value);
            setPriceLimit(val);
            updateFilterParam('maxPrice', val);
          }}
          className="w-full accent-[#956638] cursor-pointer h-1.5 bg-[#E8DDD2] rounded-lg border-none"
        />
        <div className="flex justify-between text-xs text-[#9E9082]">
          <span>₹0</span>
          <span>₹{Number(maxProductPrice).toLocaleString()}</span>
        </div>
      </div>

      {/* Tags Filter */}
      {availableTags.length > 0 && (
        <div className="space-y-2.5 pt-3 border-t border-[#E8DDD2]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#956638] flex items-center gap-1.5">
            <Tag size={13} /> Tags & Highlights
          </h4>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {availableTags.map((tagObj) => {
              const checked = selectedTags.some(t => t.toLowerCase() === tagObj.name.toLowerCase());
              return (
                <button
                  key={tagObj.id}
                  onClick={() => toggleTag(tagObj.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
                    checked
                      ? "bg-[#211A16] text-white border-[#211A16]"
                      : "bg-white text-[#6B5E52] border-[#E8DDD2] hover:border-[#956638]"
                  }`}
                >
                  <span>{tagObj.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Materials */}
      <div className="space-y-2.5 pt-3 border-t border-[#E8DDD2]">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#956638]">
          Material & Finish
        </h4>
        <div className="space-y-1.5">
          {materialsList.map((mat) => {
            const checked = selectedMaterials.includes(mat);
            return (
              <label
                key={mat}
                onClick={() => toggleMaterial(mat)}
                className="flex items-center gap-2.5 cursor-pointer text-sm text-[#6B5E52] hover:text-[#211A16] transition-colors"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${checked ? 'bg-[#956638] border-[#956638] text-white' : 'border-[#E8DDD2] bg-white'}`}>
                  {checked && <Check size={11} strokeWidth={3} />}
                </div>
                <span>{mat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-2.5 pt-3 border-t border-[#E8DDD2]">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#956638]">
          Availability
        </h4>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'inStock', label: 'In Stock Only' },
            { id: 'onSale', label: 'On Sale / Privilege' },
          ].map((opt) => (
            <label
              key={opt.id}
              onClick={() => setAvailability(opt.id)}
              className="flex items-center gap-2.5 cursor-pointer text-sm text-[#6B5E52] hover:text-[#211A16] transition-colors"
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${availability === opt.id ? 'border-[#956638]' : 'border-[#E8DDD2] bg-white'}`}>
                {availability === opt.id && <div className="w-2 h-2 rounded-full bg-[#956638]" />}
              </div>
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-body text-[#211A16]">
      {selectedProduct && <QuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

      {/* ── Refined Light Header / Breadcrumb ── */}
      <div className="w-full bg-[#FAF7F2] border-b border-[#E8DDD2] pt-24 sm:pt-28 pb-5">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6B5E52] mb-3">
            <Link to="/" className="hover:text-[#956638] transition-colors">Home</Link>
            <span className="text-[#9E9082]">/</span>
            <span className="text-[#211A16] font-semibold">Shop Collection</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <span className="eyebrow-text block">Boutique Catalogue</span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#211A16] font-normal tracking-tight mt-0.5">
                {selectedCategory === 'All' ? 'Fine Jewellery & Organizer Boxes' : selectedCategory}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#6B5E52]">
              Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'creation' : 'creations'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Category Quick Pills Row ── */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  updateFilterParam('category', cat);
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#211A16] text-white border-[#211A16] shadow-sm font-semibold'
                    : 'bg-white text-[#211A16] border-[#E8DDD2] hover:border-[#956638]'
                }`}
              >
                <span>{cat}</span>
                <span className="ml-1.5 opacity-60 text-xs">({categoryCounts[cat] ?? 0})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Catalog Content Area ── */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 pb-32 lg:pb-24">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Desktop Filter Sidebar (Left) */}
          <aside className="hidden lg:block w-72 shrink-0 card-luxury p-6 lg:sticky lg:top-24">
            <FilterSidebarContent />
          </aside>

          {/* Main Catalog Column (Right) */}
          <div className="flex-1 min-w-0 w-full">

            {/* Top Controls Bar: Search, Mobile Filters, Sort Dropdown */}
            <div className="card-luxury p-4 mb-6 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

                {/* Search Input */}
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#956638]" size={16} />
                  <input
                    type="text"
                    placeholder="Search boxes, earrings, rings, bundles..."
                    className="input-luxury w-full pl-10 pr-9 min-h-[42px] text-xs sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Mobile Filter Button + Sort Dropdown */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden btn-luxury-dark text-xs min-h-[42px] px-4 py-2"
                  >
                    <SlidersHorizontal size={14} />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#956638] text-white text-[10px] font-bold flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#956638] uppercase tracking-wider hidden sm:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input-luxury text-xs py-2 px-3 pr-8 min-h-[42px] cursor-pointer"
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Active Filter Chips */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8DDD2]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#956638]">Active:</span>

                  {selectedCategory !== 'All' && (
                    <span className="badge-luxury">
                      {selectedCategory}
                      <X size={12} className="cursor-pointer hover:scale-110 ml-1" onClick={() => setSelectedCategory('All')} />
                    </span>
                  )}

                  {priceLimit < maxProductPrice && (
                    <span className="badge-luxury">
                      Under ₹{Number(priceLimit).toLocaleString()}
                      <X size={12} className="cursor-pointer hover:scale-110 ml-1" onClick={() => setPriceLimit(maxProductPrice)} />
                    </span>
                  )}

                  {selectedMaterials.map(mat => (
                    <span key={mat} className="badge-luxury">
                      {mat}
                      <X size={12} className="cursor-pointer hover:scale-110 ml-1" onClick={() => toggleMaterial(mat)} />
                    </span>
                  ))}

                  {selectedTags.map(tag => (
                    <span key={tag} className="badge-luxury-dark text-xs py-1 px-3">
                      {tag}
                      <X size={12} className="cursor-pointer hover:scale-110 ml-1" onClick={() => toggleTag(tag)} />
                    </span>
                  ))}

                  {availability !== 'all' && (
                    <span className="badge-luxury">
                      {availability === 'inStock' ? 'In Stock' : 'On Sale'}
                      <X size={12} className="cursor-pointer hover:scale-110 ml-1" onClick={() => setAvailability('all')} />
                    </span>
                  )}

                  {searchTerm && (
                    <span className="badge-luxury">
                      "{searchTerm}"
                      <X size={12} className="cursor-pointer hover:scale-110 ml-1" onClick={() => setSearchTerm('')} />
                    </span>
                  )}

                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-[#956638] underline hover:text-[#211A16] ml-2 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* ── Product Grid: Adaptive Responsive Layout ── */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card-luxury p-4 space-y-3 animate-pulse">
                    <div className="aspect-square bg-[#F3ECE3] rounded-xl" />
                    <div className="h-3 bg-[#F3ECE3] rounded w-3/4" />
                    <div className="h-3 bg-[#F3ECE3] rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              /* Empty State */
              <div className="card-luxury py-16 px-6 text-center max-w-lg mx-auto space-y-4">
                <ShoppingBag size={36} strokeWidth={1.5} className="mx-auto text-[#956638]" />
                <h3 className="font-serif text-2xl text-[#211A16] font-normal">No creations found</h3>
                <p className="body-text text-sm sm:text-base text-[#6B5E52]">
                  We couldn't find matching pieces with your current search or filter criteria.
                </p>
                <div className="pt-2">
                  <button
                    onClick={clearAllFilters}
                    className="btn-luxury-primary"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : sortedProducts.length === 1 ? (
              /* Adaptive 1-Product Layout (Balanced presentation, no 75% empty right side) */
              <div className="max-w-[420px] mx-auto py-4">
                <div className="mb-4 text-center">
                  <span className="eyebrow-text block">Featured Piece</span>
                  <p className="text-xs text-[#6B5E52] mt-0.5">Showing the single piece matching your criteria</p>
                </div>
                <ProductCard
                  product={sortedProducts[0]}
                  onAddToCartSuccess={handleAddToCartSuccess}
                />
              </div>
            ) : sortedProducts.length === 2 ? (
              /* Adaptive 2-Product Layout (Balanced 2-col presentation) */
              <div className="grid grid-cols-1 sm:grid-cols-2 max-w-[840px] mx-auto gap-6 py-4">
                {sortedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onAddToCartSuccess={handleAddToCartSuccess}
                  />
                ))}
              </div>
            ) : (
              /* Standard 3-4 Column Luxury Grid */
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {sortedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onAddToCartSuccess={handleAddToCartSuccess}
                  />
                ))}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Drawer Filter */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-[200] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-[#211A16]/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white p-6 overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E8DDD2] mb-6">
                  <span className="font-serif text-xl text-[#211A16]">Filters</span>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 text-[#6B5E52] hover:text-[#211A16]"
                  >
                    <X size={20} />
                  </button>
                </div>
                <FilterSidebarContent />
              </div>
              <div className="pt-6 border-t border-[#E8DDD2] mt-6">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="btn-luxury-primary w-full justify-center"
                >
                  Show Results ({sortedProducts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add To Cart Confirmation Popup Modal */}
      <AddToCartModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        product={addModalProduct}
      />
    </div>
  );
};

export default Shop;
