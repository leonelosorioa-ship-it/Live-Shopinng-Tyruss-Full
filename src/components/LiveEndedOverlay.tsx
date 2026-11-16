import { Flame, MessageCircle, ShoppingCart } from 'lucide-react';
import { PRODUCT_INFO, STORE_BRAND } from '../data/liveShopData';
import { FINAL_URGENCY_STOCK } from '../utils/liveSession';

interface LiveEndedOverlayProps {
  onOpenCheckout: () => void;
  remainingProducts?: number;
}

export function LiveEndedOverlay({
  onOpenCheckout,
  remainingProducts = FINAL_URGENCY_STOCK,
}: LiveEndedOverlayProps) {
  const whatsappHelpUrl = `https://wa.me/${STORE_BRAND.whatsappNumber}?text=${encodeURIComponent(
    '¡Hola Marié! Acabo de ver el Live de ColShopi Tienda y no quiero perderme la oportunidad de pedir mi Tyruss Full + App TyroFem 30D Gratis.'
  )}`;

  return (
    <div
      data-testid="live-ended-cta-overlay"
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/78 backdrop-blur-md px-5 py-6 animate-[fadeIn_200ms_ease-out]"
    >
      <div className="w-full max-w-[345px] rounded-3xl bg-zinc-950/95 border border-emerald-400/35 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.92)] flex flex-col items-center text-center gap-4">
        <img
          src={STORE_BRAND.hostAvatar}
          alt={STORE_BRAND.hostName}
          referrerPolicy="no-referrer"
          className="w-16 h-16 rounded-full ring-2 ring-emerald-400/80 object-cover object-top shadow-lg"
        />

        <div className="space-y-2">
          <p className="text-xs font-medium text-cyan-300">
            {STORE_BRAND.hostName} · {STORE_BRAND.name}
          </p>
          <h2 className="font-display text-[20px] font-extrabold text-white leading-tight text-balance">
            ¡No te pierdas la oportunidad!
          </h2>
          <p className="text-[13px] text-zinc-200 leading-relaxed text-balance">
            La transmisión de hoy terminó, pero aún puedes realizar tu pedido de{' '}
            <span className="text-emerald-300 font-semibold">
              {PRODUCT_INFO.name} + App TyroFem 30D Gratis
            </span>{' '}
            antes de cerrar los cupos del Live.
          </p>
        </div>

        <ul className="w-full rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 text-left space-y-1.5 text-xs text-zinc-200">
          <li>Envío nacional y pago contra entrega</li>
          <li>Acceso 100% gratis a App TyroFem 30D</li>
          <li>Registro {PRODUCT_INFO.invima}</li>
        </ul>

        <div
          data-testid="ended-stock-badge"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-500/20 border border-rose-400/50 text-amber-200 text-xs font-bold"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
          <span className="font-mono-tabular">
            Solo quedan {remainingProducts} unidades disponibles
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenCheckout}
          data-testid="ended-order-cta"
          className="w-full min-h-[48px] px-5 py-3 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 font-display text-[14px] font-extrabold tracking-tight flex items-center justify-center gap-2 shadow-[0_8px_28px_rgba(16,185,129,0.5)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer animate-cta-pulse"
        >
          <ShoppingCart className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Realizar mi pedido ahora</span>
        </button>

        <a
          href={whatsappHelpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300 hover:text-emerald-200 underline underline-offset-4 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
          <span>¿Dudas? Escríbenos por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
