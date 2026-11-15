export interface SocialShareLinks {
  whatsapp: string;
  facebook: string;
  x: string;
  telegram: string;
}

export const SHARE_COPY = {
  title: 'ColShopi Tienda Live Shop — Tyruss Full',
  message:
    '¡Estoy viendo el Live de Marié en ColShopi Tienda! Tyruss Full 500g con pago contra entrega en Colombia + App TyroFem 30D gratis.',
} as const;

/**
 * Construye los enlaces directos para compartir el Live en redes sociales.
 */
export function buildSocialShareLinks(targetUrl: string): SocialShareLinks {
  const safeUrl = targetUrl.trim() || 'https://colshopi.co';
  const encodedUrl = encodeURIComponent(safeUrl);
  const encodedText = encodeURIComponent(SHARE_COPY.message);
  const encodedWhatsappText = encodeURIComponent(`${SHARE_COPY.message} ${safeUrl}`);

  return {
    whatsapp: `https://wa.me/?text=${encodedWhatsappText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    x: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
  };
}
