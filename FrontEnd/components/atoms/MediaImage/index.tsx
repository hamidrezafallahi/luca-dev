import Image, { type ImageProps } from 'next/image';

import {
  isUploadMediaPath,
  toMediaUrl,
} from '@utils/toMediaUrl';

type MediaImageProps = Omit<ImageProps, 'src'> & {
  src: ImageProps['src'];
  fallbackSrc?: string;
};
 
 
/**
 * next/image for backend media.
 *
 * Uploads live on the nginx/backend volume, not inside the frontend container.
 * Always use a root-absolute `/uploads/...` path (see toMediaUrl) so locale
 * routes like `/fa/blog/...` do not resolve media as `/fa/uploads/...`.
 *
 * Uploads are already WebP from the API — serve them directly (unoptimized).
 * Routing them through `/_next/image` adds cold-start latency and hurts LCP
 * on the landing page more than the byte savings help.
 */
export default function MediaImage({
  src,
  fallbackSrc = '/images/user-placeholder.png',
  alt,
  unoptimized,
  sizes,
  fill,
  ...props
}: MediaImageProps) {
  const resolvedSrc =
    typeof src === 'string'
      ? toMediaUrl(src) || fallbackSrc
      : src;

  const isUpload =
    typeof resolvedSrc === 'string' &&
    isUploadMediaPath(resolvedSrc);

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      fill={fill}
      sizes={sizes ?? (fill ? '(max-width: 768px) 100vw, 33vw' : undefined)}
      unoptimized={unoptimized ?? isUpload}
    />
  );
}
