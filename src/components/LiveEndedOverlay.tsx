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
      className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/35 backdrop-blur-[4px] px-5 py-6 animate-[fadeIn_200ms_ease-out]"
    >
      <div className="w-full max-w-[345px] rounded-3xl bg-white/97 border border-slate-200/90 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.18)] flex flex-col items-center text-center gap-4 text-slate-800">
        <img
          src={STORE_BRAND.hostAvatar}
          alt={STORE_BRAND.hostName}
          referrerPolicy="no-referrer"
          className="w-16 h-16 rounded-full ring-2 ring-emerald-600/60 object-cover object-top shadow-md"
        />

        <div className="space-y-2">
          <p className="text-xs font-semibold text-emerald-700">
            {STORE_BRAND.hostName} · {STORE_BRAND.name}
          </p>
          <h2 className="font-display text-[20px] font-extrabold text-slate-900 leading-tight text-balance">
            ¡No te pierdas la oportunidad!
          </h2>
          <p className="text-[13px] text-slate-600 leading-relaxed text-balance">
            La transmisión de hoy terminó, pero aún puedes realizar tu pedido de{' '}
            <span className="text-emerald-800 font-semibold">
              {PRODUCT_INFO.name} + App TyroFem 30D Gratis
            </span>{' '}
            antes de cerrar los cupos del Live.
          </p>
        </div>

        <ul className="w-full rounded-2xl bg-slate-50 border border-slate-200/80 px-4 py-3 text-left space-y-1.5 text-xs text-slate-700">
          <li>Envío nacional y pago contra entrega</li>
          <li>Acceso 100% gratis a App TyroFem 30D</li>
          <li>Registro {PRODUCT_INFO.invima}</li>
        </ul>

        <div
          data-testid="ended-stock-badge"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold"
        >
          <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
          <span className="font-mono-tabular">
            Solo quedan {remainingProducts} unidades disponibles
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenCheckout}
          data-testid="ended-order-cta"
          className="w-full min-h-[48px] px-5 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-display text-[14px] font-bold tracking-tight flex items-center justify-center gap-2 shadow-[0_8px_22px_rgba(4,120,87,0.24)] active:scale-[0.98] transition-all cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Realizar mi pedido ahora</span>
        </button>

        <a
          href={whatsappHelpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 underline underline-offset-4 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
          <span>¿Dudas? Escríbenos por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
