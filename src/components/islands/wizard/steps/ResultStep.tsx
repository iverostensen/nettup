import { useState } from 'react';
import { motion } from 'framer-motion';
import { type LineItem } from '@/config/pricing-config';
import { calculateEstimate } from '@/lib/calculate-estimate';
import { fadeUp, staggerContainer, springs } from '@/lib/animation';
import type { WizardState } from '../wizard-types';

interface ResultStepProps {
  state: WizardState;
  onReset: () => void;
}

const CATEGORY_ORDER: LineItem['category'][] = ['size', 'feature', 'integration', 'design'];

const CATEGORY_LABELS: Record<LineItem['category'], string> = {
  size: 'Størrelse',
  feature: 'Funksjoner',
  integration: 'Integrasjoner',
  design: 'Design',
};

const SERVICE_LABELS: Record<string, string> = {
  nettside: 'Nettside',
  nettbutikk: 'Nettbutikk',
  landingsside: 'Landingsside',
};

function formatPrice(price: number): string {
  return price.toLocaleString('nb-NO');
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

export function ResultStep({ state, onReset }: ResultStepProps) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const estimate = calculateEstimate({
    serviceType: state.serviceType!,
    sizeId: state.sizeId!,
    featureIds: state.featureIds,
    integrationIds: state.integrationIds,
    designId: state.designId!,
  });

  const grouped = CATEGORY_ORDER
    .map((cat) => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      items: estimate.lineItems.filter((item) => item.category === cat),
    }))
    .filter((group) => group.items.length > 0);

  const contactParams = new URLSearchParams({
    tjeneste: estimate.serviceType,
    estimat: `${estimate.discounted.min}-${estimate.discounted.max}`,
  });
  const contactHref = `/kontakt?${contactParams.toString()}`;

  function buildClipboardText(): string {
    const lines: string[] = [
      'Prisestimat fra Nettup',
      `Tjeneste: ${SERVICE_LABELS[estimate.serviceType] ?? estimate.serviceType}`,
      '',
    ];

    for (const group of grouped) {
      lines.push(`${group.label}:`);
      for (const item of group.items) {
        lines.push(`- ${item.label}`);
      }
      lines.push('');
    }

    lines.push(`Totalt: ${formatPrice(estimate.discounted.min)} \u2013 ${formatPrice(estimate.discounted.max)} kr`);
    if (estimate.discountActive) {
      lines.push(`Lanseringstilbud: ${estimate.discountPercent}% rabatt`);
    }
    if (estimate.monthly > 0) {
      lines.push(`Drift og hosting: ${formatPrice(estimate.monthly)} kr/mnd`);
    }
    lines.push('');
    lines.push('Kontakt oss: https://nettup.no/kontakt');

    return lines.join('\n');
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildClipboardText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 2000);
    }
  }

  const finalPrice = estimate.discountActive ? estimate.discounted : estimate.oneTime;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-8 sm:grid-cols-[3fr_2fr]"
    >
      {/* Left column: price hero + actions */}
      <div className="flex flex-col gap-5">
        {/* Header */}
        <motion.div variants={fadeUp} transition={springs.gentle} className="flex items-center gap-3">
          <h2 className="text-lg font-medium text-text-muted">Ditt prisestimat</h2>
          {estimate.discountActive && (
            <span className="rounded-full bg-brand/10 px-3 py-0.5 text-xs font-medium text-brand">
              Lanseringstilbud
            </span>
          )}
        </motion.div>

        {/* Price hero */}
        <motion.div variants={fadeUp} transition={springs.gentle} className="flex flex-col gap-1">
          {estimate.discountActive && (
            <span className="text-sm text-text-muted line-through">
              {formatPrice(estimate.oneTime.min)} &ndash; {formatPrice(estimate.oneTime.max)} kr
            </span>
          )}
          <span className={`text-4xl font-bold leading-tight ${estimate.discountActive ? 'text-brand' : 'text-text'}`}>
            {formatPrice(finalPrice.min)} &ndash; {formatPrice(finalPrice.max)} kr
          </span>
          {estimate.discountActive && (
            <span className="text-sm text-emerald-400">
              Spar {formatPrice(estimate.oneTime.min - estimate.discounted.min)} &ndash; {formatPrice(estimate.oneTime.max - estimate.discounted.max)} kr
            </span>
          )}
        </motion.div>

        {/* Cost summary rows */}
        <motion.div variants={fadeUp} transition={springs.gentle} className="flex flex-col gap-2 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Engangspris</span>
            <span className="text-sm text-text">{formatPrice(finalPrice.min)} &ndash; {formatPrice(finalPrice.max)} kr</span>
          </div>
          {estimate.monthly > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Drift og hosting</span>
              <span className="text-sm text-text">{formatPrice(estimate.monthly)} kr/mnd</span>
            </div>
          )}
        </motion.div>

        {/* Disclaimer */}
        <motion.p variants={fadeUp} transition={springs.gentle} className="text-xs text-text-muted">
          Dette er et estimat &ndash; endelig pris avhenger av prosjektets omfang.
        </motion.p>

        {/* Action buttons */}
        <motion.div variants={fadeUp} transition={springs.gentle} className="flex flex-col gap-3 sm:flex-row">
          <a
            href={contactHref}
            className="w-full rounded-md bg-brand px-6 py-3 text-center font-semibold text-surface transition-colors hover:bg-brand-light sm:w-auto"
          >
            Kontakt oss for tilbud
          </a>
          <button
            type="button"
            onClick={onReset}
            className="w-full rounded-md border border-white/20 px-6 py-3 text-text transition-colors hover:border-white/40 sm:w-auto"
          >
            Beregn på nytt
          </button>
        </motion.div>

        {/* Clipboard copy */}
        <motion.div variants={fadeUp} transition={springs.gentle}>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm text-text-muted transition hover:text-text active:scale-95"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-emerald-400" />
            ) : (
              <ClipboardIcon className="h-4 w-4" />
            )}
            {copied ? 'Kopiert!' : copyFailed ? 'Kunne ikke kopiere' : 'Kopier estimat'}
          </button>
        </motion.div>
      </div>

      {/* Right column: line items summary */}
      <motion.div
        variants={fadeUp}
        transition={springs.gentle}
        className="flex flex-col gap-4 sm:border-l sm:border-white/10 sm:pl-6"
      >
        {grouped.map((group) => (
          <div key={group.category}>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-muted">
              {group.label}
            </h3>
            <div className="flex flex-col gap-1.5">
              {group.items.map((item) => (
                <div key={item.id} className="border-l border-white/15 pl-3 text-sm text-text">
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
