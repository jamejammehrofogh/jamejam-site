export const productCategories = [
  { id: "all", label: "همه قطعات" },
  { id: "motors", label: "موتور آسانسور" },
  { id: "panels", label: "تابلو فرمان" },
  { id: "doors", label: "درب آسانسور" },
  { id: "cabins", label: "کابین و تزئینات" },
  { id: "rails", label: "ریل و راهنما" },
  { id: "safety", label: "تجهیزات ایمنی" },
  { id: "cables", label: "سیم‌بکسل" },
] as const;

export type ProductCategory = (typeof productCategories)[number]["id"];
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type Product = {
  id: string;
  title: string;
  category: Exclude<ProductCategory, "all">;
  sku: string;
  brand: string;
  price: number;
  stock: number;
  stockStatus: StockStatus;
  description: string;
  specs: [string, string][];
  color: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "motor-gearless-6",
    title: "موتور گیرلس ۶ نفره",
    category: "motors",
    sku: "JJ-MTR-0601",
    brand: "بهاران",
    price: 78500000,
    stock: 4,
    stockStatus: "low_stock",
    description: "موتور گیرلس کم‌مصرف، مناسب آسانسورهای مسکونی با ظرفیت ۶ نفر و حرکت نرم.",
    specs: [["ظرفیت", "۶ نفر / ۴۵۰ کیلوگرم"], ["سرعت", "۱ متر بر ثانیه"], ["نوع موتور", "گیرلس، بدون گیربکس"]],
    color: "from-amber-100 to-stone-300",
    image: "/images/store/motor-gearless.svg",
  },
  {
    id: "motor-geared-8",
    title: "موتور گیربکس ۸ نفره",
    category: "motors",
    sku: "JJ-MTR-0802",
    brand: "الکو",
    price: 64200000,
    stock: 8,
    stockStatus: "in_stock",
    description: "موتور کششی بادوام با گیربکس کم‌صدا برای پروژه‌های مسکونی و اداری.",
    specs: [["ظرفیت", "۸ نفر / ۶۰۰ کیلوگرم"], ["سرعت", "۱ متر بر ثانیه"], ["نوع موتور", "گیربکس‌دار"]],
    color: "from-zinc-200 to-stone-400",
    image: "/images/store/motor-geared.svg",
  },
  {
    id: "controller-vvvf",
    title: "تابلو فرمان VVVF",
    category: "panels",
    sku: "JJ-CTL-2204",
    brand: "آریان",
    price: 42600000,
    stock: 7,
    stockStatus: "in_stock",
    description: "تابلو فرمان مجهز به درایو کنترل سرعت برای شروع و توقف نرم و کاهش مصرف انرژی.",
    specs: [["کاربری", "مسکونی و اداری"], ["تعداد توقف", "تا ۱۲ توقف"], ["کنترل سرعت", "VVVF"]],
    color: "from-indigo-100 to-slate-200",
    image: "/images/store/control-panel-vvvf.svg",
  },
  {
    id: "controller-hybrid-16",
    title: "تابلو فرمان هوشمند ۱۶ توقف",
    category: "panels",
    sku: "JJ-CTL-1616",
    brand: "آریان",
    price: 58900000,
    stock: 3,
    stockStatus: "low_stock",
    description: "کنترلر میکروپروسسوری با قابلیت عیب‌یابی و پشتیبانی از موتورهای دو سرعته و VVVF.",
    specs: [["تعداد توقف", "تا ۱۶ توقف"], ["حالت سرویس", "آتش‌نشان و اضطراری"], ["نمایشگر", "LCD عیب‌یابی"]],
    color: "from-slate-200 to-blue-100",
    image: "/images/store/control-panel-smart.svg",
  },
  {
    id: "cabin-steel",
    title: "کابین استیل طرح‌دار",
    category: "cabins",
    sku: "JJ-CAB-6045",
    brand: "سفارش جام جم",
    price: 53800000,
    stock: 2,
    stockStatus: "low_stock",
    description: "کابین با پوشش استیل خش‌دار و کف مقاوم؛ ابعاد و تزئینات قابل انتخاب بر اساس پروژه.",
    specs: [["ظرفیت پیشنهادی", "۶ نفر"], ["پوشش", "استیل خش‌دار"], ["کف", "سنگ یا PVC سفارشی"]],
    color: "from-amber-100 to-stone-300",
    image: "/images/store/cabin-steel.svg",
  },
  {
    id: "cabin-modern-8",
    title: "کابین مدرن آینه‌ای",
    category: "cabins",
    sku: "JJ-CAB-8060",
    brand: "سفارش جام جم",
    price: 69700000,
    stock: 5,
    stockStatus: "in_stock",
    description: "طراحی مدرن با دیواره آینه‌ای، نورپردازی LED و کف‌پوش قابل انتخاب.",
    specs: [["ظرفیت", "۸ نفر"], ["پوشش", "استیل و آینه"], ["روشنایی", "LED کم‌مصرف"]],
    color: "from-stone-200 to-amber-100",
    image: "/images/store/cabin-mirror.svg",
  },
  {
    id: "door-central-80",
    title: "درب اتوماتیک مرکزی ۸۰",
    category: "doors",
    sku: "JJ-DR-0080",
    brand: "آریا درب",
    price: 18900000,
    stock: 0,
    stockStatus: "out_of_stock",
    description: "درب تمام‌اتوماتیک مرکزی با عملکرد روان، مناسب ورودی کابین آسانسورهای مسکونی.",
    specs: [["عرض ورودی", "۸۰ سانتی‌متر"], ["نوع بازشو", "مرکزی دو لته"], ["گارانتی", "۱۲ ماه"]],
    color: "from-slate-200 to-zinc-300",
    image: "/images/store/door-central.svg",
  },
  {
    id: "door-telescopic-90",
    title: "درب تلسکوپی ۹۰ سانتی‌متر",
    category: "doors",
    sku: "JJ-DR-0090",
    brand: "آریا درب",
    price: 22400000,
    stock: 6,
    stockStatus: "in_stock",
    description: "درب تلسکوپی با بازشوی سریع و صدای کم برای آسانسورهای پرتردد.",
    specs: [["عرض ورودی", "۹۰ سانتی‌متر"], ["نوع بازشو", "تلسکوپی دو لته"], ["پوشش", "الکترواستاتیک"]],
    color: "from-neutral-200 to-stone-300",
    image: "/images/store/door-telescopic.svg",
  },
  {
    id: "safety-governor",
    title: "گاورنر ایمنی آسانسور",
    category: "safety",
    sku: "JJ-SF-0012",
    brand: "تولید ایران",
    price: 12600000,
    stock: 5,
    stockStatus: "in_stock",
    description: "گاورنر برای فعال‌سازی سیستم پاراشوت در شرایط افزایش سرعت بیش از حد مجاز.",
    specs: [["سرعت نامی", "۱ متر بر ثانیه"], ["کاربری", "آسانسور کششی"], ["گواهی", "مطابق مشخصات سازنده"]],
    color: "from-rose-100 to-slate-200",
    image: "/images/store/safety-governor.svg",
  },
  {
    id: "safety-buffer",
    title: "ضربه‌گیر هیدرولیکی",
    category: "safety",
    sku: "JJ-SF-0208",
    brand: "ایمن‌سازان",
    price: 8450000,
    stock: 1,
    stockStatus: "low_stock",
    description: "ضربه‌گیر مستحکم برای جذب انرژی در انتهای مسیر حرکت کابین و وزنه تعادل.",
    specs: [["نوع", "هیدرولیکی"], ["ظرفیت", "مطابق وزن کابین"], ["کاربری", "چاه آسانسور کششی"]],
    color: "from-orange-100 to-stone-300",
    image: "/images/store/safety-buffer.svg",
  },
  {
    id: "guide-rail-t70",
    title: "ریل راهنمای T70",
    category: "rails",
    sku: "JJ-RL-T070",
    brand: "تولید ایران",
    price: 3850000,
    stock: 18,
    stockStatus: "in_stock",
    description: "ریل راهنمای آسانسور با کیفیت ساخت مناسب برای نصب و سرویس آسانسورهای متداول.",
    specs: [["مدل", "T70/B"], ["طول شاخه", "۵ متر"], ["کاربرد", "ریل کابین و وزنه"]],
    color: "from-slate-200 to-cyan-100",
    image: "/images/store/rail-t70.svg",
  },
  {
    id: "wire-rope-8",
    title: "سیم‌بکسل نمره ۸",
    category: "cables",
    sku: "JJ-CR-0008",
    brand: "مغزی فولادی",
    price: 295000,
    stock: 42,
    stockStatus: "in_stock",
    description: "سیم‌بکسل آسانسوری مغز فولادی با بافت یکنواخت، فروش به‌صورت متری.",
    specs: [["قطر", "۸ میلی‌متر"], ["مغزی", "فولادی"], ["واحد فروش", "هر متر"]],
    color: "from-zinc-200 to-slate-300",
    image: "/images/store/wire-rope.svg",
  },
];

