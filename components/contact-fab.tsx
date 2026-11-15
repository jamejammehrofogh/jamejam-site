import { MessageCircle, Phone } from "lucide-react";

export function ContactFab() {
  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:right-6">
      <a
        href="https://wa.me/989126975580"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="گفت‌وگو در واتساپ"
        className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-dark-bg shadow-lg transition hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
      >
        <MessageCircle size={22} />
      </a>
      <a
        href="tel:09126975580"
        aria-label="تماس تلفنی با آسانسور جام جم"
        className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-dark-bg shadow-lg transition hover:scale-105 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-light"
      >
        <Phone size={20} />
      </a>
    </div>
  );
}
