import { Clock, Eye, Heart, Volume2, VolumeX } from 'lucide-react';
import { STORE_BRAND } from '../data/liveShopData';
import { formatLikesCount } from '../utils/checkout';
import { formatCountdown } from '../utils/liveSession';

interface LiveHeaderProps {
  viewerCount: number;
  likesCount: number;
  isMuted: boolean;
  liveEnded?: boolean;
  remainingSeconds?: number | null;
  onToggleMute: () => void;
  onLike: () => void;
}

export function LiveHeader({
  viewerCount,
  likesCount,
  isMuted,
  liveEnded = false,
  remainingSeconds = null,
  onToggleMute,
  onLike,
}: LiveHeaderProps) {
  const isUrgent = remainingSeconds !== null && remainingSeconds <= 15;
  return (
    <header className="relative z-20 px-3 pt-2 pb-1.5 bg-gradient-to-b from-slate-900/32 via-slate-900/10 to-transparent space-y-1.5">
      {/* Fila 1: Logo + ColShopi Tienda + LIVE SHOP + Temporizador + Mute */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0 px-2 py-1 rounded-full bg-white/88 backdrop-blur-md border border-white/75 shadow-[0_2px_10px_rgba(15,23,42,0.1)]">
          <div className="shrink-0 w-7 h-7 rounded-full ring-1 ring-emerald-600/30 bg-white overflow-hidden">
            <img
              src={STORE_BRAND.logoBlack}
              alt={`${STORE_BRAND.name} logo`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0 flex items-center gap-1.5 pr-0.5">
            <h1 className="font-display text-[12px] sm:text-[12.5px] font-bold tracking-tight text-slate-900 whitespace-nowrap">
              {STORE_BRAND.name}
            </h1>
            {liveEnded ? (
              <span
                data-testid="live-shop-badge"
                className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full text-[8.5px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 whitespace-nowrap"
              >
                PROMO ACTIVA
              </span>
            ) : (
              <span
                data-testid="live-shop-badge"
                className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold tracking-wider uppercase bg-rose-600 text-white whitespace-nowrap"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/95 shrink-0" aria-hidden="true" />
                LIVE SHOP
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!liveEnded && remainingSeconds !== null && (
            <div
              data-testid="live-countdown-timer"
              title={`Termina en ${formatCountdown(remainingSeconds)}`}
              aria-label={`El live termina en ${formatCountdown(remainingSeconds)}`}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-md border text-[10.5px] font-semibold shadow-xs transition-colors ${
                isUrgent
                  ? 'bg-rose-50/95 border-rose-300 text-rose-800'
                  : 'bg-white/88 border-white/75 text-slate-800'
              }`}
            >
              <Clock
                className={`w-3 h-3 shrink-0 ${isUrgent ? 'text-rose-600' : 'text-emerald-700'}`}
                aria-hidden="true"
              />
              <span className="font-mono-tabular font-bold whitespace-nowrap">
                {formatCountdown(remainingSeconds)}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar sonido del Live' : 'Silenciar sonido del Live'}
            className="inline-flex items-center justify-center min-w-[32px] min-h-[32px] rounded-full bg-white/88 backdrop-blur-md border border-white/75 text-slate-700 hover:bg-white active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-600" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            )}
          </button>
        </div>
      </div>

      {/* Fila 2: Marié + By Leps Digital a la izquierda, Me gusta y Espectadores a la derecha */}
      <div className="flex items-center justify-between gap-2">
        <p className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/82 backdrop-blur-md border border-white/70 text-[10.5px] text-slate-700 font-medium truncate shadow-xs">
          {STORE_BRAND.hostName} · {STORE_BRAND.byline}
        </p>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onLike}
            aria-label={`Dar Me gusta, actualmente ${formatLikesCount(likesCount)} Me gusta`}
            className="inline-flex items-center gap-1 min-h-[28px] px-2 py-0.5 rounded-full bg-white/88 backdrop-blur-md border border-white/75 text-[10.5px] font-medium text-slate-800 hover:bg-white active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 shrink-0" />
            <span className="font-mono-tabular whitespace-nowrap">
              {formatLikesCount(likesCount)} Me gusta
            </span>
          </button>

          <div
            aria-label={`${viewerCount} espectadores en línea`}
            className="inline-flex items-center gap-1.5 min-h-[28px] px-2 py-0.5 rounded-full bg-white/88 backdrop-blur-md border border-white/75 text-[10.5px] font-semibold text-slate-800 shadow-xs"
          >
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
            </span>
            <Eye className="w-3 h-3 text-slate-500 shrink-0" aria-hidden="true" />
            <span className="font-mono-tabular whitespace-nowrap">{viewerCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