export type ProjectCategory = "residential" | "commercial" | "industrial";

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  location: string;
  type: string;
  capacity: string;
  stops: string;
  image: string;
  specs: [string, string][];
};

export const projects: Project[] = [
  {
    id: "mehr-residence",
    title: "مجتمع مسکونی مهر",
    category: "residential",
    location: "تهران، منطقه ۵",
    type: "آسانسور کششی گیرلس",
    capacity: "۸ نفر",
    stops: "۱۰ توقف",
    image: "/images/project-office.svg",
    specs: [["ظرفیت", "۶۰۰ کیلوگرم"], ["سرعت", "۱ متر بر ثانیه"], ["تعداد آسانسور", "۲ دستگاه"], ["مدت اجرا", "۹۰ روز"]],
  },
  {
    id: "negineshopping",
    title: "مرکز تجاری نگین",
    category: "commercial",
    location: "تهران، سعادت‌آباد",
    type: "آسانسور پرتردد",
    capacity: "۱۳ نفر",
    stops: "۸ توقف",
    image: "/images/project-lobby.svg",
    specs: [["ظرفیت", "۱۰۰۰ کیلوگرم"], ["سرعت", "۱٫۶ متر بر ثانیه"], ["تعداد آسانسور", "۳ دستگاه"], ["مدت اجرا", "۱۲۰ روز"]],
  },
  {
    id: "industrial-novin",
    title: "کارخانه نوین صنعت",
    category: "industrial",
    location: "البرز، شهرک صنعتی",
    type: "آسانسور باربر",
    capacity: "۱۶۰۰ کیلوگرم",
    stops: "۴ توقف",
    image: "/images/project-install.svg",
    specs: [["ظرفیت", "۱۶۰۰ کیلوگرم"], ["نوع محرکه", "کششی گیربکس‌دار"], ["ابعاد کابین", "۲۰۰ × ۲۵۰ سانتی‌متر"], ["مدت اجرا", "۷۵ روز"]],
  },
  {
    id: "saba-tower",
    title: "برج مسکونی صبا",
    category: "residential",
    location: "تهران، شهرک غرب",
    type: "آسانسور کششی دوگانه",
    capacity: "۱۰ نفر",
    stops: "۱۵ توقف",
    image: "/images/project-hotel.svg",
    specs: [["ظرفیت", "۷۵۰ کیلوگرم"], ["سرعت", "۱٫۶ متر بر ثانیه"], ["تعداد آسانسور", "۲ دستگاه"], ["مدت اجرا", "۱۵۰ روز"]],
  },
  {
    id: "pardis-office",
    title: "ساختمان اداری پردیس",
    category: "commercial",
    location: "تهران، ونک",
    type: "آسانسور گیرلس",
    capacity: "۸ نفر",
    stops: "۱۲ توقف",
    image: "/images/project-modern.svg",
    specs: [["ظرفیت", "۶۰۰ کیلوگرم"], ["سرعت", "۱٫۶ متر بر ثانیه"], ["کنترل", "VVVF گروهی"], ["مدت اجرا", "۱۱۰ روز"]],
  },
  {
    id: "dana-warehouse",
    title: "انبار لجستیک دانا",
    category: "industrial",
    location: "قم، شهرک شکوهیه",
    type: "آسانسور باربر",
    capacity: "۲۰۰۰ کیلوگرم",
    stops: "۳ توقف",
    image: "/images/project-hydraulic.svg",
    specs: [["ظرفیت", "۲۰۰۰ کیلوگرم"], ["نوع محرکه", "هیدرولیک"], ["ابعاد کابین", "۲۲۰ × ۳۰۰ سانتی‌متر"], ["مدت اجرا", "۶۰ روز"]],
  },
];

