import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, Mail, ArrowUpRight } from 'lucide-react';
import useSectionDesign from '../hooks/useSectionDesign';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const { design, containerStyle, overlayStyle, isEnabled } = useSectionDesign('footer', {
    backgroundColor: '#FBF7F2',
    paddingTop: '48px',
    paddingBottom: '32px',
  });

  const shopLinks = [
    { name: "All Products", href: "/shop" },
    { name: "Jewellery Boxes", href: "/shop?category=Jewellery+Boxes" },
    { name: "Rings", href: "/shop?category=Rings" },
    { name: "Necklaces", href: "/shop?category=Necklace" },
    { name: "Earrings", href: "/shop?category=Earrings" },
    { name: "Bracelets", href: "/shop?category=Bracelet" },
    { name: "Bundles & Gifts", href: "/shop?category=Bundles" },
  ];

  const aboutLinks = [
    { name: "Our Story", href: "/about" },
    { name: "Craftsmanship", href: "/about" },
    { name: "Sustainability", href: "/about" },
    { name: "Journal & Blog", href: "/blog" },
    { name: "Contact Concierge", href: "/contact" },
  ];

  const customerLinks = [
    { name: "Track Order", href: "/orders" },
    { name: "Shopping Bag", href: "/cart" },
    { name: "My Wishlist", href: "/wishlist" },
    { name: "Return & Refund Policy", href: "/return-policy" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-and-conditions" },
  ];

  if (!isEnabled) return null;

  return (
    <footer style={containerStyle} className="w-full text-[#211A16] font-sans border-t border-[#E8DDD2] relative">
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#E8DDD2]">

          {/* Column 1: Brand & Social (Span 4) */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img
                src="/img/logo.png"
                alt="Zenzies"
                className="h-10 sm:h-11 w-10 sm:w-11 rounded-full object-cover shadow-xs border border-[#956638]/20 group-hover:border-[#956638] transition-all"
              />
              <div className="flex flex-col leading-none">
                <span className="font-serif text-2xl tracking-[0.14em] font-medium text-[#211A16] group-hover:text-[#956638] transition-colors">
                  ZENZIES
                </span>
                <span className="text-[9px] tracking-[0.3em] font-medium text-[#6B5E52] uppercase mt-0.5">
                  THE JEWELLERY
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#6B5E52] font-sans leading-relaxed max-w-sm">
              Timeless jewellery for a more beautiful you. Practical organizer boxes and everyday jewellery crafted to protect every treasured sparkle.
            </p>

            {/* Contact Details */}
            <div className="pt-2 space-y-1.5 text-xs sm:text-sm text-[#211A16]">
              <a
                href="tel:+919977712653"
                className="flex items-center gap-2 text-[#6B5E52] hover:text-[#956638] transition-colors"
              >
                <Phone size={14} className="text-[#956638]" />
                <span>+91 9977712653</span>
              </a>
              <a
                href="mailto:support@zenzies.in"
                className="flex items-center gap-2 text-[#6B5E52] hover:text-[#956638] transition-colors"
              >
                <Mail size={14} className="text-[#956638]" />
                <span>support@zenzies.in</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-2.5">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white border border-[#E8DDD2] flex items-center justify-center text-[#211A16] hover:text-white hover:bg-[#956638] hover:border-[#956638] transition-all shadow-xs"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Shop Links (Span 3) */}
          <div className="lg:col-span-3 space-y-3.5 text-left">
            <h4 className="text-xs sm:text-[13px] font-sans font-bold uppercase tracking-[0.18em] text-[#211A16]">
              Shop
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-[#6B5E52] hover:text-[#956638] transition-colors block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: About Links (Span 2) */}
          <div className="lg:col-span-2 space-y-3.5 text-left">
            <h4 className="text-xs sm:text-[13px] font-sans font-bold uppercase tracking-[0.18em] text-[#211A16]">
              About
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-[#6B5E52] hover:text-[#956638] transition-colors block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Customer Care (Span 3) */}
          <div className="lg:col-span-3 space-y-3.5 text-left">
            <h4 className="text-xs sm:text-[13px] font-sans font-bold uppercase tracking-[0.18em] text-[#211A16]">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {customerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-[#6B5E52] hover:text-[#956638] transition-colors block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Notes */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B5E52] text-center sm:text-left">
          <p>© {currentYear} Zenzies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Made with</span>
            <span className="text-[#956638]">♡</span>
            <span>for a more beautiful world.</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
