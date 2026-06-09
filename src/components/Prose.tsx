import { type ReactNode } from 'react';

interface ProseSectionProps {
  id?: string;
  heading: string;
  children: ReactNode;
}

export function ProseSection({ id, heading, children }: ProseSectionProps) {
  return (
    <section aria-labelledby={id} className="scroll-mt-20">
      <h2 id={id} className="text-2xl font-bold text-slate-900">
        {heading}
      </h2>
      <div className="prose prose-slate mt-3 max-w-none text-slate-700 leading-relaxed [&_p]:mt-3 [&_p:first-child]:mt-0 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1 [&_strong]:text-slate-900 [&_a]:font-semibold [&_a]:text-brand-700 hover:[&_a]:underline">
        {children}
      </div>
    </section>
  );
}

export function Paragraphs({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/).filter(Boolean);
  return (
    <>
      {blocks.map((block, i) => (
        <p key={i}>{renderInlineMarkdown(block)}</p>
      ))}
    </>
  );
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[1];
    if (token.startsWith('**')) {
      parts.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const isExternal = /^https?:/.test(href);
        parts.push(
          <a
            key={key++}
            href={href}
            {...(isExternal
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {label}
          </a>,
        );
      }
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}