export const projectCategoryLabels = {
  all: "همه پروژه‌ها",
  residential: "مسکونی",
  commercial: "تجاری و اداری",
  industrial: "صنعتی",
} as const;

export type QuoteStatus = "new" | "contacted" | "proposal_sent" | "closed";
export type QuoteSubmission = {
  id: string;
  name: string;
  phone: string;
  service: string;
  buildingType: string;
  stops: number;
  capacity?: string;
  city?: string;
  details?: string;
  status: QuoteStatus;
  createdAt: string;
};

export type StoreOrder = {
  id: string;
  name: string;
  phone: string;
  address: string;
  paymentMethod: "gateway" | "transfer" | "in_person";
  items: { productId: string; title: string; quantity: number; price: number }[];
  total: number;
  createdAt: string;
};

const QUOTES_KEY = "jam-jam-quote-requests";
const ORDERS_KEY = "jam-jam-store-orders";

const sampleQuoteRequests: QuoteSubmission[] = [
  { id: "sample-lead-1", name: "علی محمدی", phone: "09121112233", service: "installation", buildingType: "residential", stops: 8, capacity: "6", status: "new", createdAt: "2026-10-18T06:55:00.000Z" },
  { id: "sample-lead-2", name: "شرکت توسعه بنا", phone: "09123334455", service: "maintenance", buildingType: "commercial", stops: 12, capacity: "8", status: "contacted", createdAt: "2026-10-17T14:15:00.000Z" },
  { id: "sample-lead-3", name: "مریم رضایی", phone: "09125556677", service: "repair", buildingType: "residential", stops: 5, capacity: "6", status: "new", createdAt: "2026-10-16T12:10:00.000Z" },
  { id: "sample-lead-4", name: "امیر کاظمی", phone: "09128889900", service: "parts", buildingType: "industrial", stops: 4, status: "proposal_sent", createdAt: "2026-10-15T09:25:00.000Z", details: "تابلو فرمان VVVF" },
];

