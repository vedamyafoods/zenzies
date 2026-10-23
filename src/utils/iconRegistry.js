import {
  Gem,
  Sparkles,
  Crown,
  Award,
  Star,
  Heart,
  Flame,
  Sun,
  Moon,
  Compass,
  Feather,
  Flower2,
  Key,
  ShieldCheck,
  Shield,
  CheckCircle2,
  BadgeCheck,
  Medal,
  Ribbon,
  Scale,
  Eye,
  Check,
  Leaf,
  Sprout,
  Recycle,
  Globe,
  Users,
  HeartHandshake,
  Smile,
  HandHeart,
  ShoppingBag,
  Gift,
  Package,
  Truck,
  Lock,
  Headphones,
  Clock,
  RefreshCw,
  PhoneCall,
  HelpCircle,
  Tag,
  Percent,
} from 'lucide-react';

export const ICON_CATEGORIES = [
  { id: 'all', label: 'All Icons' },
  { id: 'luxury', label: 'Luxury & Jewellery' },
  { id: 'quality', label: 'Quality & Trust' },
  { id: 'eco', label: 'Eco & Sustainability' },
  { id: 'community', label: 'Community & Care' },
  { id: 'delivery', label: 'Gifts & Shipping' },
  { id: 'security', label: 'Security & Support' },
];

