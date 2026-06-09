import Image from 'next/image';
import fs from 'node:fs';
import path from 'node:path';

interface ScreenshotProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Screenshot({
  src,
  alt,
  caption,
  width = 1280,
  height = 720,
  priority = false,
}: ScreenshotProps) {
  const publicPath = path.join(process.cwd(), 'public', src.replace(/^\//, ''));
  const exists = fs.existsSync(publicPath);

  if (!exists) return null;

  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="h-auto w-full"
      />
      {caption && (
        <figcaption className="border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-600">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
