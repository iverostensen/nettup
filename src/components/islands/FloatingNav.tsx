import { useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { duration } from '@/lib/animation';
import MobileMenu from './MobileMenu';
import { services } from '@/config/services';

const navItems = [
  { name: 'Hjem', href: '/' },
  { name: 'Tjenester', href: '/tjenester' },
  { name: 'Om oss', href: '/om-oss' },
  { name: 'Prosjekter', href: '/prosjekter' },
];

// Only animate the nav entrance on the very first page load.
// On subsequent navigations the component remounts but should appear instantly.
let hasHydrated = false;

export default function FloatingNav() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Lazy initializer: reads window.location on the client, falls back to '/' during SSR.
  // Component remounts on every navigation (no transition:persist) so this is always fresh.
  const [currentPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const shouldAnimate = !hasHydrated;

  useEffect(() => {
    hasHydrated = true;
  }, []);

  const tjenesterActive = currentPath.startsWith('/tjenester');
  const currentServiceSlug = currentPath.split('/')[2];
  const currentService = services.find(s => s.slug === currentServiceSlug);
  const tjenesterLabel =
    tjenesterActive && currentPath !== '/tjenester' && currentService
      ? currentService.name
      : 'Tjenester';

  const displayNavItems = navItems.map(item =>
    item.href === '/tjenester' ? { ...item, name: tjenesterLabel } : item
  );

  function isNavItemActive(itemHref: string): boolean {
    if (itemHref === '/tjenester') return tjenesterActive;
    return currentPath === itemHref;
  }

  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    if (typeof current === 'number') {
      const direction = current - (scrollYProgress.getPrevious() ?? 0);
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else if (direction < 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
          initial={shouldAnimate && !shouldReduceMotion ? { y: -100, opacity: 0 } : false}
          animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : duration.fast,
            ease: 'easeOut',
          }}
          className={cn(
            'fixed inset-x-0 z-50 mx-auto flex max-w-fit items-center gap-1 rounded-full',
            'border border-white/10 bg-surface-raised/80 px-2 py-2 pl-3 shadow-lg shadow-black/20 backdrop-blur-md',
            'md:gap-2',
            'top-6'
          )}
          aria-label="Hovednavigasjon"
        >
          {/* Logo */}
          <a
            href="/"
            className="mr-2 flex min-h-11 shrink-0 items-center transition-opacity hover:opacity-80"
          >
            <img
              src="/images/nettup-logo.svg"
              alt="Nettup"
              width={58}
              height={24}
              className="h-6 w-auto"
            />
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-1 md:flex">
            {displayNavItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={isNavItemActive(item.href) ? 'page' : undefined}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200',
                  isNavItemActive(item.href)
                    ? 'text-brand'
                    : 'text-text-muted hover:text-text'
                )}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <a
            href="/kontakt"
            className={cn(
              'hidden rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-surface transition-colors duration-200 hover:bg-brand-light',
              'md:block'
            )}
          >
            Ta kontakt
          </a>

          {/* Hamburger Button - Mobile */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/10 hover:text-text md:hidden"
            aria-label="Åpne meny"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => {
          setMobileMenuOpen(false);
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }}
        navItems={displayNavItems}
        currentPath={currentPath}
      />
    </>
  );
}
