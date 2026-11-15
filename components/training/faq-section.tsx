// آکاردئون پرسش‌های متداول — با دکمه‌های قابل دسترس‌پذیری و باز/بسته شدن فقط با کیبورد هم کار می‌کند
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FaqItem = { q: string; a: string };

export function FaqSection({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-6 divide-y divide-dark-border overflow-hidden rounded-3xl border border-dark-border bg-dark-card">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right text-sm font-extrabold text-ink transition hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                {item.q}
                <ChevronDown
                  size={18}
                  aria-hidden
                  className={`shrink-0 text-gold-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </h3>
            {isOpen && (
              <p
                id={`faq-panel-${index}`}
                className="px-5 pb-5 text-sm leading-8 text-slate-400"
              >
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
