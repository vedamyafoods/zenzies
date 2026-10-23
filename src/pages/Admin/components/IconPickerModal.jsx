import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Check,
  Sparkles,
  Info
} from 'lucide-react';
import {
  AVAILABLE_ICONS,
  ICON_CATEGORIES,
  getIconComponent,
} from '../../../utils/iconRegistry';

export default function IconPickerModal({
  isOpen,
  onClose,
  selectedIcon,
  onSelectIcon,
  isDarkMode = false,
  title = 'Choose an Icon',
  subtitle = 'Select an icon for your trust & feature badges',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredIcons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return AVAILABLE_ICONS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (!q) return true;
      if (item.label.toLowerCase().includes(q)) return true;
      if (item.id.toLowerCase().includes(q)) return true;
      if (item.keywords && item.keywords.some((kw) => kw.toLowerCase().includes(q))) {
        return true;
      }
      return false;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const currentIconKey = String(selectedIcon || '').trim().toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Modal Dialog Box */}
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col max-h-[85vh] overflow-hidden ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#956638]/15 text-[#956638] flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3 shrink-0 bg-slate-50/50 dark:bg-slate-800/30">
          {/* Search Input */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search icons (e.g. diamond, gift, shield, truck, star, trust)..."
              autoFocus
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm outline-none border transition-all ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-[#956638] placeholder:text-slate-500'
                  : 'bg-white border-slate-200 text-slate-800 focus:border-[#956638] placeholder:text-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {ICON_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#956638] text-white shadow-xs font-semibold'
                      : isDarkMode
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Icons Grid Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-[280px]">
          {filteredIcons.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Info size={28} className="mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium">No icons match your search "{searchQuery}"</p>
              <p className="text-xs text-slate-400">Try searching for keywords like "gem", "safe", "gift", or "box"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {filteredIcons.map((item) => {
                const IconComponent = item.Icon;
                const isSelected =
                  currentIconKey === item.id.toLowerCase() ||
                  (item.aliases && item.aliases.includes(currentIconKey));

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectIcon(item.id);
                      onClose();
                    }}
                    className={`group relative p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#956638] bg-[#956638]/10 ring-2 ring-[#956638]/30'
                        : isDarkMode
                        ? 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800'
                        : 'border-slate-200 bg-white hover:border-[#956638]/40 hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {/* Icon visual container */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                        isSelected
                          ? 'bg-[#956638] text-white shadow-xs'
                          : isDarkMode
                          ? 'bg-slate-800 text-[#E9D9C7]'
                          : 'bg-[#FAF7F2] text-[#65472D] border border-[#E8DDD2]'
                      }`}
                    >
                      <IconComponent size={20} strokeWidth={1.8} />
                    </div>

                    {/* Icon details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold truncate text-slate-900 dark:text-white leading-tight">
                          {item.label.split('/')[0].trim()}
                        </span>
                        {isSelected && (
                          <span className="text-[#956638] shrink-0">
                            <Check size={14} strokeWidth={2.8} />
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {item.label.includes('/') ? item.label.split('/')[1]?.trim() : item.id}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredIcons.length}</strong> curated icons
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
