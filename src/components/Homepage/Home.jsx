import useSEO from '../../hooks/useSEO';
import Hero from './Hero';
import CategorySection from './CategorySection';
import FeaturedBoxBanner from './FeaturedBoxBanner';
import BestSellers from './Bestsellers';
import QualitySection from './WhyChoose';
import TheEdit from './TheEdit';
import BrandStory from './BrandStory';
import TestimonialSection from './Testemonials';
import SocialGallery from './SocialGallery';
import Newsletter from '../Newsletter';

function Home() {
  useSEO({
    title: 'Jewellery & Luxury Organizer Boxes | Zenzies',
    description: 'Discover Zenzies - premium jewellery organizer boxes, fine jewellery, and curated combo bundles crafted for the modern lifestyle. Shop online with secure payments across India.',
    keywords: 'zenzies, jewellery boxes, organizer boxes, jewellery online, combo bundles, gift sets, earrings, rings, necklaces, bracelets, india',
    canonical: '/',
    ogType: 'website',
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://www.zenzies.in/#business",
        "name": "Zenzies",
        "image": "https://www.zenzies.in/img/logo.png",
        "description": "Zenzies offers premium jewellery organizer boxes, fine jewellery, and curated combo bundles for the modern lifestyle.",
        "url": "https://www.zenzies.in",
        "telephone": "+91-9977712653",
        "email": "support@zenzies.in",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "783 Khatiwala Tank",
          "addressLocality": "Indore",
          "addressRegion": "Madhya Pradesh",
          "postalCode": "452014",
          "addressCountry": "IN"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "10:00",
          "closes": "19:00"
        },
        "priceRange": "₹₹",
        "currenciesAccepted": "INR",
        "paymentAccepted": "Credit Card, Debit Card, UPI, Net Banking",
        "sameAs": [
          "https://www.instagram.com/zenzies"
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What products does Zenzies offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Zenzies specializes in three core categories: premium jewellery organizer boxes sold individually, elegant anti-tarnish jewellery, and thoughtfully curated combination bundles featuring jewellery in luxury organizer boxes."
            }
          },
          {
            "@type": "Question",
            "name": "What makes Zenzies jewellery boxes special?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our jewellery boxes are crafted with premium materials, plush velvet linings, and intelligent compartments to protect your jewellery from dust, tarnishing, and scratches, whether at home or on the go."
            }
          },
          {
            "@type": "Question",
            "name": "What payment methods are accepted at Zenzies?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Zenzies operates with 100% secure online payments powered by Razorpay. We accept UPI (Google Pay, PhonePe, Paytm), Credit Cards, Debit Cards, and Net Banking across all major Indian banks. We do not offer Cash on Delivery (COD)."
            }
          },
          {
            "@type": "Question",
            "name": "What is the return and exchange policy for online orders?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We offer a hassle-free 7-day return and exchange policy for unused items in their original condition and packaging. A continuous, unedited unboxing video recorded from the sealed parcel opening is mandatory for transit damage or defect claims."
            }
          }
        ]
      }
    ]
  });

  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedBoxBanner />
      <BestSellers />
      <QualitySection />
      <TheEdit />
      <BrandStory />
      <TestimonialSection />
      <SocialGallery />
      <Newsletter />
    </>
  );
}

export default Home;
