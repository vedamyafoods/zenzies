// migrate_all_data.mjs
// Comprehensive data migration script for Zenzies website and admin panel
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, addDoc, collection, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';

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

// ─── 1. Canonical Categories ──────────────────────────────────────────────────
const canonicalCategories = [
  {
    name: "Rings",
    slug: "rings",
    description: "Fine crafted rings, solitaire bands and everyday statement pieces.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400",
    link: "/shop?category=Rings",
    order: 1,
    status: "Active"
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    description: "Layered necklaces, elegant chains, chokers and timeless pendants.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400",
    link: "/shop?category=Necklace",
    order: 2,
    status: "Active"
  },
  {
    name: "Earrings",
    slug: "earrings",
    description: "Studs, hoops, drops and chandelier earrings designed for all-day comfort.",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=400",
    link: "/shop?category=Earrings",
    order: 3,
    status: "Active"
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    description: "Tennis bracelets, sleek kadas, chain cuffs and stackable charms.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400",
    link: "/shop?category=Bracelet",
    order: 4,
    status: "Active"
  },
  {
    name: "Jewellery Boxes",
    slug: "jewellery-boxes",
    description: "Luxury velvet organizer boxes, travel pouches and stackable cases.",
    image: "/img/zenzies/jewellery_box_lifestyle.jpg",
    link: "/shop?category=Jewellery+Boxes",
    order: 5,
    status: "Active"
  },
  {
    name: "Bundles",
    slug: "bundles",
    description: "Thoughtfully curated jewellery and organizer gift sets for weddings & celebrations.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400",
    link: "/shop?category=Bundles",
    order: 6,
    status: "Active"
  },
  {
    name: "Gifts",
    slug: "gifts",
    description: "Special celebration presents, anniversary surprises and festive gifting combos.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400",
    link: "/shop?category=Jewellery+Boxes",
    order: 7,
    status: "Active"
  }
];

// ─── 2. Canonical Subcategories ───────────────────────────────────────────────
const canonicalSubcategories = [
  { name: "Solitaire Rings", parentCategory: "Rings", description: "Timeless single diamond solitaire rings", status: "Active" },
  { name: "Band & Stacking Rings", parentCategory: "Rings", description: "Minimal stackable everyday bands", status: "Active" },
  { name: "Choker Necklaces", parentCategory: "Necklaces", description: "Close-fitting elegant collar neckpieces", status: "Active" },
  { name: "Pendant Necklaces", parentCategory: "Necklaces", description: "Delicate chains with signature motifs", status: "Active" },
  { name: "Stud Earrings", parentCategory: "Earrings", description: "Everyday subtle gemstone studs", status: "Active" },
  { name: "Hoop Earrings", parentCategory: "Earrings", description: "Classic huggies and large statement hoops", status: "Active" },
  { name: "Tennis Bracelets", parentCategory: "Bracelets", description: "Continuous sparkling line bracelets", status: "Active" },
  { name: "Travel Organizer Boxes", parentCategory: "Jewellery Boxes", description: "Compact portable zip and latch organizers", status: "Active" },
  { name: "Luxury Vanity Cases", parentCategory: "Jewellery Boxes", description: "Multi-tier high capacity dresser boxes", status: "Active" }
];

// ─── 3. Canonical Collections ─────────────────────────────────────────────────
const canonicalCollections = [
  { name: "The Signature Collection", description: "Zenzies flagship handcrafted jewellery pieces", status: "Active" },
  { name: "Wedding & Celebrations", description: "Bridal sets, eternity bands and festive statement jewelry", status: "Active" },
  { name: "Everyday Anti-Tarnish", description: "Waterproof, hypoallergenic daily wear jewellery", status: "Active" },
  { name: "Curated Gift Sets", description: "Matching jewelry pairs packaged in velvet organizer boxes", status: "Active" }
];

