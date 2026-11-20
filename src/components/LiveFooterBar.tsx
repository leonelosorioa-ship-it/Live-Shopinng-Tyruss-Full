import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Flame, Heart, MessageCircle, Send, Share2, ShoppingCart, ThumbsUp } from 'lucide-react';
import { formatRemainingProductsLabel } from '../utils/liveSession';

export interface FloatingHeartParticle {
  id: number;
  driftX: number;
  rotate: number;
  colorClass?: string;
  kind?: 'heart' | 'like';
}

interface LiveFooterBarProps {
  onOpenCheckout: () => void;
  onOpenShare: () => void;
  onSendComment: (text: string) => void;
  onLike: (kind?: 'heart' | 'like') => void;
  floatingHearts: FloatingHeartParticle[];
  remainingProducts: number;
}

export function LiveFooterBar({
  onOpenCheckout,
  onOpenShare,
  onSendComment,
  onLike,
  floatingHearts,
  remainingProducts,
}: LiveFooterBarProps) {
  const [commentText, setCommentText] = useState('');
  const [isBuyHaptic, setIsBuyHaptic] = useState(false);
  const openTimerRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (openTimerRef.current !== null) window.clearTimeout(openTimerRef.current);
      if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);
    };
  }, []);

  const handleBuyClick = () => {
    if (openTimerRef.current !== null) window.clearTimeout(openTimerRef.current);
    if (resetTimerRef.current !== null) window.clearTimeout(resetTimerRef.current);

    setIsBuyHaptic(false);
    window.requestAnimationFrame(() => {
      setIsBuyHaptic(true);
    });

    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate([14, 24, 18]);
      }
    } catch {
      // Ignorar si el navegador restringe la API de vibración
    }

    openTimerRef.current = window.setTimeout(() => {
      onOpenCheckout();
    }, 150);

    resetTimerRef.current = window.setTimeout(() => {
      setIsBuyHaptic(false);
    }, 300);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;
    onSendComment(trimmed);
    setCommentText('');
  };

  return (
    <footer className="relative z-20 px-3 pb-2.5 pt-1 bg-gradient-to-t from-black/80 via-black/45 to-transparent space-y-1.5">
      {/* Fila compacta de comentarios + botón representativo de Compartir enseguida */}
      <div className="flex items-center gap-2">
        <form
          onSubmit={handleSubmit}
          className="flex-1 min-w-0 flex items-center gap-1 pl-2.5 pr-1 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 focus-within:border-cyan-400/80 focus-within:bg-black/75 transition-all shadow-lg"
        >
          <MessageCircle className="w-3.5 h-3.5 text-cyan-300 shrink-0" aria-hidden="true" />
          <label htmlFor="live-comment-input" className="sr-only">
            Comenta o haz una pregunta en el Live
          </label>
          <input
            id="live-comment-input"
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Comenta en vivo..."
            maxLength={140}
            className="flex-1 min-w-0 bg-transparent py-0.5 text-[11px] text-white placeholder:text-zinc-300 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Enviar comentario"
            className="shrink-0 inline-flex items-center gap-1 min-h-[28px] px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-display text-[10.5px] font-bold hover:bg-cyan-300 active:scale-95 transition-all cursor-pointer"
          >
            <span>Enviar</span>
            <Send className="w-3 h-3" />
          </button>
        </form>

        <button
          type="button"
          onClick={onOpenShare}
          data-testid="share-live-btn"
          aria-label="Compartir Live en WhatsApp y redes sociales"
          className="shrink-0 inline-flex items-center justify-center gap-1.5 min-h-[34px] px-3 py-1 rounded-full bg-gradient-to-r from-fuchsia-600/90 to-cyan-500/90 border border-white/25 text-white font-display text-[11px] font-bold shadow-[0_4px_14px_rgba(217,70,239,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Share2 className="w-3.5 h-3.5 shrink-0" />
          <span>Compartir</span>
        </button>
      </div>

      {/* Barra principal de acciones en zona natural del pulgar */}
      <div className="flex items-end gap-2">
        {/* Columna izquierda: etiqueta de urgencia encima del botón CTA principal */}
        <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
          <div
            data-testid="stock-urgency-tag"
            aria-live="polite"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-950/90 border border-rose-400/55 text-amber-200 text-[10.5px] font-bold tracking-wide leading-none shadow-[0_2px_10px_rgba(244,63,94,0.3)]"
          >
            <Flame className="w-3 h-3 text-amber-400 shrink-0" aria-hidden="true" />
            <span className="font-mono-tabular whitespace-nowrap">
              {formatRemainingProductsLabel(remainingProducts)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleBuyClick}
            data-testid="primary-buy-cta"
            data-haptic-active={isBuyHaptic ? 'true' : 'false'}
            className={`w-full min-w-0 min-h-[42px] px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 font-display text-[12px] font-extrabold tracking-tight leading-tight flex items-center justify-center gap-1.5 shadow-[0_6px_24px_rgba(16,185,129,0.45)] hover:brightness-105 transition-all cursor-pointer ${
              isBuyHaptic ? 'animate-cta-haptic' : 'animate-cta-pulse'
            }`}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Comprar Tyruss Full + App Gratis</span>
          </button>
        </div>

        {/* Botones de reacción alineados al botón principal */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Botón corazón con partículas flotantes */}
          <div className="relative shrink-0">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[58px] left-1/2 -translate-x-1/2 z-30 w-24 h-72 overflow-visible"
            >
              {floatingHearts.map((heart) => (
                <span
                  key={heart.id}
                  data-testid="floating-heart-particle"
                  style={
                    {
                      '--drift-x': `${heart.driftX}px`,
                      '--rot': `${heart.rotate}deg`,
                    } as React.CSSProperties
                  }
                  className={`animate-float-heart absolute bottom-0 left-1/2 -translate-x-1/2 opacity-90 ${
                    heart.colorClass ?? 'text-rose-500'
                  }`}
                >
                  {heart.kind === 'like' ? (
                    <ThumbsUp className="w-[17px] h-[17px] fill-current drop-shadow-[0_2px_8px_rgba(34,211,238,0.7)]" />
                  ) : (
                    <Heart className="w-[18px] h-[18px] fill-current drop-shadow-[0_2px_8px_rgba(244,63,94,0.7)]" />
                  )}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onLike('heart')}
              data-testid="footer-like-btn"
              aria-label="Enviar corazón en el Live"
              className="inline-flex items-center justify-center w-[42px] h-[42px] rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-400 hover:bg-rose-500/30 active:scale-90 transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            </button>
          </div>

          {/* Botón Me gusta para interacción continua en vivo */}
          <button
            type="button"
            onClick={() => onLike('like')}
            data-testid="footer-thumbsup-btn"
            aria-label="Dar Me gusta al Live"
            className="shrink-0 inline-flex items-center justify-center w-[42px] h-[42px] rounded-full bg-sky-500/20 border border-sky-400/45 text-sky-300 hover:bg-sky-500/30 active:scale-90 transition-all cursor-pointer"
          >
            <ThumbsUp className="w-4 h-4 fill-sky-400 text-sky-400" />
          </button>
        </div>
      </div>
    </footer>
  );
}
