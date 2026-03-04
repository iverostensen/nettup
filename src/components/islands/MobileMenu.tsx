import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  currentPath: string;
}

export default function MobileMenu({
  isOpen,
  onClose,
  navItems,
  currentPath,
}: MobileMenuProps) {
  const shouldReduceMotion = useReducedMotion();

  function isItemActive(item: NavItem): boolean {
    if (item.href === '/tjenester') return currentPath.startsWith('/tjenester');
    return currentPath === item.href;
  }
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus close button when menu opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || !menuRef.current) return;

      const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.2,
        when: 'beforeChildren',
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.3 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          id="mobile-menu"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex flex-col bg-surface"
          role="dialog"
          aria-modal="true"
          aria-label="Navigasjonsmeny"
        >
          {/* Header with logo and close button */}
          <div className="flex items-center justify-between px-6 py-4">
            <a href="/" onClick={onClose}>
              <img
                src="/images/nettup-logo.svg"
                alt="Nettup"
                width={58}
                height={24}
                className="h-6 w-auto"
              />
            </a>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-white/10 hover:text-text"
              aria-label="Lukk meny"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-1 flex-col items-center justify-center gap-6">
            {navItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                variants={itemVariants}
                onClick={onClose}
                aria-current={isItemActive(item) ? 'page' : undefined}
                className={cn(
                  'text-3xl font-semibold transition-colors duration-200',
                  isItemActive(item)
                    ? 'text-brand'
                    : 'text-text hover:text-brand'
                )}
              >
                {item.name}
              </motion.a>
            ))}

            {/* CTA Button */}
            <motion.a
              href="/kontakt"
              variants={itemVariants}
              onClick={onClose}
              className="mt-4 rounded-full bg-brand px-8 py-3 text-lg font-semibold text-surface transition-colors duration-200 hover:bg-brand-light"
            >
              Ta kontakt
            </motion.a>
          </nav>

          {/* Bottom spacing */}
          <div className="h-20" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
