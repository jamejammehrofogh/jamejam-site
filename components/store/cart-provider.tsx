"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";
import { products, toman, type Product } from "@/lib/store-data";
import { toast } from "sonner";

type CartLine = { productId: string; quantity: number };
type CartItem = { product: Product; quantity: number };
type CartContextValue = {
  count: number;
  ready: boolean;
  items: CartItem[];
  add: (product: Product) => void;
  open: () => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "jam-jam-cart";

function isCartLines(value: unknown): value is CartLine[] {
  if (!Array.isArray(value)) return false;
  return value.every((line: unknown) => {
    if (typeof line !== "object" || line === null || !("productId" in line) || !("quantity" in line)) {
      return false;
    }
    if (
      typeof line.productId !== "string" ||
      typeof line.quantity !== "number" ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1
    ) {
      return false;
    }
    const product = products.find((item) => item.id === line.productId);
    return Boolean(product && line.quantity <= product.stock);
  });
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [catalog] = useState<Product[]>(products);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isCartLines(parsed)) {
          setLines(parsed);
        } else {
          console.warn("Saved cart data is invalid; clearing it.");
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.warn("Unable to read saved cart data.", error);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      } catch (error) {
        console.warn("Unable to persist cart data in this browser.", error);
      }
    }
  }, [lines, ready]);

  const add = useCallback((product: Product) => {
    if (product.stock < 1) {
      toast.error("این کالا در حال حاضر موجود نیست.");
      return;
    }
    const existing = lines.find((line) => line.productId === product.id);
    if (existing && existing.quantity >= product.stock) {
      toast.error("بیشتر از موجودی انبار نمی‌توانید اضافه کنید.");
      return;
    }
    setLines(existing
      ? lines.map((line) => line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line)
      : [...lines, { productId: product.id, quantity: 1 }]);
    setIsOpen(true);
    toast.success(`${product.title} به سبد خرید اضافه شد.`);
  }, [lines]);

  const changeQuantity = (product: Product, delta: number) => {
    setLines((current) =>
      current
        .map((line) =>
          line.productId === product.id
            ? { ...line, quantity: Math.min(product.stock, line.quantity + delta) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  };

  const remove = (productId: string) =>
    setLines((current) => current.filter((line) => line.productId !== productId));

  const lineProducts = lines.flatMap((line) => {
    const product = catalog.find((item) => item.id === line.productId);
    return product ? [{ product, quantity: line.quantity }] : [];
  });
  const count = lines.reduce((total, line) => total + line.quantity, 0);
  const total = lineProducts.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  const value = useMemo(
    () => ({
      count,
      ready,
      items: lineProducts,
      add,
      open: () => setIsOpen(true),
      clear: () => setLines([]),
    }),
    [count, ready, lineProducts, add],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="بستن سبد خرید"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] cursor-default bg-ink/40 backdrop-blur-[2px]"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-[61] flex w-full max-w-md flex-col border-r border-[#c3a258]/20 bg-[#14120f] text-amber-50 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#c3a258]/10 text-[#d6b66c]"><ShoppingBag size={19} /></span>
                  <div>
                    <h2 id="cart-title" className="font-extrabold text-ink">سبد خرید</h2>
                    <p className="mt-1 text-xs text-stone-500">{new Intl.NumberFormat("fa-IR").format(count)} کالا</p>
                  </div>
                </div>
                <button type="button" aria-label="بستن سبد خرید" onClick={() => setIsOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg text-stone-400 hover:bg-white/5"><X size={19} /></button>
              </div>

              {lineProducts.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                  <ShoppingBag size={36} className="text-stone-600" />
                  <p className="mt-4 font-bold text-amber-50">سبد خرید شما خالی است</p>
                  <button type="button" onClick={() => setIsOpen(false)} className="mt-4 text-sm font-bold text-[#d6b66c]">بازگشت به فروشگاه</button>
                </div>
              ) : (
                <>
                  <ul className="flex-1 divide-y divide-white/10 overflow-y-auto px-5">
                    {lineProducts.map(({ product, quantity }) => (
                      <li key={product.id} className="flex gap-3 py-4">
                        <img
                          src={product.image || "/images/store/placeholder.svg"}
                          alt={`تصویر ${product.title}`}
                          width={128}
                          height={128}
                          onError={(event) => {
                            const img = event.currentTarget;
                            if (!img.src.endsWith("/images/store/placeholder.svg")) img.src = "/images/store/placeholder.svg";
                          }}
                          className="h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-amber-50">{product.title}</p>
                          <p className="mt-1 text-xs text-stone-400">{toman(product.price)}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-lg border border-white/10 p-1">
                              <button type="button" aria-label="افزایش تعداد" disabled={quantity >= product.stock} onClick={() => changeQuantity(product, 1)} className="grid h-6 w-6 place-items-center rounded text-stone-300 hover:bg-white/5 disabled:opacity-40"><Plus size={14} /></button>
                              <span className="min-w-5 text-center text-xs font-bold">{new Intl.NumberFormat("fa-IR").format(quantity)}</span>
                              <button type="button" aria-label="کاهش تعداد" onClick={() => changeQuantity(product, -1)} className="grid h-6 w-6 place-items-center rounded text-stone-300 hover:bg-white/5"><Minus size={14} /></button>
                            </div>
                            <button type="button" aria-label={`حذف ${product.title}`} onClick={() => remove(product.id)} className="text-stone-500 hover:text-red-400"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-white/10 p-5">
                    <div className="flex items-center justify-between font-extrabold text-amber-50">
                      <span>جمع کل</span>
                      <span>{toman(total)}</span>
                    </div>
                    <Link href="/store/checkout" onClick={() => setIsOpen(false)} className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-[#c3a258] px-5 py-3 text-sm font-bold text-[#17130b] transition hover:bg-[#d8bc78]">
                      ادامه به تسویه‌حساب
                    </Link>
                  </div>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
}
