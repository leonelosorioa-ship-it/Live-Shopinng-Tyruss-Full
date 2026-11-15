import { useState, type FormEvent } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Gift,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import {
  COMBO_OPTIONS,
  PRODUCT_INFO,
  STORE_BRAND,
  type ComboOption,
} from '../data/liveShopData';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  formatCOP,
  getComboSavings,
  validateCheckoutForm,
  type CheckoutFormErrors,
  type CheckoutFormValues,
} from '../utils/checkout';

export type ModalTab = 'checkout' | 'details';

interface CheckoutModalProps {
  isOpen: boolean;
  initialTab?: ModalTab;
  selectedComboId: string;
  onSelectCombo: (comboId: string) => void;
  onClose: () => void;
}

export function CheckoutModal({
  isOpen,
  initialTab = 'checkout',
  selectedComboId,
  onSelectCombo,
  onClose,
}: CheckoutModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>(initialTab);
  const [formValues, setFormValues] = useState<CheckoutFormValues>({
    fullName: '',
    phone: '',
    city: '',
    address: '',
  });
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [confirmedOrder, setConfirmedOrder] = useState<{
    combo: ComboOption;
    customer: CheckoutFormValues;
    message: string;
    whatsappUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Sincronizar tab inicial al abrir desde "INVIMA e ingr." o "Comprar"
  const [prevOpenKey, setPrevOpenKey] = useState<string>('');
  const currentOpenKey = `${isOpen}-${initialTab}`;
  if (currentOpenKey !== prevOpenKey) {
    setPrevOpenKey(currentOpenKey);
    if (isOpen) {
      setActiveTab(initialTab);
      setConfirmedOrder(null);
      setCopied(false);
    }
  }

  if (!isOpen) return null;

  const selectedCombo =
    COMBO_OPTIONS.find((item) => item.id === selectedComboId) ?? COMBO_OPTIONS[2];
  const savings = getComboSavings(selectedCombo);

  const handleFieldChange = (field: keyof CheckoutFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const message = buildWhatsAppOrderMessage(selectedCombo, formValues);
    const whatsappUrl = buildWhatsAppUrl(STORE_BRAND.whatsappNumber, message);
    setConfirmedOrder({
      combo: selectedCombo,
      customer: { ...formValues },
      message,
      whatsappUrl,
    });
  };

  const handleCopyMessage = async () => {
    if (!confirmedOrder) return;
    try {
      await navigator.clipboard.writeText(confirmedOrder.message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="absolute inset-0 z-40 flex items-end justify-center bg-black/75 backdrop-blur-sm animate-[fadeIn_160ms_ease-out]"
    >
      <div className="w-full max-h-[90dvh] rounded-t-3xl bg-zinc-950 border-t border-x border-white/15 shadow-2xl flex flex-col overflow-hidden">
        {/* Cabecera fija del modal */}
        <div className="px-4 pt-3 pb-2.5 border-b border-white/10 shrink-0">
          <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-3" aria-hidden="true" />
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={PRODUCT_INFO.imageFrontTransparent}
                alt={PRODUCT_INFO.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl bg-white/5 p-1 object-contain shrink-0"
              />
              <div className="min-w-0">
                <h2
                  id="checkout-modal-title"
                  className="font-display text-sm font-bold text-white truncate"
                >
                  {PRODUCT_INFO.name} ({PRODUCT_INFO.weight})
                </h2>
                <p className="text-[11px] text-emerald-300 truncate">
                  {STORE_BRAND.name} · Pago contra entrega
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar ventana de compra"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-zinc-200 hover:bg-white/20 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navegación por pestañas */}
          {!confirmedOrder && (
            <div
              role="tablist"
              aria-label="Opciones del producto"
              className="mt-3 grid grid-cols-2 gap-1 p-1 rounded-xl bg-zinc-900 border border-white/10"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'checkout'}
                onClick={() => setActiveTab('checkout')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'checkout'
                    ? 'bg-emerald-400 text-slate-950 font-bold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                Combos y Pedido
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'details'}
                onClick={() => setActiveTab('details')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'details'
                    ? 'bg-emerald-400 text-slate-950 font-bold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                Ingredientes e INVIMA
              </button>
            </div>
          )}
        </div>

        {/* Contenido desplazable */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {confirmedOrder ? (
            /* Pantalla de confirmación lista para WhatsApp */
            <div data-testid="order-confirmation" className="space-y-4 pb-2">
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-400/30 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display text-sm font-bold text-white">
                    ¡Tu pedido está listo para enviar a Marié!
                  </h3>
                  <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
                    Toca el botón verde para abrir WhatsApp con tu orden completa y activar tu{' '}
                    <span className="font-semibold text-white">
                      {confirmedOrder.combo.isVip ? 'App TyroFem 30D VIP' : 'App TyroFem 30D'}
                    </span>
                    .
                  </p>
                </div>
              </div>

              {/* Resumen del pedido */}
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Paquete</span>
                  <span className="font-semibold text-white">{confirmedOrder.combo.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Total a pagar</span>
                  <span className="font-mono-tabular font-bold text-cyan-300 text-sm">
                    {formatCOP(confirmedOrder.combo.price)} COP
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Bonificación</span>
                  <span className="font-medium text-emerald-300">
                    {confirmedOrder.combo.bonusLabel.replace('+ ', '')}
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 space-y-1 text-zinc-300">
                  <p>
                    <strong className="text-white">Cliente:</strong> {confirmedOrder.customer.fullName}
                  </p>
                  <p>
                    <strong className="text-white">WhatsApp:</strong> {confirmedOrder.customer.phone}
                  </p>
                  <p>
                    <strong className="text-white">Destino:</strong> {confirmedOrder.customer.city} —{' '}
                    {confirmedOrder.customer.address}
                  </p>
                </div>
              </div>

              {/* Vista previa del mensaje formateado */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-zinc-400">
                    Mensaje preparado para WhatsApp
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-300 hover:text-cyan-200 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar texto'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-black/70 border border-white/10 text-[11px] text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed max-h-40 overflow-y-auto">
                  {confirmedOrder.message}
                </pre>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <a
                  href={confirmedOrder.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="whatsapp-redirect-link"
                  className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#25D366] text-slate-950 font-display text-[13px] font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:brightness-105 active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  <span>Enviar Pedido por WhatsApp</span>
                  <ExternalLink className="w-4 h-4 shrink-0" />
                </a>
                <p className="text-center text-[11px] text-zinc-400">
                  Línea oficial ColShopi Tienda: {STORE_BRAND.whatsappDisplay}
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmedOrder(null)}
                  className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  Modificar datos o cambiar combo
                </button>
              </div>
            </div>
          ) : activeTab === 'details' ? (
            /* Pestaña de Ingredientes, Preparación e INVIMA */
            <div className="space-y-4 pb-2">
              <div className="rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 p-3 flex items-center gap-3">
                <img
                  src={PRODUCT_INFO.imageBackLabel}
                  alt="Etiqueta nutricional y preparación Tyruss Full"
                  referrerPolicy="no-referrer"
                  className="w-24 h-28 object-contain rounded-xl bg-white/5 shrink-0"
                />
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-300">
                    INVIMA: {PRODUCT_INFO.invima}
                  </span>
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    {PRODUCT_INFO.shortSummary}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xs font-bold text-white">
                  Beneficios de la fórmula
                </h3>
                <ul className="space-y-1.5">
                  {PRODUCT_INFO.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-zinc-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xs font-bold text-white">
                  Preparación en 3 pasos
                </h3>
                <ol className="space-y-2">
                  {PRODUCT_INFO.preparationSteps.map((step, idx) => (
                    <li
                      key={step}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-200"
                    >
                      <span className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 font-mono-tabular font-bold text-[11px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-cyan-950/70 border border-emerald-400/30 flex items-start gap-2.5">
                <Gift className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-display text-xs font-bold text-white">
                    Regalo incluido: {PRODUCT_INFO.appGift.name}
                  </p>
                  <p className="text-[11px] text-zinc-200 mt-0.5 leading-relaxed">
                    {PRODUCT_INFO.appGift.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('checkout')}
                className="w-full min-h-[44px] rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-display text-xs font-extrabold cursor-pointer"
              >
                Elegir mi Combo ahora
              </button>
            </div>
          ) : (
            /* Pestaña principal: Selector de Combos + Formulario */
            <form onSubmit={handleSubmit} noValidate className="space-y-4 pb-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xs font-bold text-zinc-200">
                    1. Selecciona tu Combo Oficial
                  </h3>
                  <span className="text-[11px] text-cyan-300 font-medium">
                    Envío a toda Colombia
                  </span>
                </div>

                <div className="space-y-2" role="radiogroup" aria-label="Combos de Tyruss Full">
                  {COMBO_OPTIONS.map((combo) => {
                    const isSelected = combo.id === selectedCombo.id;
                    return (
                      <button
                        key={combo.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        data-testid={`combo-option-${combo.id}`}
                        onClick={() => onSelectCombo(combo.id)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-emerald-950/55 border-emerald-400 shadow-[0_0_0_1px_rgba(52,211,153,0.45)]'
                            : 'bg-zinc-900/90 border-white/10 hover:border-white/25'
                        }`}
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-display text-[13px] font-bold text-white">
                              {combo.title}
                            </span>
                            {combo.badge && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  combo.isVip
                                    ? 'bg-amber-400 text-slate-950'
                                    : 'bg-rose-500 text-white'
                                }`}
                              >
                                {combo.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-emerald-300 font-medium">
                            {combo.bonusLabel}
                          </p>
                          <p className="text-[10px] text-zinc-400">{combo.subtitle}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-mono-tabular text-sm font-bold text-white">
                            {formatCOP(combo.price)}
                          </p>
                          {combo.compareAtPrice && (
                            <p className="font-mono-tabular text-[10px] text-zinc-500 line-through">
                              {formatCOP(combo.compareAtPrice)}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resumen dinámico del combo */}
              <div className="p-3 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] text-zinc-400">Total seleccionado</p>
                  <p className="font-display text-xs font-bold text-white truncate">
                    {selectedCombo.title} {selectedCombo.bonusLabel}
                  </p>
                  {savings > 0 && (
                    <p className="text-[11px] text-emerald-300 font-medium">
                      Ahorras {formatCOP(savings)} COP hoy
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span
                    data-testid="checkout-total-price"
                    className="font-mono-tabular text-base font-extrabold text-cyan-300"
                  >
                    {formatCOP(selectedCombo.price)} COP
                  </span>
                </div>
              </div>

              {/* Formulario de datos de envío */}
              <div className="space-y-3">
                <h3 className="font-display text-xs font-bold text-zinc-200">
                  2. Tus datos para el envío contra entrega
                </h3>

                <div>
                  <label htmlFor="checkout-fullname" className="block text-xs font-medium text-zinc-300 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    id="checkout-fullname"
                    type="text"
                    value={formValues.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    placeholder="Ej. Laura Gómez"
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400"
                  />
                  {errors.fullName && (
                    <p role="alert" className="mt-1 text-[11px] text-rose-400">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="checkout-phone" className="block text-xs font-medium text-zinc-300 mb-1">
                      Celular / WhatsApp
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      inputMode="tel"
                      value={formValues.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="Ej. 300 123 4567"
                      className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400"
                    />
                    {errors.phone && (
                      <p role="alert" className="mt-1 text-[11px] text-rose-400">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="checkout-city" className="block text-xs font-medium text-zinc-300 mb-1">
                      Ciudad / Municipio
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      value={formValues.city}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      placeholder="Ej. Medellín"
                      className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400"
                    />
                    {errors.city && (
                      <p role="alert" className="mt-1 text-[11px] text-rose-400">
                        {errors.city}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="checkout-address" className="block text-xs font-medium text-zinc-300 mb-1">
                    Dirección y Barrio
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={formValues.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    placeholder="Ej. Cra 43A # 1-50, Barrio El Poblado"
                    className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400"
                  />
                  {errors.address && (
                    <p role="alert" className="mt-1 text-[11px] text-rose-400">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                <span className="inline-flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  Despacho nacional rápido
                </span>
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  Incluye App TyroFem 30D
                </span>
              </div>

              <button
                type="submit"
                data-testid="confirm-order-btn"
                className="w-full min-h-[48px] px-4 py-3 rounded-2xl bg-[#25D366] text-slate-950 font-display text-sm font-extrabold flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Confirmar Pedido por WhatsApp</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
