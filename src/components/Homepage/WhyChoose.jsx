import React from 'react';
import {
  Gem,
  ShieldCheck,
  Sparkles,
  Users,
  Package,
  Headphones,
  Leaf,
  Gift,
  CheckCircle2,
  Lock,
  Truck
} from 'lucide-react';
import useSectionDesign from '../../hooks/useSectionDesign';

// Map icon names to Lucide icon components
const ICON_MAP = {
  gem: Gem,
  diamond: Gem,
  'shield-check': ShieldCheck,
  shield: ShieldCheck,
  sparkles: Sparkles,
  leaf: Leaf,
  package: Package,
  users: Users,
  gift: Gift,
  headset: Headphones,
  headphones: Headphones,
  lock: Lock,
  truck: Truck,
};

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
    backgroundColor: '#F3E4DA',
    paddingTop: '22px',
    paddingBottom: '22px',
    titleColor: '#211A16',
    textColor: '#62564B',
    iconColor: '#65472D',
    items: DEFAULT_BENEFITS,
  });

  if (!isEnabled) return null;

  const rawItems = Array.isArray(design.items) && design.items.length > 0 ? design.items : DEFAULT_BENEFITS;
  const items = rawItems.filter(item => item && item.enabled !== false);

  const iconColor = design.iconColor || '#65472D';
  const titleColor = design.titleColor || '#211A16';
  const descColor = design.textColor || '#62564B';

  return (
    <section
      style={{
        backgroundColor: design.backgroundColor || '#F3E4DA',
        paddingTop: design.paddingTop || '22px',
        paddingBottom: design.paddingBottom || '22px',
        ...containerStyle,
      }}
      className="relative w-full border-t border-[#E8DDD2]/60 overflow-hidden"
    >
      {overlayStyle && (
        <div className="absolute inset-0 pointer-events-none z-0" style={overlayStyle} />
      )}

      <div className="max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-4 sm:gap-x-6">
          {items.map((item, idx) => {
            const IconComp = ICON_MAP[String(item.icon).toLowerCase()] || Gem;
            const isLastOnDesktop = idx === items.length - 1;

            return (
              <div
                key={item.id || idx}
                className={`flex items-center gap-3 sm:gap-3.5 text-left py-1 px-1 sm:px-2 ${
                  !isLastOnDesktop ? 'lg:border-r lg:border-[#62564B]/15' : ''
                }`}
              >
                {/* Outline Icon */}
                <div className="shrink-0 flex items-center justify-center text-[#65472D]">
                  <IconComp
                    size={26}
                    strokeWidth={1.6}
                    style={{ color: iconColor }}
                  />
                </div>

                {/* Title & Description */}
                <div className="min-w-0 pr-1">
                  <h4
                    className="text-xs sm:text-[12.5px] font-sans font-semibold leading-tight truncate"
                    style={{ color: titleColor }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="text-[11px] sm:text-[11.5px] font-sans leading-snug truncate mt-0.5"
                    style={{ color: descColor }}
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
