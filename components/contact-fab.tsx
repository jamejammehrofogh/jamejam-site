import { MessageCircle, Phone } from "lucide-react";

export function ContactFab() {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
      <a
        href="https://wa.me/989126975580"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="گفت‌وگو در واتساپ"
        className="bg-yellow-500 text-black p-4 rounded-full shadow-2xl hover:scale-110 transition"
      >
        <MessageCircle size={24} />
      </a>
      <a
        href="tel:09126975580"
        aria-label="تماس تلفنی با آسانسور جام جم"
        className="bg-yellow-500 text-black p-4 rounded-full shadow-2xl hover:scale-110 transition"
      >
        <Phone size={24} />
      </a>
    </div>
  );
}
