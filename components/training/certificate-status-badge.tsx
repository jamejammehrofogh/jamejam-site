import { ShieldCheck, ShieldX } from "lucide-react";

export function CertificateStatusBadge({
  status,
  size = "lg",
}: {
  status: "valid" | "revoked";
  size?: "sm" | "lg";
}) {
  const valid = status === "valid";
  const Icon = valid ? ShieldCheck : ShieldX;
  const sizing = size === "lg" ? "px-5 py-3 text-sm" : "px-3 py-1 text-xs";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-2xl border font-black ${sizing} ${valid
          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
          : "border-red-500/50 bg-red-500/10 text-red-300"
        }`}
    >
      <Icon size={size === "lg" ? 20 : 15} />
      {valid ? "معتبر / Valid" : "ابطال‌شده / Revoked"}
    </span>
  );
}
