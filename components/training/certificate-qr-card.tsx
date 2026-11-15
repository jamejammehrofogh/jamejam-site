"use client";

import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";
import { qrDataUrl } from "@/lib/training/helpers";

export function CertificateQrCard({ url }: { url: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    qrDataUrl(url).then((dataUrl) => {
      if (active) setSrc(dataUrl);
    });
    return () => {
      active = false;
    };
  }, [url]);

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#2a2d35] bg-[#0f1013] p-5 md:w-64">
      <div className="grid h-40 w-40 place-items-center rounded-xl bg-white p-2">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="کد QR استعلام گواهینامه" className="h-full w-full" />
        ) : (
          <QrCode className="text-neutral-400" size={48} />
        )}
      </div>
      <p className="text-center text-[11px] leading-5 text-stone-400">
        این کد همان کد چاپ‌شده روی گواهینامه است
      </p>
      <p dir="ltr" className="w-full truncate text-center font-mono text-[10px] text-stone-500">
        {url}
      </p>
    </div>
  );
}