// ─── 4. Canonical Gallery Photos ──────────────────────────────────────────────
const canonicalGallery = [
  { url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=500&auto=format&fit=crop", order: 10, caption: "Solitaire Elegance" },
  { url: "/img/zenzies/hero_model.png", order: 20, caption: "Editorial Showcase" },
  { url: "/img/zenzies/jewellery_box_lifestyle.jpg", order: 30, caption: "Signature Organizer Box" },
  { url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500&auto=format&fit=crop", order: 40, caption: "Gold Layers" },
  { url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=500&auto=format&fit=crop", order: 50, caption: "Artisan Earring Drops" },
  { url: "/img/zenzies/featured_organizer_box.png", order: 60, caption: "Travel Jewellery Case" }
];

// ─── 5. Canonical Customer Reviews ────────────────────────────────────────────
const canonicalReviews = [
  {
    customerName: "Priya S.",
    place: "Mumbai",
    title: "Verified Buyer",
    rating: 5,
    quote: "Absolutely stunning quality! The ring is even more beautiful in person. The velvet jewellery box it arrived in was a luxurious surprise.",
    date: "14 Oct 2026",
    visible: true
  },
  {
    customerName: "Megha K.",
    place: "New Delhi",
    title: "Verified Buyer",
    rating: 5,
    quote: "Elegant designs and excellent customer service. Anti-tarnish quality holds up perfectly after weeks of everyday wear. Highly recommended!",
    date: "02 Oct 2026",
    visible: true
  },
  {
    customerName: "Rohan M.",
    place: "Bengaluru",
    title: "Verified Buyer",
    rating: 5,
    quote: "The perfect gift for my anniversary. The packaging and presentation made it feel like a high luxury heirloom. She loved it!",
    date: "28 Sep 2026",
    visible: true
  }
];

// ─── 6. Canonical Products (Bestsellers & Featured) ───────────────────────────
const canonicalProducts = [
  {
    id: "prod_ring_solitaire",
    name: "Classic Solitaire Ring",
    title: "Classic Solitaire Ring",
    price: 8999,
    originalPrice: 12999,
    category: "Rings",
    rating: 5,
    reviewsCount: 128,
    image: "/img/zenzies/products/bestseller_ring.png",
    images: ["/img/zenzies/products/bestseller_ring.png"],
    stock: 25,
    inStock: true,
    isBestseller: true,
    featured: true,
    tags: ["bestseller", "rings", "solitaire", "featured"],
    description: "Gleaming solitaire stone set on an anti-tarnish hypoallergenic band, precision crafted for everyday sparkle.",
    status: "Active"
  },
  {
    id: "prod_necklace_heart",
    name: "Heart Pendant Necklace",
    title: "Heart Pendant Necklace",
    price: 7499,
    originalPrice: 9999,
    category: "Necklaces",
    rating: 5,
    reviewsCount: 96,
    image: "/img/zenzies/products/bestseller_necklace.png",
    images: ["/img/zenzies/products/bestseller_necklace.png"],
    stock: 18,
    inStock: true,
    isBestseller: true,
    featured: true,
    tags: ["bestseller", "necklaces", "heart", "featured"],
    description: "Delicate 18k gold plated chain featuring a polished love heart motif. Water resistant and skin friendly.",
    status: "Active"
  },
  {
    id: "prod_earrings_hoop",
    name: "Diamond Hoop Earrings",
    title: "Diamond Hoop Earrings",
    price: 6999,
    originalPrice: 8999,
    category: "Earrings",
    rating: 5,
    reviewsCount: 210,
    image: "/img/zenzies/products/bestseller_earrings.png",
    images: ["/img/zenzies/products/bestseller_earrings.png"],
    stock: 30,
    inStock: true,
    isBestseller: true,
    featured: true,
    tags: ["bestseller", "earrings", "hoops", "featured"],
    description: "Channel set sparkling round diamonds along a sleek hoop silhouette. Secure latch clasp for comfortable wear.",
    status: "Active"
  },
  {
    id: "prod_bracelet_tennis",
    name: "Tennis Bracelet",
    title: "Tennis Bracelet",
    price: 9499,
    originalPrice: 12999,
    category: "Bracelets",
    rating: 5,
    reviewsCount: 178,
    image: "/img/zenzies/products/bestseller_bracelet.png",
    images: ["/img/zenzies/products/bestseller_bracelet.png"],
    stock: 14,
    inStock: true,
    isBestseller: true,
    featured: true,
    tags: ["bestseller", "bracelets", "tennis", "featured"],
    description: "An unbroken line of brilliant stones set in high luster silver alloy with double security safety clasp.",
    status: "Active"
  },
  {
    id: "prod_box_velvet_organizer",
    name: "Signature Velvet Jewellery Box",
    title: "Signature Velvet Jewellery Box",
    price: 2999,
    originalPrice: 3999,
    category: "Jewellery Boxes",
    rating: 5,
    reviewsCount: 84,
    image: "/img/zenzies/featured_organizer_box.png",
    images: ["/img/zenzies/featured_organizer_box.png"],
    stock: 40,
    inStock: true,
    isBestseller: true,
    featured: true,
    tags: ["bestseller", "jewellery-boxes", "organizer", "featured"],
    description: "Multi-compartment velvet interior organizer with ring rolls, necklace hooks, and earring grid.",
    status: "Active"
  }
];

// ─── 7. Canonical Homepage Sections Master List (Ordering & Visibility) ──────
const canonicalHomepageSections = [
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
];

async function runMigration() {
  console.log("=================================================");
  console.log("🚀 STARTING ZENZIES MASTER FIREBASE MIGRATION");
  console.log("=================================================");

  // 1. Categories
  console.log("\n[1/7] Migrating Categories...");
  const catExisting = await getDocs(collection(db, "categories"));
  const existingCatNames = new Set(catExisting.docs.map(d => (d.data().name || "").toLowerCase().trim()));

  for (const cat of canonicalCategories) {
    if (!existingCatNames.has(cat.name.toLowerCase().trim())) {
      const docRef = doc(collection(db, "categories"));
      await setDoc(docRef, {
        ...cat,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`  ✓ Created category: ${cat.name} (${docRef.id})`);
    } else {
      console.log(`  ↳ Skipped existing category: ${cat.name}`);
    }
  }

  // 2. Subcategories
  console.log("\n[2/7] Migrating Subcategories...");
  const subExisting = await getDocs(collection(db, "subcategories"));
  const existingSubNames = new Set(subExisting.docs.map(d => (d.data().name || "").toLowerCase().trim()));

  for (const sub of canonicalSubcategories) {
    if (!existingSubNames.has(sub.name.toLowerCase().trim())) {
      const docRef = doc(collection(db, "subcategories"));
      await setDoc(docRef, {
        ...sub,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`  ✓ Created subcategory: ${sub.name}`);
    } else {
      console.log(`  ↳ Skipped existing subcategory: ${sub.name}`);
    }
  }

  // 3. Collections
  console.log("\n[3/7] Migrating Collections...");
  const colExisting = await getDocs(collection(db, "collections"));
  const existingColNames = new Set(colExisting.docs.map(d => (d.data().name || "").toLowerCase().trim()));

  for (const col of canonicalCollections) {
    if (!existingColNames.has(col.name.toLowerCase().trim())) {
      const docRef = doc(collection(db, "collections"));
      await setDoc(docRef, {
        ...col,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`  ✓ Created collection: ${col.name}`);
    } else {
      console.log(`  ↳ Skipped existing collection: ${col.name}`);
    }
  }

  // 4. Social Gallery Photos
  console.log("\n[4/7] Migrating Social Gallery Photos...");
  const galExisting = await getDocs(collection(db, "gallery"));
  const existingGalUrls = new Set(galExisting.docs.map(d => d.data().url));

  for (const item of canonicalGallery) {
    if (!existingGalUrls.has(item.url)) {
      const docRef = doc(collection(db, "gallery"));
      await setDoc(docRef, {
        ...item,
        createdAt: serverTimestamp()
      });
      console.log(`  ✓ Created gallery photo: ${item.caption}`);
    } else {
      console.log(`  ↳ Skipped existing gallery photo: ${item.caption}`);
    }
  }

  // 5. Customer Reviews
  console.log("\n[5/7] Migrating Customer Reviews...");
  const revExisting = await getDocs(collection(db, "reviews"));
  const existingRevNames = new Set(revExisting.docs.map(d => (d.data().customerName || d.data().name || "").toLowerCase().trim()));

  for (const rev of canonicalReviews) {
    if (!existingRevNames.has(rev.customerName.toLowerCase().trim())) {
      const docRef = doc(collection(db, "reviews"));
      await setDoc(docRef, {
        ...rev,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`  ✓ Created review for: ${rev.customerName}`);
    } else {
      console.log(`  ↳ Skipped existing review for: ${rev.customerName}`);
    }
  }

  // 6. Products (Bestsellers & Featured)
  console.log("\n[6/7] Migrating Canonical Products...");
  for (const p of canonicalProducts) {
    const pRef = doc(db, "products", p.id);
    await setDoc(pRef, {
      ...p,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });
    console.log(`  ✓ Upserted canonical product: ${p.name} (${p.id})`);
  }

  // 7. Homepage Sections Layout & Ordering
  console.log("\n[7/7] Migrating Homepage Sections Layout...");
  await setDoc(doc(db, "site_settings", "homepage_sections"), {
    sections: canonicalHomepageSections,
    updatedAt: serverTimestamp()
  }, { merge: true });
  console.log("  ✓ Created site_settings/homepage_sections master order document");

  console.log("\n=================================================");
  console.log("🎉 ALL MIGRATION TASKS COMPLETED SUCCESSFULLY!");
  console.log("=================================================");
  process.exit(0);
}

runMigration().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
