import { ShoppingBag } from 'lucide-react';
import { PRODUCT_INFO, type ComboOption } from '../data/liveShopData';
import { formatCOP } from '../utils/checkout';

interface FloatingProductCardProps {
  selectedCombo: ComboOption;
  onOpenCheckout: () => void;
}

export function FloatingProductCard({
  selectedCombo,
  onOpenCheckout,
}: FloatingProductCardProps) {
  return (
    <aside
      aria-label="Producto destacado en vivo"
      className="w-[116px] rounded-2xl bg-zinc-950/88 backdrop-blur-md border border-white/15 p-2 shadow-[0_12px_28px_rgba(0,0,0,0.75)] flex flex-col gap-1.5"
    >
      {/* Miniatura compacta del tarro Tyruss Full */}
      <button
        type="button"
        onClick={onOpenCheckout}
        aria-label={`Ver oferta ${PRODUCT_INFO.name} ${PRODUCT_INFO.weight}`}
        className="relative w-full h-[64px] rounded-xl bg-gradient-to-b from-white/10 to-white/5 flex items-center justify-center p-1 overflow-hidden group cursor-pointer"
      >
        <img
          src={PRODUCT_INFO.imageFrontTransparent}
          alt={`${PRODUCT_INFO.name} ${PRODUCT_INFO.weight}`}
          referrerPolicy="no-referrer"
          className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-200"
        />
        <span className="absolute top-1 left-1 px-1 py-0.5 rounded bg-emerald-500/95 text-[8.5px] font-bold text-slate-950 leading-none">
          500g
        </span>
      </button>

      {/* Nombre, combo activo y precio */}
      <div className="space-y-0.5">
        <p className="font-display text-[11px] font-bold text-white leading-tight truncate">
          {PRODUCT_INFO.name}
        </p>
        <p className="text-[9.5px] text-zinc-300 leading-tight truncate">
          {selectedCombo.title}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="font-mono-tabular text-[12px] font-bold text-cyan-300">
            {formatCOP(selectedCombo.price)}
          </span>
        </div>
      </div>

      {/* Botón compacto Ver combos */}
      <button
        type="button"
        onClick={onOpenCheckout}
        data-testid="floating-buy-btn"
        className="w-full min-h-[30px] px-2 py-1 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-display text-[10.5px] font-extrabold flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
      >
        <ShoppingBag className="w-3 h-3 shrink-0" />
        <span>Ver combos</span>
      </button>
    </aside>
  );
}
