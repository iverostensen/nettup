import { motion, useReducedMotion } from 'framer-motion';
import { springs } from '@/lib/animation';

const icons: Record<string, string> = {
  nettside:
    'M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418',
  nettbutikk:
    'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.962-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z',
  landingsside:
    'M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z',
  webapp:
    'M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z',
  seo: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z',
  ai: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z',
  vedlikehold:
    'M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z',
};

interface Service {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  priceRange: string;
}

interface ServiceCardProps {
  service: Service;
  index: number;
  featured?: boolean;
  shouldReduceMotion: boolean;
}

function ServiceCard({ service, index, featured = false, shouldReduceMotion }: ServiceCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.a
      href={`/tjenester/${service.slug}`}
      variants={cardVariants}
      transition={{ ...springs.gentle, delay: shouldReduceMotion ? 0 : index * 0.08 }}
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
      <p className="mb-4 text-sm font-semibold text-text">{service.priceRange}</p>

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
  group1: Service[];
  group2: Service[];
  featured: string[];
}

export default function TjenesterOversiktIsland({ group1, group2, featured }: Props) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  return (
    <>
      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {group1.map((service, i) => (
          <ServiceCard
            key={service.slug}
            service={service}
            index={i}
            featured={featured.includes(service.slug)}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </motion.div>

      <h2 className="mb-6 mt-16 font-display text-xl font-semibold text-text-muted">
        Løpende tjenester
      </h2>

      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {group2.map((service, i) => (
          <ServiceCard
            key={service.slug}
            service={service}
            index={i}
            featured={false}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}
      </motion.div>
    </>
  );
}
