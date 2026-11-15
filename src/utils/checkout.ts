import type { ComboOption } from '../data/liveShopData';

export interface CheckoutFormValues {
  fullName: string;
  phone: string;
  city: string;
  address: string;
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormValues, string>>;

/**
 * Formatea un valor numérico en pesos colombianos (COP).
 */
export function formatCOP(amount: number): string {
  const rounded = Math.round(amount);
  return `$${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

/**
 * Formatea el contador de "Me gusta" en formato compacto legible (ej. 4.8K).
 */
export function formatLikesCount(count: number): string {
  if (count >= 1000) {
    const thousands = count / 1000;
    const formatted = thousands.toFixed(1).replace(/\.0$/, '');
    return `${formatted}K`;
  }
  return String(count);
}

/**
 * Calcula el ahorro en COP frente al precio comparativo cuando aplica.
 */
export function getComboSavings(combo: ComboOption): number {
  if (!combo.compareAtPrice || combo.compareAtPrice <= combo.price) {
    return 0;
  }
  return combo.compareAtPrice - combo.price;
}

/**
 * Valida los campos obligatorios del formulario de checkout contra entrega.
 */
export function validateCheckoutForm(values: CheckoutFormValues): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};

  if (!values.fullName.trim() || values.fullName.trim().length < 3) {
    errors.fullName = 'Ingresa tu nombre completo (mínimo 3 caracteres).';
  }

  const normalizedDigits = values.phone.replace(/\D/g, '');
  if (!normalizedDigits || normalizedDigits.length < 10) {
    errors.phone = 'Ingresa un celular o WhatsApp válido de 10 dígitos.';
  }

  if (!values.city.trim() || values.city.trim().length < 2) {
    errors.city = 'Indica tu ciudad o municipio de entrega.';
  }

  if (!values.address.trim() || values.address.trim().length < 6) {
    errors.address = 'Ingresa tu dirección completa y barrio.';
  }

  return errors;
}

/**
 * Construye el mensaje estructurado con negritas y emojis para WhatsApp.
 */
export function buildWhatsAppOrderMessage(
  combo: ComboOption,
  customer: CheckoutFormValues
): string {
  const bonusText = combo.isVip
    ? 'Acceso 100% GRATIS a App TyroFem 30D VIP'
    : 'Acceso 100% GRATIS a App TyroFem 30D';

  const lines = [
    '🌿 *NUEVO PEDIDO — COLSHOPI TIENDA LIVE SHOP* 🌿',
    '',
    '👋 ¡Hola Marié! Quiero confirmar mi pedido del Live:',
    '',
    `📦 *Producto:* Tyruss Full (500g) — ${combo.title}`,
    `💰 *Valor Total:* ${formatCOP(combo.price)} COP`,
    `🎁 *Bonificación:* ${bonusText}`,
    '🚚 *Modalidad:* Envío nacional / Pago contra entrega',
    '',
    '👤 *DATOS DE ENTREGA:*',
    `• *Nombre:* ${customer.fullName.trim()}`,
    `• *WhatsApp:* ${customer.phone.trim()}`,
    `• *Ciudad:* ${customer.city.trim()}`,
    `• *Dirección y Barrio:* ${customer.address.trim()}`,
    '',
    '✅ ¡Quedo atento(a) para confirmar el despacho!',
  ];

  return lines.join('\n');
}

/**
 * Genera el enlace oficial de API de WhatsApp con el mensaje codificado.
 */
export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
