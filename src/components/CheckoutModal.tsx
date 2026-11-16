import { useState, type FormEvent } from 'react';
import {
  Check,
  CheckCircle2,
  ExternalLink,
  Gift,
  Plus,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import {
  BATIDO_VERDE_ADDON,
  COMBO_OPTIONS,
  PRODUCT_INFO,
  STORE_BRAND,
  type ComboOption,
} from '../data/liveShopData';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
  calculateOrderTotal,
  formatCOP,
  getComboSavings,
  validateCheckoutForm,
  type CheckoutFormErrors,
  type CheckoutFormValues,
} from '../utils/checkout';
import { trackMetaPixelEvent } from '../utils/metaPixel';

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
  const [includeBatidoVerde, setIncludeBatidoVerde] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    combo: ComboOption;
    customer: CheckoutFormValues;
    includeBatidoVerde: boolean;
    totalPrice: number;
    whatsappUrl: string;
  } | null>(null);

  // Sincronizar tab inicial al abrir desde "INVIMA e ingr." o "Comprar"
  const [prevOpenKey, setPrevOpenKey] = useState<string>('');
  const currentOpenKey = `${isOpen}-${initialTab}`;
  if (currentOpenKey !== prevOpenKey) {
    setPrevOpenKey(currentOpenKey);
    if (isOpen) {
      setActiveTab(initialTab);
      setConfirmedOrder(null);
    }
  }

  if (!isOpen) return null;

  const selectedCombo =
    COMBO_OPTIONS.find((item) => item.id === selectedComboId) ?? COMBO_OPTIONS[2];
  const savings = getComboSavings(selectedCombo);
  const totalOrderPrice = calculateOrderTotal(selectedCombo, includeBatidoVerde);

  const handleFieldChange = (field: keyof CheckoutFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleToggleBatidoVerde = () => {
    const nextValue = !includeBatidoVerde;
    setIncludeBatidoVerde(nextValue);

    setConfirmedOrder((prev) => {
      if (!prev) return null;
      const nextTotal = calculateOrderTotal(prev.combo, nextValue);
      const nextMessage = buildWhatsAppOrderMessage(prev.combo, prev.customer, nextValue);
      return {
        ...prev,
        includeBatidoVerde: nextValue,
        totalPrice: nextTotal,
        whatsappUrl: buildWhatsAppUrl(STORE_BRAND.whatsappNumber, nextMessage),
      };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCheckoutForm(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const message = buildWhatsAppOrderMessage(selectedCombo, formValues, includeBatidoVerde);
    const whatsappUrl = buildWhatsAppUrl(STORE_BRAND.whatsappNumber, message);
    const totalPrice = calculateOrderTotal(selectedCombo, includeBatidoVerde);

    trackMetaPixelEvent('Lead', {
      content_name: includeBatidoVerde
        ? `${selectedCombo.title} + ${BATIDO_VERDE_ADDON.title}`
        : selectedCombo.title,
      currency: 'COP',
      value: totalPrice,
      num_items: includeBatidoVerde ? 2 : 1,
    });

    setConfirmedOrder({
      combo: selectedCombo,
      customer: { ...formValues },
      includeBatidoVerde,
      totalPrice,
      whatsappUrl,
    });
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

              {/* Listado completo del pedido */}
              <div
                data-testid="order-summary-list"
                className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10 space-y-2.5 text-xs"
              >
                <p className="font-display text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Listado de tu pedido
                </p>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-white">
                      1x Tyruss Full (500g) · {confirmedOrder.combo.title}
                    </span>
                    <span className="font-mono-tabular text-zinc-200 shrink-0">
                      {formatCOP(confirmedOrder.combo.price)}
                    </span>
                  </div>

                  {confirmedOrder.includeBatidoVerde && (
                    <div
                      data-testid="order-item-batido-verde"
                      className="flex items-center justify-between gap-2 text-emerald-300"
                    >
                      <span className="font-medium">1x {BATIDO_VERDE_ADDON.title}</span>
                      <span className="font-mono-tabular shrink-0">
                        +{formatCOP(BATIDO_VERDE_ADDON.price)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-400">Bonificación</span>
                    <span className="font-medium text-emerald-300">
                      {confirmedOrder.combo.bonusLabel.replace('+ ', '')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="font-semibold text-zinc-200">Total a pagar</span>
                  <span
                    data-testid="confirmed-total-price"
                    className="font-mono-tabular font-bold text-cyan-300 text-sm"
                  >
                    {formatCOP(confirmedOrder.totalPrice)} COP
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

              {/* Opción rápida para adicionar o quitar el Batido Verde */}
              <button
                type="button"
                role="checkbox"
                aria-checked={confirmedOrder.includeBatidoVerde}
                data-testid="confirm-batido-verde-toggle"
                onClick={handleToggleBatidoVerde}
                className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                  confirmedOrder.includeBatidoVerde
                    ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_0_1px_rgba(52,211,153,0.45)]'
                    : 'bg-zinc-900/90 border-white/15 hover:border-emerald-400/50'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                      confirmedOrder.includeBatidoVerde
                        ? 'bg-emerald-400 border-emerald-400 text-slate-950'
                        : 'bg-zinc-950 border-white/30 text-zinc-400'
                    }`}
                  >
                    {confirmedOrder.includeBatidoVerde ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-display text-xs font-bold text-white">
                        Adicionar {BATIDO_VERDE_ADDON.title}
                      </span>
                      <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300">
                        Oferta Live
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                      {BATIDO_VERDE_ADDON.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-mono-tabular text-xs font-bold text-emerald-300">
                    +{formatCOP(BATIDO_VERDE_ADDON.price)}
                  </p>
                  <p className="font-mono-tabular text-[10px] text-zinc-500 line-through">
                    {formatCOP(BATIDO_VERDE_ADDON.regularPrice)}
                  </p>
                </div>
              </button>

              <div className="flex flex-col gap-2 pt-1">
                <a
                  href={confirmedOrder.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="whatsapp-redirect-link"
                  onClick={() =>
                    trackMetaPixelEvent('Purchase', {
                      content_name: confirmedOrder.includeBatidoVerde
                        ? `${confirmedOrder.combo.title} + ${BATIDO_VERDE_ADDON.title}`
                        : confirmedOrder.combo.title,
                      currency: 'COP',
                      value: confirmedOrder.totalPrice,
                      num_items: confirmedOrder.includeBatidoVerde ? 2 : 1,
                    })
                  }
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

              {/* Adición opcional: Batido Verde */}
              <div className="space-y-1.5">
                <h3 className="font-display text-xs font-bold text-zinc-200">
                  Adición recomendada en el Live
                </h3>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={includeBatidoVerde}
                  data-testid="addon-batido-verde-toggle"
                  onClick={handleToggleBatidoVerde}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                    includeBatidoVerde
                      ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_0_1px_rgba(52,211,153,0.45)]'
                      : 'bg-zinc-900/90 border-white/10 hover:border-emerald-400/50'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                        includeBatidoVerde
                          ? 'bg-emerald-400 border-emerald-400 text-slate-950'
                          : 'bg-zinc-950 border-white/30 text-zinc-400'
                      }`}
                    >
                      {includeBatidoVerde ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-display text-[12.5px] font-bold text-white">
                          Agregar {BATIDO_VERDE_ADDON.title}
                        </span>
                        <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300">
                          Oferta Live
                        </span>
                      </div>
                      <p className="text-[10.5px] text-zinc-400 mt-0.5">
                        {BATIDO_VERDE_ADDON.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-mono-tabular text-xs font-bold text-emerald-300">
                      +{formatCOP(BATIDO_VERDE_ADDON.price)}
                    </p>
                    <p className="font-mono-tabular text-[10px] text-zinc-500 line-through">
                      {formatCOP(BATIDO_VERDE_ADDON.regularPrice)}
                    </p>
                  </div>
                </button>
              </div>

              {/* Resumen dinámico del combo + adición */}
              <div className="p-3 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] text-zinc-400">Total seleccionado</p>
                  <p className="font-display text-xs font-bold text-white truncate">
                    {selectedCombo.title}
                    {includeBatidoVerde ? ' + Batido Verde' : ''} {selectedCombo.bonusLabel}
                  </p>
                  {savings > 0 && (
                    <p className="text-[11px] text-emerald-300 font-medium">
                      Ahorras {formatCOP(savings + (includeBatidoVerde ? BATIDO_VERDE_ADDON.regularPrice - BATIDO_VERDE_ADDON.price : 0))} COP hoy
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span
                    data-testid="checkout-total-price"
                    className="font-mono-tabular text-base font-extrabold text-cyan-300"
                  >
                    {formatCOP(totalOrderPrice)} COP
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
