"use client";

import { useState } from "react";

const FALLBACK_IMAGE = "/images/store/placeholder.svg";

/** تصویر محصول با fallback تمیز — اگر فایل پیدا نشود، placeholder نشان می‌دهد */
export function ProductImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK_IMAGE);

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={800}
      height={800}
      loading="eager"
      onError={() => {
        if (imageSrc !== FALLBACK_IMAGE) setImageSrc(FALLBACK_IMAGE);
      }}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
