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

  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      {exists ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="h-auto w-full"
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="flex aspect-video items-center justify-center bg-slate-100 p-6 text-center text-sm text-slate-500"
        >
          <div>
            <p className="font-semibold text-slate-700">Screenshot pending</p>
            <p className="mt-1 text-xs">
              <code className="rounded bg-white px-1.5 py-0.5 text-slate-600 ring-1 ring-slate-200">{src}</code>
            </p>
            <p className="mt-2 max-w-md text-xs">{alt}</p>
          </div>
        </div>
      )}
      {caption && (
        <figcaption className="border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-600">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
