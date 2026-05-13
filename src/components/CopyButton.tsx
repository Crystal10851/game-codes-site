'use client';

import { useState } from 'react';

export function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={`Copy code ${value}`}
      className="inline-flex h-9 items-center rounded-md border border-brand-500 bg-brand-500 px-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed"
    >
      {copied ? 'Copied!' : (label ?? 'Copy')}
    </button>
  );
}
