import { useState, type FormEvent } from 'react';
import { Heart, MessageCircle, Send, ShoppingCart } from 'lucide-react';
import { STORE_BRAND } from '../data/liveShopData';

export interface FloatingHeartParticle {
  id: number;
  driftX: number;
  rotate: number;
}

interface LiveFooterBarProps {
  onOpenCheckout: () => void;
  onSendComment: (text: string) => void;
  onLike: () => void;
  floatingHearts: FloatingHeartParticle[];
}

export function LiveFooterBar({
  onOpenCheckout,
  onSendComment,
  onLike,
  floatingHearts,
}: LiveFooterBarProps) {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;
    onSendComment(trimmed);
    setCommentText('');
  };

  return (
    <footer className="relative z-20 px-3 pb-3 pt-1.5 bg-gradient-to-t from-black via-black/92 to-transparent space-y-2">
      {/* Barra visible y directa para comentar en vivo */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 focus-within:border-cyan-400/80 focus-within:bg-black/75 transition-all shadow-lg"
      >
        <MessageCircle className="w-4 h-4 text-cyan-300 shrink-0" aria-hidden="true" />
        <label htmlFor="live-comment-input" className="sr-only">
          Comenta o haz una pregunta en el Live
        </label>
        <input
          id="live-comment-input"
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Escribe tu comentario o pregunta en vivo..."
          maxLength={140}
          className="flex-1 min-w-0 bg-transparent py-1 text-xs text-white placeholder:text-zinc-300 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Enviar comentario"
          className="shrink-0 inline-flex items-center gap-1 min-h-[32px] px-3 py-1 rounded-full bg-cyan-400 text-slate-950 font-display text-[11px] font-bold hover:bg-cyan-300 active:scale-95 transition-all cursor-pointer"
        >
          <span>Enviar</span>
          <Send className="w-3 h-3" />
        </button>
      </form>

      {/* Barra principal de acciones en zona natural del pulgar */}
      <div className="flex items-center gap-1.5">
        {/* Botón CTA principal */}
        <button
          type="button"
          onClick={onOpenCheckout}
          data-testid="primary-buy-cta"
          className="flex-1 min-w-0 min-h-[44px] px-3 py-2 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 font-display text-[12px] font-extrabold tracking-tight leading-tight flex items-center justify-center gap-1.5 shadow-[0_6px_24px_rgba(16,185,129,0.45)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Comprar Tyruss Full + App Gratis</span>
        </button>

        {/* Botón Me gusta con corazones flotantes */}
        <div className="relative shrink-0">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 w-12 h-40 overflow-visible"
          >
            {floatingHearts.map((heart) => (
              <span
                key={heart.id}
                style={
                  {
                    '--drift-x': `${heart.driftX}px`,
                    '--rot': `${heart.rotate}deg`,
                  } as React.CSSProperties
                }
                className="animate-float-heart absolute bottom-0 left-1/2 -translate-x-1/2 text-rose-500 drop-shadow-[0_2px_6px_rgba(244,63,94,0.65)]"
              >
                <Heart className="w-5 h-5 fill-rose-500" />
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onLike}
            data-testid="footer-like-btn"
            aria-label="Dar Me gusta al Live"
            className="inline-flex items-center justify-center w-[44px] h-[44px] rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-400 hover:bg-rose-500/30 active:scale-90 transition-all cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </button>
        </div>

        {/* Botón directo a WhatsApp oficial */}
        <a
          href={`https://wa.me/${STORE_BRAND.whatsappNumber}?text=${encodeURIComponent(
            '¡Hola Marié! Estoy viendo el Live de ColShopi Tienda y quiero asesoría sobre Tyruss Full + App TyroFem 30D.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chatear por WhatsApp oficial"
          className="shrink-0 inline-flex items-center justify-center w-[44px] h-[44px] rounded-full bg-[#25D366] text-slate-950 font-bold shadow-[0_4px_16px_rgba(37,211,102,0.45)] hover:brightness-105 active:scale-95 transition-all"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
            <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5L2 22l5.156-1.344c1.469.797 3.125 1.234 4.875 1.234 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.172.109-1.891-.125-.438-.141-1-.328-1.719-.641-3.016-1.313-4.984-4.375-5.141-4.578-.141-.203-1.234-1.641-1.234-3.125s.781-2.219 1.063-2.516c.281-.297.609-.375.813-.375.203 0 .406 0 .578.016.188.016.438-.078.688.516.25.609.859 2.094.938 2.25.078.156.125.344.031.547-.109.203-.156.328-.313.5-.156.172-.328.391-.469.516-.156.156-.313.328-.141.641.172.313.781 1.297 1.672 2.094 1.156 1.031 2.125 1.344 2.438 1.5.313.156.5.125.688-.078.188-.203.781-.906.984-1.219.203-.313.422-.266.703-.156.281.109 1.797.844 2.109 1 .313.156.516.234.594.359.078.125.078.734-.172 1.438z" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
