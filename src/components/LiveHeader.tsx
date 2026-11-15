import { Eye, Heart, Volume2, VolumeX } from 'lucide-react';
import { STORE_BRAND } from '../data/liveShopData';
import { formatLikesCount } from '../utils/checkout';

interface LiveHeaderProps {
  viewerCount: number;
  likesCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onLike: () => void;
}

export function LiveHeader({
  viewerCount,
  likesCount,
  isMuted,
  onToggleMute,
  onLike,
}: LiveHeaderProps) {
  return (
    <header className="relative z-20 px-3 pt-2.5 pb-3 bg-gradient-to-b from-black/90 via-black/65 to-transparent space-y-2">
      {/* Fila 1: Logo + Nombre completo ColShopi Tienda + LIVE SHOP + Compartir / Pantalla completa / Mute */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 w-9 h-9 rounded-full ring-2 ring-cyan-400/80 bg-black overflow-hidden shadow-md">
            <img
              src={STORE_BRAND.logoBlack}
              alt={`${STORE_BRAND.name} logo`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0 flex items-center gap-1.5 flex-wrap">
            <h1 className="font-display text-[13.5px] font-bold tracking-tight text-white whitespace-nowrap">
              {STORE_BRAND.name}
            </h1>
            <span
              data-testid="live-shop-badge"
              className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9.5px] font-extrabold tracking-wider uppercase bg-gradient-to-r from-rose-600 to-fuchsia-600 text-white shadow-[0_0_12px_rgba(225,29,72,0.75)] whitespace-nowrap animate-live-pulse"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/95 shrink-0" aria-hidden="true" />
              LIVE SHOP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar sonido del Live' : 'Silenciar sonido del Live'}
            className="inline-flex items-center justify-center min-w-[34px] min-h-[34px] rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-zinc-300" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
            )}
          </button>
        </div>
      </div>

      {/* Fila 2: Marié + By Leps Digital a la izquierda, Me gusta y Espectadores a la derecha */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-cyan-200/95 font-medium truncate">
          {STORE_BRAND.hostName} · {STORE_BRAND.byline}
        </p>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onLike}
            aria-label={`Dar Me gusta, actualmente ${formatLikesCount(likesCount)} Me gusta`}
            className="inline-flex items-center gap-1 min-h-[30px] px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
          >
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400 shrink-0" />
            <span className="font-mono-tabular whitespace-nowrap">
              {formatLikesCount(likesCount)} Me gusta
            </span>
          </button>

          <div
            aria-label={`${viewerCount} espectadores en línea`}
            className="inline-flex items-center gap-1.5 min-h-[30px] px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white"
          >
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-85" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <Eye className="w-3 h-3 text-white/80 shrink-0" aria-hidden="true" />
            <span className="font-mono-tabular whitespace-nowrap">{viewerCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
