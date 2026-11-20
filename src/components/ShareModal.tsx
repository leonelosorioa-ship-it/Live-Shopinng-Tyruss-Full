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
      className="absolute inset-0 z-40 flex items-end justify-center bg-slate-900/35 backdrop-blur-[3px]"
    >
      <div className="w-full rounded-t-3xl bg-white border-t border-x border-slate-200/90 p-4 pb-6 shadow-[0_-12px_36px_rgba(15,23,42,0.14)] space-y-4 text-slate-800">
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" aria-hidden="true" />

        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 id="share-modal-title" className="font-display text-sm font-bold text-slate-900">
              Compartir este Live
            </h2>
            <p className="text-[11px] text-slate-500">
              Invita a tus amigas a ver a Marié en ColShopi Tienda
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar opciones para compartir"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
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
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-400 transition-colors"
          >
            <span className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              WA
            </span>
            <span className="text-[11px] font-medium text-slate-700">WhatsApp</span>
          </a>

          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="share-facebook-link"
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-400 transition-colors"
          >
            <span className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-sm">
              f
            </span>
            <span className="text-[11px] font-medium text-slate-700">Facebook</span>
          </a>

          <a
            href={links.x}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="share-x-link"
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-400 transition-colors"
          >
            <span className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
              X
            </span>
            <span className="text-[11px] font-medium text-slate-700">X</span>
          </a>

          <a
            href={links.telegram}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="share-telegram-link"
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-400 transition-colors"
          >
            <span className="w-10 h-10 rounded-full bg-[#229ED9] text-white flex items-center justify-center font-bold text-xs">
              TG
            </span>
            <span className="text-[11px] font-medium text-slate-700">Telegram</span>
          </a>
        </div>

        {/* Acciones rápidas sin exponer URL */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            data-testid="copy-share-link-btn"
            className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-200/80 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                <span className="text-emerald-800">¡Enlace copiado para compartir!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-emerald-700" />
                <span>Copiar enlace del Live</span>
              </>
            )}
          </button>

          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-display text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
