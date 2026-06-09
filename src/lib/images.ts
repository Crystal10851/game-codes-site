import fs from 'node:fs';
import path from 'node:path';

const YOUTUBE_PREFIX = 'youtube:';
const DIAGRAM_PREFIX = 'diagram:';

export type ResolvedImage =
  | { kind: 'remote'; src: string }
  | { kind: 'diagram'; name: string }
  | null;

export function resolveImageSrc(src: string | undefined): ResolvedImage {
  if (!src) return null;

  if (src.startsWith(YOUTUBE_PREFIX)) {
    const id = src.slice(YOUTUBE_PREFIX.length).trim();
    if (!id) return null;
    return { kind: 'remote', src: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` };
  }

  if (src.startsWith(DIAGRAM_PREFIX)) {
    const name = src.slice(DIAGRAM_PREFIX.length).trim();
    if (!name) return null;
    return { kind: 'diagram', name };
  }

  if (src.startsWith('http://') || src.startsWith('https://')) {
    return { kind: 'remote', src };
  }

  if (src.startsWith('/')) {
    const publicPath = path.join(process.cwd(), 'public', src.replace(/^\//, ''));
    if (fs.existsSync(publicPath)) {
      return { kind: 'remote', src };
    }
    return null;
  }

  return null;
}
