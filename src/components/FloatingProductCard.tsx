import { ShoppingBag, Info } from 'lucide-react';
import { PRODUCT_INFO, type ComboOption } from '../data/liveShopData';
import { formatCOP } from '../utils/checkout';

interface FloatingProductCardProps {
  selectedCombo: ComboOption;
  onOpenCheckout: () => void;
  onOpenDetails: () => void;
}

export function FloatingProductCard({
  selectedCombo,
  onOpenCheckout,
  onOpenDetails,
}: FloatingProductCardProps) {
  return (
    <aside
      aria-label="Producto destacado en vivo"
      className="w-[144px] rounded-2xl bg-zinc-950/88 backdrop-blur-md border border-white/15 p-2.5 shadow-[0_14px_34px_rgba(0,0,0,0.75)] flex flex-col gap-2"
    >
      {/* Imagen del tarro Tyruss Full */}
      <button
        type="button"
        onClick={onOpenCheckout}
        aria-label={`Ver oferta ${PRODUCT_INFO.name} ${PRODUCT_INFO.weight}`}
        className="relative w-full h-[94px] rounded-xl bg-gradient-to-b from-white/10 to-white/5 flex items-center justify-center p-1.5 overflow-hidden group cursor-pointer"
      >
        <img
          src={PRODUCT_INFO.imageFrontTransparent}
          alt={`${PRODUCT_INFO.name} ${PRODUCT_INFO.weight}`}
          referrerPolicy="no-referrer"
          className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-200"
        />
        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-500/95 text-[9px] font-bold text-slate-950 leading-none">
          500g
        </span>
      </button>

      {/* Nombre, combo activo y precio */}
      <div className="space-y-0.5">
        <p className="font-display text-xs font-bold text-white leading-tight truncate">
          {PRODUCT_INFO.name}
        </p>
        <p className="text-[10px] text-zinc-300 leading-tight truncate">
          {selectedCombo.title}
        </p>
        <div className="flex items-baseline gap-1 pt-0.5">
          <span className="font-mono-tabular text-sm font-bold text-cyan-300">
            {formatCOP(selectedCombo.price)}
          </span>
          {selectedCombo.compareAtPrice && (
            <span className="font-mono-tabular text-[10px] text-zinc-400 line-through">
              {formatCOP(selectedCombo.compareAtPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Acciones de compra e información */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={onOpenCheckout}
          data-testid="floating-buy-btn"
          className="w-full min-h-[36px] px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-display text-[11px] font-extrabold flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
          <span>Ver combos</span>
        </button>
        <button
          type="button"
          onClick={onOpenDetails}
          className="w-full min-h-[28px] px-2 py-1 rounded-lg text-[10px] font-medium text-zinc-300 hover:text-white hover:bg-white/10 flex items-center justify-center gap-1 transition-colors cursor-pointer"
        >
          <Info className="w-3 h-3 shrink-0" />
          <span>INVIMA e ingr.</span>
        </button>
      </div>
    </aside>
  );
}
