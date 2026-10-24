import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { db } from './Firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import useSectionDesign from '../hooks/useSectionDesign';

const GIFT_IMG = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=900";

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const { design, containerStyle, overlayStyle, btnGradient, isEnabled } = useSectionDesign('newsletter', {
    backgroundColor: '#E9D9C7',
    paddingTop: '40px',
    paddingBottom: '56px',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "newsletter_subscribers"), {
        email: email.trim().toLowerCase(),
        subscribedAt: serverTimestamp(),
      });
    } catch (err) {
      // Graceful fallback
    } finally {
      setLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }
  };

  if (!isEnabled) return null;

  const title = design.title || 'Get Exclusive Offers';
  const subtitle = design.subtitle || 'Subscribe and be the first to know about new collections, special offers and smart jewellery storage tips.';
  const btnText = design.btnText || 'Subscribe';
  const giftImage = design.image || GIFT_IMG;
  const scriptLine1 = design.scriptLine1 || 'A Brighter Tomorrow';
  const scriptLine2 = design.scriptLine2 || 'Starts Here ♡';

  return (
    <section style={containerStyle} className="relative w-full border-b border-[#DFCBB9] overflow-hidden">
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}
      <div className="w-full max-w-[1640px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column: Copy & Input Form */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <h2
              className="font-serif text-3xl sm:text-4xl font-normal leading-tight"
              style={{ color: design.titleColor || '#211A16', fontSize: design.titleFontSize || undefined }}
            >
              {title}
            </h2>
            <p
              className="text-xs sm:text-sm font-sans leading-relaxed max-w-lg"
              style={{ color: design.subtitleColor || '#6B5E52', fontSize: design.subtitleFontSize || undefined }}
            >
              {subtitle}
            </p>

            <AnimatePresence mode="wait">
              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#DFCBB9] text-[#211A16] text-xs sm:text-sm font-medium w-fit"
                >
                  <CheckCircle2 size={18} className="text-[#956638]" />
                  <span>Thank you for subscribing! Check your inbox soon for your special gift code.</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-md pt-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 sm:py-3.5 bg-white border border-[#DFCBB9] rounded-[6px] text-xs sm:text-sm font-sans text-[#211A16] placeholder:text-[#6B5E52]/70 outline-none focus:border-[#956638] focus:ring-1 focus:ring-[#956638] transition-all shadow-xs"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-[6px] text-white text-xs sm:text-sm font-sans font-semibold tracking-wide transition-all shadow-md hover:brightness-105 hover:shadow-lg shrink-0 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 active:scale-95"
                    style={{ background: design.btnGradient || btnGradient, color: design.btnTextColor || '#FFFFFF' }}
                  >
                    {loading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        <span>{btnText}</span>
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Gift Box with Script Accent */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#DFCBB9] bg-white aspect-[4/2.6] sm:aspect-[4/2.4] w-full max-w-md">
              <img
                src={giftImage}
                alt="Zenzies Special Gift"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211A16]/20 via-transparent to-transparent pointer-events-none" />

              {/* Script Overlay */}
              <div className="absolute bottom-4 right-4 z-10 text-right drop-shadow-md pointer-events-none">
                <p className="text-xl sm:text-2xl text-white font-script leading-tight" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                  {scriptLine1}
                </p>
                <p className="text-lg sm:text-xl text-white/95 font-script -mt-1" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
                  {scriptLine2}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Newsletter;
