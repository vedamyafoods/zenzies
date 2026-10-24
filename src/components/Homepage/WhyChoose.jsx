import React from 'react';
import { getIconComponent } from '../../utils/iconRegistry';
import useSectionDesign from '../../hooks/useSectionDesign';

const DEFAULT_BENEFITS = [
  {
    id: 'tb1',
    icon: 'gem',
    title: 'Ethically Sourced',
    desc: 'Conflict-free diamonds',
    enabled: true,
  },
  {
    id: 'tb2',
    icon: 'shield-check',
    title: 'Certified Quality',
    desc: 'Authenticity guaranteed',
    enabled: true,
  },
  {
    id: 'tb3',
    icon: 'leaf',
    title: 'Sustainable Practices',
    desc: 'A brighter tomorrow',
    enabled: true,
  },
  {
    id: 'tb4',
    icon: 'users',
    title: 'Trusted by 50K+',
    desc: 'Happy customers',
    enabled: true,
  },
];

const QualitySection = () => {
  const { design, containerStyle, overlayStyle, isEnabled } = useSectionDesign('trust_benefits', {
    backgroundColor: '#FAF7F2',
    paddingTop: '20px',
    paddingBottom: '20px',
    titleColor: '#211A16',
    textColor: '#62564B',
    iconColor: '#65472D',
    showDividers: true,
    items: DEFAULT_BENEFITS,
  });

  if (!isEnabled) return null;

  const rawItems = Array.isArray(design.items) && design.items.length > 0 ? design.items : DEFAULT_BENEFITS;
  const items = rawItems.filter(item => item && item.enabled !== false);

  if (items.length === 0) return null;

  const iconColor = design.iconColor || '#65472D';
  const titleColor = design.titleColor || '#211A16';
  const descColor = design.textColor || '#62564B';
  const showDividers = design.showDividers !== false;

  return (
    <section
      style={{
        backgroundColor: design.backgroundColor || '#FAF7F2',
        paddingTop: design.paddingTop || '20px',
        paddingBottom: design.paddingBottom || '20px',
        ...containerStyle,
      }}
      className="relative w-full border-y border-[#E8DDD2]/70 overflow-hidden"
    >
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}

      <div className="w-full max-w-[1640px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        <div
          className={`grid gap-y-4 gap-x-4 sm:gap-x-6 items-center ${
            items.length === 4
              ? 'grid-cols-2 lg:grid-cols-4'
              : items.length === 3
              ? 'grid-cols-1 sm:grid-cols-3'
              : items.length === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {items.map((item, idx) => {
            const IconComp = getIconComponent(item.icon);
            const isLastOnDesktop = idx === items.length - 1;

            return (
              <div
                key={item.id || idx}
                className={`flex items-center gap-3 sm:gap-3.5 text-left py-1.5 px-2 sm:px-3 transition-colors ${
                  showDividers && !isLastOnDesktop ? 'lg:border-r lg:border-[#62564B]/15' : ''
                }`}
              >
                {/* Outline Icon */}
                <div className="shrink-0 flex items-center justify-center">
                  <IconComp
                    size={28}
                    strokeWidth={1.5}
                    style={{ color: iconColor }}
                    className="transition-transform duration-300 hover:scale-110"
                  />
                </div>

                {/* Title & Supporting Description */}
                <div className="min-w-0 pr-1">
                  <h4
                    className="text-xs sm:text-[13px] font-sans font-semibold leading-tight truncate tracking-tight"
                    style={{ color: titleColor, fontSize: design.titleFontSize || undefined }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="text-[11px] sm:text-[12px] font-sans leading-snug truncate mt-0.5"
                    style={{ color: descColor, fontSize: design.descFontSize || undefined }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QualitySection;
