"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/training/auth/login", { method: "DELETE" }).catch(() => null);
    router.push("/training/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-neutral-300 transition hover:border-red-500/50 hover:text-red-300 disabled:opacity-50"
    >
      <LogOut size={14} /> {busy ? "در حال خروج…" : "خروج از حساب"}
    </button>
  );
}