export const AVAILABLE_ICONS = [
  // ─── Luxury & Jewellery ─────────────────────────────────────────────────────
  {
    id: 'gem',
    aliases: ['diamond', 'jewel', 'ring'],
    label: 'Diamond / Gem',
    category: 'luxury',
    keywords: ['gem', 'diamond', 'jewellery', 'stone', 'ring', 'heera', 'luxury'],
    Icon: Gem,
  },
  {
    id: 'sparkles',
    aliases: ['shine', 'glitter'],
    label: 'Sparkles / Elegance',
    category: 'luxury',
    keywords: ['sparkles', 'glitter', 'shine', 'glow', 'luxury', 'chamak'],
    Icon: Sparkles,
  },
  {
    id: 'crown',
    aliases: ['royal', 'king', 'queen'],
    label: 'Crown / Royal Heritage',
    category: 'luxury',
    keywords: ['crown', 'royal', 'heritage', 'queen', 'luxury', 'premium'],
    Icon: Crown,
  },
  {
    id: 'award',
    aliases: ['trophy'],
    label: 'Award / Excellence',
    category: 'luxury',
    keywords: ['award', 'winner', 'excellence', 'best', 'prize'],
    Icon: Award,
  },
  {
    id: 'star',
    aliases: ['rating'],
    label: 'Star / 5-Star Rated',
    category: 'luxury',
    keywords: ['star', 'rating', 'top', 'favorite', 'best'],
    Icon: Star,
  },
  {
    id: 'heart',
    aliases: ['love'],
    label: 'Heart / Crafted with Love',
    category: 'luxury',
    keywords: ['heart', 'love', 'crafted', 'special', 'pyar'],
    Icon: Heart,
  },
  {
    id: 'flower2',
    aliases: ['flower', 'bloom'],
    label: 'Floral / Handcrafted Detail',
    category: 'luxury',
    keywords: ['flower', 'flora', 'handcrafted', 'petal', 'beauty'],
    Icon: Flower2,
  },
  {
    id: 'feather',
    aliases: ['light'],
    label: 'Feather / Ultra Light & Fine',
    category: 'luxury',
    keywords: ['feather', 'light', 'gentle', 'fine', 'soft'],
    Icon: Feather,
  },
  {
    id: 'sun',
    aliases: ['bright'],
    label: 'Sun / Radiant Shine',
    category: 'luxury',
    keywords: ['sun', 'radiant', 'bright', 'gold', 'light'],
    Icon: Sun,
  },
  {
    id: 'flame',
    aliases: ['fire'],
    label: 'Flame / Pure Brilliance',
    category: 'luxury',
    keywords: ['flame', 'fire', 'brilliance', 'spark', 'gold'],
    Icon: Flame,
  },

  // ─── Quality & Certification ────────────────────────────────────────────────
  {
    id: 'shield-check',
    aliases: ['shield', 'certified', 'security'],
    label: 'Certified Quality Shield',
    category: 'quality',
    keywords: ['shield', 'check', 'certified', 'guaranteed', 'quality', 'asli', 'pure'],
    Icon: ShieldCheck,
  },
  {
    id: 'badge-check',
    aliases: ['verified', 'hallmark'],
    label: 'Verified Badge / Hallmark',
    category: 'quality',
    keywords: ['badge', 'verified', 'hallmark', 'authentic', 'bis', 'tested'],
    Icon: BadgeCheck,
  },
  {
    id: 'check-circle-2',
    aliases: ['check', 'done'],
    label: '100% Authentic Guarantee',
    category: 'quality',
    keywords: ['check', 'authentic', 'guaranteed', 'verified', 'safe'],
    Icon: CheckCircle2,
  },
  {
    id: 'medal',
    aliases: ['first'],
    label: 'Medal / Superior Craft',
    category: 'quality',
    keywords: ['medal', 'craft', 'superior', 'gold', 'standard'],
    Icon: Medal,
  },
  {
    id: 'ribbon',
    aliases: ['seal'],
    label: 'Certificate Ribbon',
    category: 'quality',
    keywords: ['ribbon', 'certificate', 'seal', 'honour', 'official'],
    Icon: Ribbon,
  },
  {
    id: 'scale',
    aliases: ['balance', 'weight'],
    label: 'Scale / True Weight & Purity',
    category: 'quality',
    keywords: ['scale', 'balance', 'purity', 'carat', 'weight', 'accurate'],
    Icon: Scale,
  },
  {
    id: 'eye',
    aliases: ['detail', 'inspection'],
    label: 'Master Jeweller Inspected',
    category: 'quality',
    keywords: ['eye', 'inspected', 'detail', 'precision', 'crafted'],
    Icon: Eye,
  },

  // ─── Eco & Sustainability ───────────────────────────────────────────────────
  {
    id: 'leaf',
    aliases: ['eco', 'green', 'nature'],
    label: 'Sustainable Practices',
    category: 'eco',
    keywords: ['leaf', 'sustainable', 'eco', 'green', 'environment', 'nature', 'earth'],
    Icon: Leaf,
  },
  {
    id: 'sprout',
    aliases: ['growth', 'plant'],
    label: 'Ethical & Eco-friendly',
    category: 'eco',
    keywords: ['sprout', 'ethical', 'plant', 'nature', 'conscious', 'green'],
    Icon: Sprout,
  },
  {
    id: 'recycle',
    aliases: ['renew'],
    label: 'Recycled Metals & Stones',
    category: 'eco',
    keywords: ['recycle', 'renewable', 'recycled', 'gold', 'silver', 'earth'],
    Icon: Recycle,
  },
  {
    id: 'globe',
    aliases: ['world', 'earth'],
    label: 'Global Ethical Standards',
    category: 'eco',
    keywords: ['globe', 'world', 'conflict-free', 'international', 'ethical'],
    Icon: Globe,
  },

  // ─── Community & Care ───────────────────────────────────────────────────────
  {
    id: 'users',
    aliases: ['community', 'customers', 'group'],
    label: 'Trusted by 50K+ Customers',
    category: 'community',
    keywords: ['users', 'community', 'customers', 'people', 'trusted', 'crowd'],
    Icon: Users,
  },
  {
    id: 'heart-handshake',
    aliases: ['trust', 'handshake'],
    label: 'Trust & Customer Promise',
    category: 'community',
    keywords: ['trust', 'handshake', 'promise', 'partnership', 'commitment', 'bharosa'],
    Icon: HeartHandshake,
  },
  {
    id: 'smile',
    aliases: ['happy'],
    label: 'Happy & Satisfied Smiles',
    category: 'community',
    keywords: ['smile', 'happy', 'satisfaction', 'joy', 'customer'],
    Icon: Smile,
  },
  {
    id: 'hand-heart',
    aliases: ['care', 'giving'],
    label: 'Handmade Care & Empathy',
    category: 'community',
    keywords: ['care', 'handmade', 'giving', 'love', 'artisan'],
    Icon: HandHeart,
  },

  // ─── Gifts & Shipping ───────────────────────────────────────────────────────
  {
    id: 'gift',
    aliases: ['present', 'box'],
    label: 'Luxury Gift Ready',
    category: 'delivery',
    keywords: ['gift', 'box', 'present', 'packaging', 'unboxing', 'tofa', 'ribbon'],
    Icon: Gift,
  },
  {
    id: 'package',
    aliases: ['box', 'parcel'],
    label: 'Tamper-proof Packaging',
    category: 'delivery',
    keywords: ['package', 'parcel', 'box', 'delivery', 'secure', 'packing'],
    Icon: Package,
  },
  {
    id: 'truck',
    aliases: ['delivery', 'shipping'],
    label: 'Fast & Insured Delivery',
    category: 'delivery',
    keywords: ['truck', 'delivery', 'shipping', 'fast', 'free', 'insured', 'courier'],
    Icon: Truck,
  },
  {
    id: 'shopping-bag',
    aliases: ['bag', 'shop'],
    label: 'Curated Boutique Selection',
    category: 'delivery',
    keywords: ['shopping', 'bag', 'store', 'boutique', 'collection'],
    Icon: ShoppingBag,
  },
  {
    id: 'tag',
    aliases: ['price', 'discount'],
    label: 'Fair Transparent Pricing',
    category: 'delivery',
    keywords: ['tag', 'price', 'value', 'honest', 'direct'],
    Icon: Tag,
  },

  // ─── Security & Support ─────────────────────────────────────────────────────
  {
    id: 'lock',
    aliases: ['secure', 'payment'],
    label: '100% Secure Payment',
    category: 'security',
    keywords: ['lock', 'secure', 'safe', 'payment', 'razorpay', 'upi', 'card'],
    Icon: Lock,
  },
  {
    id: 'headphones',
    aliases: ['support', 'help', 'service'],
    label: 'Dedicated VIP Support',
    category: 'security',
    keywords: ['headphones', 'support', 'help', 'service', 'chat', 'contact'],
    Icon: Headphones,
  },
  {
    id: 'phone-call',
    aliases: ['call', 'concierge'],
    label: 'Jewellery Concierge Call',
    category: 'security',
    keywords: ['phone', 'call', 'concierge', 'expert', 'advice'],
    Icon: PhoneCall,
  },
  {
    id: 'refresh-cw',
    aliases: ['return', 'exchange'],
    label: 'Easy 7-Day Returns',
    category: 'security',
    keywords: ['return', 'exchange', 'refresh', 'replacement', 'hassle-free'],
    Icon: RefreshCw,
  },
  {
    id: 'clock',
    aliases: ['time', 'fast'],
    label: 'Quick 24-48h Dispatch',
    category: 'security',
    keywords: ['clock', 'time', 'dispatch', 'fast', 'speed', 'samay'],
    Icon: Clock,
  },
];

// Map lookup table for quick component retrieval
const ICON_LOOKUP = {};
AVAILABLE_ICONS.forEach((item) => {
  ICON_LOOKUP[item.id.toLowerCase()] = item.Icon;
  if (Array.isArray(item.aliases)) {
    item.aliases.forEach((alias) => {
      ICON_LOOKUP[alias.toLowerCase()] = item.Icon;
    });
  }
});

/**
 * Helper to get Lucide icon component by name / id
 */
export const getIconComponent = (iconName) => {
  if (!iconName) return Gem;
  const key = String(iconName).trim().toLowerCase();
  return ICON_LOOKUP[key] || Gem;
};

/**
 * Helper to get icon metadata by id
 */
export const getIconMetadata = (iconName) => {
  if (!iconName) return AVAILABLE_ICONS[0];
  const key = String(iconName).trim().toLowerCase();
  return (
    AVAILABLE_ICONS.find(
      (item) => item.id.toLowerCase() === key || item.aliases?.includes(key)
    ) || AVAILABLE_ICONS[0]
  );
};
