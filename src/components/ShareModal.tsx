import { useState } from 'react';
import { Check, Copy, Share2, X } from 'lucide-react';
import { buildSocialShareLinks, SHARE_COPY } from '../utils/share';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl =
    typeof window !== 'undefined' ? window.location.href : 'https://colshopi.co';
  const links = buildSocialShareLinks(currentUrl);
  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = currentUrl;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (ok) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2200);
          return;
        }
      } catch {
        // Ignorar si tampoco está permitido copiar programáticamente
      }
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title: SHARE_COPY.title,
        text: SHARE_COPY.message,
        url: currentUrl,
      });
    } catch {
      // Usuario canceló o el navegador bloqueó el selector nativo
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      data-testid="share-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="absolute inset-0 z-40 flex items-end justify-center bg-black/75 backdrop-blur-sm"
    >
      <div className="w-full rounded-t-3xl bg-zinc-950 border-t border-x border-white/15 p-4 pb-6 shadow-2xl space-y-4">
        <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto" aria-hidden="true" />

        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 id="share-modal-title" className="font-display text-sm font-bold text-white">
              Compartir este Live
            </h2>
            <p className="text-[11px] text-zinc-400">
              Invita a tus amigas a ver a Marié en ColShopi Tienda
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar opciones para compartir"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-zinc-200 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Botones de redes sociales (sin mostrar la URL en pantalla) */}
        <div className="grid grid-cols-4 gap-2">
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="share-whatsapp-link"
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-zinc-900 border border-white/10 hover:border-[#25D366]/60 transition-colors"
          >
            <span className="w-10 h-10 rounded-full bg-[#25D366] text-slate-950 flex items-center justify-center font-bold text-xs">
              WA
            </span>
            <span className="text-[11px] font-medium text-zinc-200">WhatsApp</span>
          </a>

          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="share-facebook-link"
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-zinc-900 border border-white/10 hover:border-[#1877F2]/60 transition-colors"
          >
            <span className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-sm">
              f
            </span>
            <span className="text-[11px] font-medium text-zinc-200">Facebook</span>
          </a>

          <a
            href={links.x}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="share-x-link"
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-zinc-900 border border-white/10 hover:border-white/40 transition-colors"
          >
            <span className="w-10 h-10 rounded-full bg-zinc-800 border border-white/20 text-white flex items-center justify-center font-bold text-sm">
              X
            </span>
            <span className="text-[11px] font-medium text-zinc-200">X</span>
          </a>

          <a
            href={links.telegram}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="share-telegram-link"
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-zinc-900 border border-white/10 hover:border-[#229ED9]/60 transition-colors"
          >
            <span className="w-10 h-10 rounded-full bg-[#229ED9] text-white flex items-center justify-center font-bold text-xs">
              TG
            </span>
            <span className="text-[11px] font-medium text-zinc-200">Telegram</span>
          </a>
        </div>

        {/* Acciones rápidas sin exponer URL */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            data-testid="copy-share-link-btn"
            className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-xs font-semibold text-white hover:bg-white/15 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">¡Enlace copiado para compartir!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-cyan-300" />
                <span>Copiar enlace del Live</span>
              </>
            )}
          </button>

          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-display text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir con otra app</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
