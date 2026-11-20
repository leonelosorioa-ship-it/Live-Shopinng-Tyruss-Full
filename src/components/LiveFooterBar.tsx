import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Flame, Heart, MessageCircle, Send, Share2, ShoppingCart, ThumbsUp } from 'lucide-react';
import {
  CART_DEMAND_CAPACITY,
  computeCartDemandPercent,
  formatRemainingProductsLabel,
} from '../utils/liveSession';

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
  cartDemandCount: number;
  remainingProducts: number;
}

export function LiveFooterBar({
  onOpenCheckout,
  onOpenShare,
  onSendComment,
  onLike,
  floatingHearts,
  cartDemandCount,
  remainingProducts,
}: LiveFooterBarProps) {
  const demandPercent = computeCartDemandPercent(cartDemandCount, CART_DEMAND_CAPACITY);
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
    <footer className="relative z-20 px-3 pb-2.5 pt-1.5 bg-gradient-to-t from-slate-900/38 via-slate-900/14 to-transparent space-y-1.5">
      {/* Fila compacta de comentarios + botón Compartir limpio sin pulsación */}
      <div className="flex items-center gap-2">
        <form
          onSubmit={handleSubmit}
          className="flex-1 min-w-0 flex items-center gap-1.5 pl-3 pr-1 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-white/80 focus-within:border-emerald-600/60 focus-within:bg-white transition-all shadow-[0_2px_10px_rgba(15,23,42,0.1)]"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
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
            className="flex-1 min-w-0 bg-transparent py-0.5 text-[11px] text-slate-800 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Enviar comentario"
            className="shrink-0 inline-flex items-center gap-1 min-h-[28px] px-2.5 py-0.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-display text-[10.5px] font-semibold active:scale-95 transition-all cursor-pointer"
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
          className="shrink-0 inline-flex items-center justify-center gap-1.5 min-h-[34px] px-3 py-1 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-white/80 text-slate-800 font-display text-[11px] font-semibold shadow-[0_2px_10px_rgba(15,23,42,0.1)] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>Compartir</span>
        </button>
      </div>

      {/* Barra principal de acciones en zona natural del pulgar */}
      <div className="flex items-end gap-2">
        {/* Columna izquierda: etiqueta clara de unidades encima del botón CTA principal */}
        <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
          <div
            data-testid="stock-urgency-tag"
            aria-live="polite"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/92 backdrop-blur-md border border-amber-300/80 text-amber-900 text-[10.5px] font-semibold tracking-wide leading-none shadow-xs"
          >
            <Flame className="w-3 h-3 text-amber-600 shrink-0" aria-hidden="true" />
            <span className="font-mono-tabular whitespace-nowrap">
              {formatRemainingProductsLabel(remainingProducts)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleBuyClick}
            data-testid="primary-buy-cta"
            data-haptic-active={isBuyHaptic ? 'true' : 'false'}
            className={`w-full min-w-0 min-h-[44px] px-3 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-display text-[12px] font-bold tracking-tight leading-tight flex items-center justify-center gap-1.5 shadow-[0_6px_20px_rgba(4,120,87,0.28)] active:scale-[0.98] transition-all cursor-pointer ${
              isBuyHaptic ? 'animate-cta-haptic' : ''
            }`}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Comprar Tyruss Full + App Gratis</span>
          </button>
        </div>

        {/* Botones de reacción claros y tranquilos */}
        <div className="flex items-center gap-1.5 shrink-0">
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
                    <ThumbsUp className="w-[17px] h-[17px] fill-current drop-shadow-[0_2px_6px_rgba(14,165,233,0.45)]" />
                  ) : (
                    <Heart className="w-[18px] h-[18px] fill-current drop-shadow-[0_2px_6px_rgba(244,63,94,0.45)]" />
                  )}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onLike('heart')}
              data-testid="footer-like-btn"
              aria-label="Enviar corazón en el Live"
              className="inline-flex items-center justify-center w-[44px] h-[44px] rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-white/80 text-rose-500 active:scale-90 transition-all cursor-pointer shadow-[0_2px_10px_rgba(15,23,42,0.1)]"
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
            className="shrink-0 inline-flex items-center justify-center w-[44px] h-[44px] rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-white/80 text-sky-600 active:scale-90 transition-all cursor-pointer shadow-[0_2px_10px_rgba(15,23,42,0.1)]"
          >
            <ThumbsUp className="w-4 h-4 fill-sky-500 text-sky-600" />
          </button>
        </div>
      </div>

      {/* Barra inferior clara y limpia de demanda de pedidos */}
      <div
        data-testid="cart-demand-container"
        className="px-2.5 py-1.5 rounded-xl bg-white/88 backdrop-blur-md border border-white/75 shadow-[0_2px_10px_rgba(15,23,42,0.08)] space-y-1"
      >
        <div className="flex items-center justify-between gap-2 text-[10.5px] leading-none">
          <span className="text-slate-700 truncate">
            <strong className="font-mono-tabular font-bold text-slate-900">
              {cartDemandCount}
            </strong>{' '}
            personas agregaron al carrito
          </span>
          <span className="font-mono-tabular font-bold text-emerald-700 shrink-0">
            {demandPercent}% pedido
          </span>
        </div>

        <div
          role="progressbar"
          data-testid="cart-demand-bar"
          aria-label="Demanda de productos agregados al carrito"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={demandPercent}
          className="w-full h-1.5 rounded-full bg-slate-200/90 overflow-hidden"
        >
          <div
            data-testid="cart-demand-fill"
            style={{ width: `${demandPercent}%` }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-[width] duration-700 ease-out"
          />
        </div>
      </div>
    </footer>
  );
}
