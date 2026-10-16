import { useState, useEffect } from 'react';
import { db } from '../components/Firebase';
import { doc, onSnapshot } from 'firebase/firestore';

/**
 * useSectionDesign
 * Dynamic styling hook that binds homepage sections to Firestore `site_settings/section_designs`.
 * Gracefully merges admin-configured styles with component default tokens.
 *
 * @param {string} sectionId - Identifier for the section (e.g. 'hero', 'jewellery_box_banner')
 * @param {object} defaultTokens - Fallback design tokens (colors, padding, etc.)
 */
export const useSectionDesign = (sectionId, defaultTokens = {}) => {
  const getCachedDesign = () => {
    try {
      const cached = localStorage.getItem('zenzies_section_designs');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed[sectionId]) {
          return { ...defaultTokens, ...parsed[sectionId] };
        }
      }
    } catch (e) {
      // ignore
    }
    return defaultTokens;
  };

  const [design, setDesign] = useState(getCachedDesign);

  useEffect(() => {
    // Listen to local window updates (for same tab instant preview)
    const handleLocalUpdate = () => {
      setDesign(getCachedDesign());
    };
    window.addEventListener('zenzies_section_designs_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);

    const unsub = onSnapshot(doc(db, "site_settings", "section_designs"), (snap) => {
      if (snap.exists()) {
        const allDesigns = snap.data();
        try {
          localStorage.setItem('zenzies_section_designs', JSON.stringify(allDesigns));
        } catch (e) {}

        if (allDesigns[sectionId]) {
          setDesign({
            ...defaultTokens,
            ...allDesigns[sectionId]
          });
          return;
        }
      }
      setDesign(getCachedDesign());
    }, (err) => {
      console.warn(`useSectionDesign error for ${sectionId}:`, err);
      setDesign(getCachedDesign());
    });

    return () => {
      window.removeEventListener('zenzies_section_designs_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
      unsub();
    };
  }, [sectionId]);

  // Compute container CSS inline style object
  const containerStyle = {
    backgroundColor: design.backgroundColor || defaultTokens.backgroundColor || undefined,
    backgroundImage: design.backgroundImage ? `url(${design.backgroundImage})` : (defaultTokens.backgroundImage ? `url(${defaultTokens.backgroundImage})` : undefined),
    backgroundSize: design.backgroundSize || defaultTokens.backgroundSize || 'cover',
    backgroundPosition: design.backgroundPosition || defaultTokens.backgroundPosition || 'center center',
    backgroundRepeat: design.backgroundRepeat || defaultTokens.backgroundRepeat || 'no-repeat',
    backgroundAttachment: design.backgroundAttachment || defaultTokens.backgroundAttachment || 'scroll',
    backgroundBlendMode: design.backgroundBlendMode || defaultTokens.backgroundBlendMode || 'normal',
    paddingTop: design.paddingTop || defaultTokens.paddingTop || undefined,
    paddingBottom: design.paddingBottom || defaultTokens.paddingBottom || undefined,
  };

  // Compute overlay layer style if opacity > 0
  const overlayOpacity = design.overlayOpacity !== undefined ? Number(design.overlayOpacity) : (defaultTokens.overlayOpacity || 0);
  const overlayColor = design.overlayColor || defaultTokens.overlayColor || '#000000';
  const overlayStyle = overlayOpacity > 0 ? {
    backgroundColor: overlayColor,
    opacity: overlayOpacity,
  } : null;

  return {
    design,
    containerStyle,
    overlayStyle,
    isEnabled: design.enabled !== false,
  };
};

export default useSectionDesign;