function readStoredArray<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) ?? "null");
    return Array.isArray(value) ? value as T[] : fallback;
  } catch (error) {
    console.warn(`Unable to read mock data from localStorage (${key}).`, error);
    return fallback;
  }
}

function writeStoredArray<T>(key: string, value: T[]) {
  if (typeof window === "undefined") throw new Error("Browser storage is only available on the client.");
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save mock data to localStorage (${key}).`, error);
    throw new Error("ذخیره اطلاعات در مرورگر انجام نشد.");
  }
}

export function getQuoteRequests() {
  return readStoredArray(QUOTES_KEY, sampleQuoteRequests);
}

export function saveQuoteRequest(
  values: Omit<QuoteSubmission, "id" | "status" | "createdAt">,
) {
  const request: QuoteSubmission = {
    ...values,
    phone: toLatinDigits(values.phone),
    id: `lead-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  const current = getQuoteRequests();
  writeStoredArray(QUOTES_KEY, [request, ...current]);
  return request;
}

export function updateQuoteRequestStatus(id: string, status: QuoteStatus) {
  const updated = getQuoteRequests().map((request) =>
    request.id === id ? { ...request, status } : request,
  );
  writeStoredArray(QUOTES_KEY, updated);
  return updated;
}

export function getStoreOrders() {
  return readStoredArray<StoreOrder>(ORDERS_KEY, []);
}

export function saveStoreOrder(
  values: Omit<StoreOrder, "id" | "total" | "createdAt">,
) {
  const order: StoreOrder = {
    ...values,
    id: `JJ-${Date.now().toString(36).toUpperCase()}`,
    total: values.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    createdAt: new Date().toISOString(),
  };
  writeStoredArray(ORDERS_KEY, [order, ...getStoreOrders()]);
  return order;
}

export function toLatinDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const code = digit.charCodeAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  });
}

export const toman = (amount: number) =>
  `${new Intl.NumberFormat("fa-IR").format(amount)} تومان`;

export function getProduct(id: string) {
  return products.find((product) => product.id === id);
}
