import { motion, useReducedMotion } from 'framer-motion';
import { springs, staggerContainer } from '@/lib/animation';
import type { Service } from '@/config/services';

const icons: Record<string, string> = {
  nettside:
    'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418',
  nettbutikk:
    'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.962-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z',
  landingsside:
    'M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z',
};

interface ServiceCardProps {
  service: Service;
  featured?: boolean;
  shouldReduceMotion: boolean;
}

function ServiceCard({ service, featured = false, shouldReduceMotion }: ServiceCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.a
      href={`/tjenester/${service.slug}`}
      variants={cardVariants}
      transition={springs.gentle}
      aria-label={`Les mer om ${service.name}`}
      className={[
        'group flex flex-col rounded-md border bg-surface-raised p-8',
        'transition-all duration-normal',
        featured
          ? 'border-brand/50 ring-1 ring-brand/30 card-featured-glow hover:border-brand hover:ring-brand/50 hover:shadow-2xl hover:shadow-brand/15'
          : 'border-white/10 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5',
        'hover:-translate-y-1.5',
      ].join(' ')}
    >
      {/* Icon with micro-lift on card hover */}
      <div className="mb-4 transition-transform duration-normal group-hover:-translate-y-0.5 group-hover:scale-110">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-8 w-8 text-brand transition-colors duration-normal group-hover:text-brand-light"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={icons[service.slug]} />
        </svg>
      </div>

      <h3 className="mb-1 text-lg font-semibold">{service.name}</h3>
      <p className="mb-3 text-sm text-brand">{service.tagline}</p>
      <p className="mb-4 flex-1 text-sm text-text-muted">{service.description}</p>
      <div className="mb-4">
        <span className="mb-1 inline-block rounded bg-brand/20 px-1.5 py-0.5 text-xs font-medium text-brand">
          Spar 40 %
        </span>
        <p className="mt-1.5 text-xs text-text-muted line-through">{service.priceRange}</p>
        <p className="text-sm font-semibold text-text">{service.launchPriceRange}</p>
        {service.monthlyPriceLabel && (
          <p className="mt-1 text-xs text-text-muted">+ {service.monthlyPriceLabel} hosting og support</p>
        )}
      </div>

      {/* Animated underline "Les mer" */}
      <span
        aria-hidden="true"
        className="link-underline mt-auto text-sm font-semibold text-text-muted transition-colors duration-normal group-hover:text-text"
      >
        Les mer
      </span>
    </motion.a>
  );
}

interface Props {
  services: Service[];
  featured: string[];
}

export default function TjenesterOversiktIsland({ services, featured }: Props) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const container = shouldReduceMotion ? { hidden: {}, visible: {} } : staggerContainer;

  return (
    <motion.div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {services.map((service) => (
        <ServiceCard
          key={service.slug}
          service={service}
          featured={featured.includes(service.slug)}
          shouldReduceMotion={shouldReduceMotion}
        />
      ))}
    </motion.div>
  );
}
