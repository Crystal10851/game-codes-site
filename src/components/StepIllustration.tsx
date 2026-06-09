import { Screenshot } from './Screenshot';
import { RedeemDiagram } from './RedeemDiagram';
import { resolveImageSrc } from '@/lib/images';

interface Props {
  src: string | undefined;
  stepNumber: number;
  stepTitle: string;
  gameName: string;
  accentColor?: string;
}

export function StepIllustration({
  src,
  stepNumber,
  stepTitle,
  gameName,
  accentColor,
}: Props) {
  if (!src) return null;
  const resolved = resolveImageSrc(src);
  if (!resolved) return null;

  if (resolved.kind === 'diagram') {
    return (
      <RedeemDiagram
        name={resolved.name}
        stepNumber={stepNumber}
        label={stepTitle}
        accentColor={accentColor}
      />
    );
  }

  return (
    <Screenshot
      src={src}
      alt={`${gameName} redeem step ${stepNumber}: ${stepTitle}`}
      caption={`Step ${stepNumber} — ${stepTitle}`}
    />
  );
}
