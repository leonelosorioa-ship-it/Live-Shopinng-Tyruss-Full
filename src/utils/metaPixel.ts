export const META_PIXEL_ID = '249723086883097';

export type MetaPixelStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'InitiateCheckout'
  | 'Lead'
  | 'Purchase';

export interface MetaPixelParams {
  content_name?: string;
  content_category?: string;
  currency?: string;
  value?: number;
  num_items?: number;
}

type FbqFunction = (
  command: 'init' | 'track' | 'trackCustom',
  eventOrId: string,
  params?: MetaPixelParams
) => void;

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

/**
 * Envía eventos estándar al Pixel de Meta sin romper el flujo si el usuario usa bloqueadores.
 */
export function trackMetaPixelEvent(
  eventName: MetaPixelStandardEvent,
  params?: MetaPixelParams,
  fbqOverride?: FbqFunction | null
): boolean {
  const fbqFn =
    fbqOverride !== undefined
      ? fbqOverride
      : typeof window !== 'undefined' && typeof window.fbq === 'function'
        ? window.fbq
        : null;

  if (!fbqFn) return false;

  try {
    if (params && Object.keys(params).length > 0) {
      fbqFn('track', eventName, params);
    } else {
      fbqFn('track', eventName);
    }
    return true;
  } catch {
    return false;
  }
}
