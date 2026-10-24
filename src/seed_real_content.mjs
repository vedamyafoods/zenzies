import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAD-33D6F3pEm_73vQbqDtpwXmwWwJqobo",
  authDomain: "zenzies-f3971.firebaseapp.com",
  projectId: "zenzies-f3971",
  storageBucket: "zenzies-f3971.firebasestorage.app",
  messagingSenderId: "694511372753",
  appId: "1:694511372753:web:f15ade02c0df7d0d7338f0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const realHeroData = {
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
  benefits: [
    { id: "b1", icon: "gem", text: "Trendy Designs" },
    { id: "b2", icon: "gift", text: "Perfect for Gifting" },
    { id: "b3", icon: "shield-check", text: "Secure Payment" },
    { id: "b4", icon: "truck", text: "Fast Delivery" }
  ]
};

const realSectionDesigns = {
  hero: {
    enabled: true,
    backgroundColor: '#FAF6F0',
    backgroundImage: '/img/zenzies/hero_banner_lifestyle.png',
    backgroundSize: 'cover',
    backgroundPosition: 'center right',
    backgroundRepeat: 'no-repeat',
    paddingTop: '60px',
    paddingBottom: '60px',
    eyebrow: "JEWELLERY & EVERYDAY ORGANIZATION",
    line1: "Little Boxes.",
    line2: "Beautiful Things.",
    subtitle: "Discover beautiful jewellery and practical organizer boxes designed for your everyday moments.",
    btn1Text: "Shop Jewellery",
    btn1Link: "/shop",
    btn2Text: "Explore Jewellery Boxes",
    btn2Link: "/shop?category=Jewellery+Boxes",
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
    accentColor: '#956638'
  },
  jewellery_box_banner: {
    enabled: true,
    backgroundColor: '#FBF7F2',
    backgroundImage: '/img/zenzies/jewellery_box_promo_clean_bg.jpg',
    backgroundSize: 'cover',
    backgroundPosition: 'center right',
    backgroundRepeat: 'no-repeat',
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
      { id: 'f4', text: 'Perfect for Gifting', enabled: true }
    ]
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
    btnBorderRadius: '5px'
  },
  trust_benefits: {
    enabled: true,
    backgroundColor: '#FAF7F2',
    paddingTop: '20px',
    paddingBottom: '20px',
    titleColor: '#211A16',
    textColor: '#62564B',
    iconColor: '#65472D',
    showDividers: true,
    items: [
      { id: 'tb1', icon: 'gem', title: 'Ethically Sourced', desc: 'Conflict-free diamonds', enabled: true },
      { id: 'tb2', icon: 'shield-check', title: 'Certified Quality', desc: 'Authenticity guaranteed', enabled: true },
      { id: 'tb3', icon: 'leaf', title: 'Sustainable Practices', desc: 'A brighter tomorrow', enabled: true },
      { id: 'tb4', icon: 'users', title: 'Trusted by 50K+', desc: 'Happy customers', enabled: true }
    ]
  },
  promotional_banners: {
    enabled: true,
    fullWidth: true,
    bannerHeight: '480px',
    showDivider: true,
    backgroundColor: '#FAF7F2',
    paddingTop: '0px',
    paddingBottom: '0px',
    banner1Eyebrow: '',
    banner1Title: "Crafted for Life's Special Moments",
    banner1TitleColor: '#211A16',
    banner1BtnText: 'Explore Wedding',
    banner1BtnLink: '/shop?category=Wedding',
    banner1BtnBgColor: '#8C6239',
    banner1BtnTextColor: '#FFFFFF',
    banner1Image: '/img/zenzies/wedding_rings_banner.jpg',
    banner1Align: 'right',
    banner1OverlayOpacity: 0,
    banner2Eyebrow: '',
    banner2Title: 'A Gift That Lasts Forever',
    banner2TitleColor: '#FFFFFF',
    banner2BtnText: 'Shop Gifts',
    banner2BtnLink: '/shop?category=Jewellery+Boxes',
    banner2BtnBgColor: '#FFFFFF',
    banner2BtnTextColor: '#211A16',
    banner2Image: '/img/zenzies/gift_necklace_banner.jpg',
    banner2Align: 'left',
    banner2OverlayOpacity: 0.12
  },
  brand_story: {
    enabled: true,
    backgroundColor: '#FAF7F2',
    paddingTop: '56px',
    paddingBottom: '72px',
    eyebrow: 'OUR STORY',
    title: 'A Legacy of Grace\nand Craftsmanship',
    description: "At Zenzies, we believe jewelry is more than an accessory — it's a symbol of love, confidence and life's most beautiful moments. Each piece is thoughtfully designed and ethically crafted to be cherished forever.",
    btnText: 'Our Story',
    btnLink: '/about',
    btnEnabled: true,
    btnBgColor: '#8C6239',
    image: '/img/zenzies/jeweler_craftsmanship.jpg',
    sealEnabled: true,
    sealTopText: 'FINE JEWELLERS',
    sealBrand: 'ZENZIES',
    sealYear: 'EST. 2024',
    sealColor: '#C5A880',
    scriptLine1: 'Handcrafted',
    scriptLine2: 'With Love ♡',
    scriptColor: '#C5A880',
    titleColor: '#211A16',
    subtitleColor: '#5A5046',
    accentColor: '#8C6239'
  },
  testimonials: {
    enabled: true,
    backgroundColor: '#FAF7F2',
    paddingTop: '48px',
    paddingBottom: '80px',
    eyebrow: 'WHAT OUR CUSTOMERS SAY',
    title: 'Loved by Thousands',
    titleColor: '#211A16',
    cardBackgroundColor: '#FFFFFF',
    cardBorderColor: '#E8DDD2',
    accentColor: '#8C6239',
    starColor: '#E5A83B',
    reviews: [
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
    ]
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
    accentColor: '#956638'
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
    titleColor: '#211A16'
  }
};

async function seed() {
  console.log("Seeding real website content to Firebase Firestore...");
  await setDoc(doc(db, "site_settings", "hero"), realHeroData);
  console.log("✓ site_settings/hero written successfully");

  await setDoc(doc(db, "site_settings", "section_designs"), realSectionDesigns, { merge: true });
  console.log("✓ site_settings/section_designs merged successfully");

  console.log("ALL REAL CONTENT SEEDED SUCCESSFULLY!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
