export interface ComboOption {
  id: string;
  units: number;
  title: string;
  subtitle: string;
  price: number;
  compareAtPrice?: number;
  bonusLabel: string;
  badge?: string;
  isVip?: boolean;
  isDefault?: boolean;
}

export interface LiveBroadcastScene {
  id: string;
  imageSrc: string;
  imageAlt: string;
  speaker: string;
  caption: string;
  highlight: string;
  bgClass: string;
}

export interface ChatMessage {
  id: string;
  author: string;
  city?: string;
  text: string;
  isHost?: boolean;
  isUser?: boolean;
  timestamp: string;
}

export const STORE_BRAND = {
  name: 'ColShopi Tienda',
  byline: 'By Leps Digital',
  hostName: 'Marié',
  hostRole: 'Asesora y Guía de Bienestar',
  whatsappNumber: '573235700653',
  whatsappDisplay: '323 570 0653',
  logoBlack: '/assets/aistudio/Nuevo_Logo_2026_8261c194.png',
  logoTransparent: '/assets/aistudio/Nuevo_Logo_2026_-_Transparente_438bdc8a.png',
  hostAvatar: '/assets/aistudio/Marie_01293c81.jpeg',
  liveVideoSrc: '/assets/aistudio/Video_del_Live_de_Mari__4bedd29f.mp4',
} as const;

export const PRODUCT_INFO = {
  name: 'Tyruss Full',
  weight: '500g',
  portions: '25 porciones aprox.',
  invima: 'RSA-0021928-2022',
  manufacturer: 'Vitaliah S.A.S. (Bogotá) para Unmerco (Medellín)',
  imageFrontTransparent: '/assets/aistudio/TyrussFull_png_1__c09ef71a.png',
  imageFrontStudio: '/assets/aistudio/TyrussFull_ok_2cf837a6.jpg',
  imageBackLabel: '/assets/aistudio/TyrussFull_png2_1__7751299b.png',
  shortSummary:
    'Alimento en polvo a base de crema de coco con clorofila, espirulina, chlorella, arveja, almendras, banano, aguacate, espinaca, fibra y omega 3.',
  highlights: [
    'Sin soya, sin maltodextrina y sin azúcares añadidos',
    'Con colágeno hidrolizado, proteína de suero y arveja',
    'Vitaminas C, E, B1, B2, B3, B6, B8, B12, A y D + minerales',
    'Registro Sanitario INVIMA: RSA-0021928-2022',
  ],
  preparationSteps: [
    'Mezcla 1 y 1/4 cucharadas dosificadoras (30g) en un vaso de leche o agua.',
    'Licúa o agita en tu shaker durante 1 minuto para lograr una textura cremosa.',
    'Disfrútalo frío con hielo o caliente. Ideal en tu rutina de la mañana.',
  ],
  appGift: {
    name: 'App TyroFem 30D',
    description:
      'Acceso 100% GRATIS a la guía interactiva de bienestar, hábitos diarios y acompañamiento durante 30 días.',
  },
} as const;

export const COMBO_OPTIONS: ComboOption[] = [
  {
    id: 'combo-1',
    units: 1,
    title: '1 Tarro (500g)',
    subtitle: '25 porciones · Envío nacional',
    price: 89900,
    bonusLabel: '+ App TyroFem Gratis',
  },
  {
    id: 'combo-2',
    units: 2,
    title: '2 Tarros (500g)',
    subtitle: '50 porciones · Ahorro en segundo tarro',
    price: 134850,
    compareAtPrice: 179800,
    bonusLabel: '+ App TyroFem Gratis',
  },
  {
    id: 'combo-3',
    units: 3,
    title: 'Pague 2 Lleve 3 Tarros',
    subtitle: '75 porciones · El más pedido en el Live',
    price: 179800,
    compareAtPrice: 269700,
    bonusLabel: '+ App TyroFem Gratis',
    badge: 'Más vendido',
    isDefault: true,
  },
  {
    id: 'combo-5',
    units: 5,
    title: 'Pague 3 Lleve 5 Tarros',
    subtitle: '125 porciones · Plan familiar completo',
    price: 269700,
    compareAtPrice: 449500,
    bonusLabel: '+ App TyroFem VIP Gratis',
    badge: 'Mejor ahorro VIP',
    isVip: true,
  },
];

export const BATIDO_VERDE_ADDON = {
  id: 'addon-batido-verde',
  title: 'Batido Verde (Linazamix)',
  subtitle: 'Limpieza digestiva natural antes de Tyruss Full · Oferta Live',
  price: 15000,
  regularPrice: 25000,
} as const;

export const GIFT_ADDON = {
  id: 'gift-locion-termica',
  title: 'Loción Térmica (Obsequio)',
  subtitle: 'Incluido gratis en tu pedido',
  badge: 'Obsequio',
  price: 0,
} as const;

export const LIVE_SCENES: LiveBroadcastScene[] = [
  {
    id: 'scene-host',
    imageSrc: STORE_BRAND.hostAvatar,
    imageAlt: 'Marié presentando Tyruss Full en ColShopi Tienda',
    speaker: 'Marié · En Vivo',
    caption:
      '¡Bienvenidas al Live! Hoy tienes el combo Pague 2 Lleve 3 Tarros de Tyruss Full con acceso gratis a TyroFem 30D.',
    highlight: 'Envíos a toda Colombia · Pago contra entrega',
    bgClass: 'object-cover object-top',
  },
  {
    id: 'scene-product',
    imageSrc: PRODUCT_INFO.imageFrontStudio,
    imageAlt: 'Tarro de Tyruss Full 500g en primer plano',
    speaker: 'Marié · Fórmula Natural',
    caption:
      'Sin soya, sin maltodextrina y sin azúcares añadidos. Con clorofila, espirulina, chlorella, crema de coco y omega 3.',
    highlight: 'Registro INVIMA RSA-0021928-2022',
    bgClass: 'object-contain scale-95 bg-black',
  },
  {
    id: 'scene-prep',
    imageSrc: PRODUCT_INFO.imageBackLabel,
    imageAlt: 'Información nutricional y preparación de Tyruss Full',
    speaker: 'Marié · Preparación Fácil',
    caption:
      'Solo mezclas 1 y 1/4 cucharadas en agua o tu leche favorita por 1 minuto. ¡Delicioso frío o caliente!',
    highlight: '25 porciones por cada tarro de 500g',
    bgClass: 'object-contain scale-95 bg-zinc-950',
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'init-1',
    author: 'Marié',
    text: '¡Hola a todas! Hoy tenemos combos especiales de Tyruss Full + App TyroFem 30D y Loción Térmica de obsequio.',
    isHost: true,
    timestamp: 'Ahora',
  },
  {
    id: 'init-2',
    author: 'Camila R.',
    city: 'Medellín',
    text: 'Yo ya voy por mi segundo tarro y la energía en las mañanas se siente muchísimo, además me desinflamó súper rápido.',
    timestamp: 'Ahora',
  },
  {
    id: 'init-3',
    author: 'Marié',
    text: '¡Qué alegría leerte Camila! Cuando se toma constante cada mañana los resultados en energía y bienestar se notan muchísimo.',
    isHost: true,
    timestamp: 'Ahora',
  },
];

export const SIMULATED_CHAT_QUEUE: Omit<ChatMessage, 'id' | 'timestamp'>[] = [
  {
    author: 'Valentina M.',
    city: 'Bogotá',
    text: '¿Tienen pago contra entrega en Bogotá para el combo Pague 2 Lleve 3?',
  },
  {
    author: 'Marié',
    text: '¡Sí Valentina! Enviamos con pago contra entrega a Bogotá, Medellín, Cali, Barranquilla y casi todo el país.',
    isHost: true,
  },
  {
    author: 'Andrea Ospina',
    city: 'Cali',
    text: 'Chicas súper recomendado, llevo 3 semanas tomándolo con el Batido Verde y bajé la pesadez abdominal, me siento más liviana todo el día.',
  },
  {
    author: 'Marié',
    text: '¡Gracias por compartir tu experiencia Andrea! Combinar Tyruss Full con el Batido Verde potencia muchísimo la digestión.',
    isHost: true,
  },
  {
    author: 'Paola Andrea',
    city: 'Manizales',
    text: '¿Tiene azúcar añadida o soya? Es que me cuido bastante.',
  },
  {
    author: 'Marié',
    text: 'Cero soya, cero maltodextrina y sin azúcares añadidos Paola. Tiene espirulina, clorofila, crema de coco y omega 3.',
    isHost: true,
  },
  {
    author: 'Marcela Gómez',
    city: 'Barranquilla',
    text: 'A mí me llegó en 2 días a Barranquilla súper bien empacado, el sabor es delicioso y la App TyroFem 30D me ha ayudado un montón con mis comidas.',
  },
  {
    author: 'Marié',
    text: '¡Me encanta saber que ya lo estás disfrutando Marcela! La App TyroFem 30D es el complemento ideal para lograr resultados reales.',
    isHost: true,
  },
  {
    author: 'Natalia G.',
    city: 'Bucaramanga',
    text: 'Acabo de pedir el Pague 2 Lleve 3, ¿también me llega la Loción Térmica de obsequio?',
  },
  {
    author: 'Marié',
    text: '¡Sí Natalia! Todos los combos del Live incluyen la Loción Térmica de obsequio y acceso gratis a la App TyroFem 30D.',
    isHost: true,
  },
  {
    author: 'Juliana Torres',
    city: 'Pereira',
    text: 'Yo pedí el de 5 tarros con mi mamá el mes pasado y las dos dormimos mejor y rendimos muchísimo más en el trabajo, hoy repetimos pedido.',
  },
  {
    author: 'Marié',
    text: '¡Qué testimonio tan lindo Juliana! Gracias por confiar de nuevo en ColShopi Tienda, el combo VIP es el favorito para compartir en familia.',
    isHost: true,
  },
  {
    author: 'Sofía Castro',
    city: 'Cartagena',
    text: 'Al principio dudé pero al ver el registro INVIMA RSA-0021928-2022 me animé, ya llevo 1 mes y la ansiedad por dulce me bajó muchísimo.',
  },
  {
    author: 'Marié',
    text: '¡Así es Sofía! Contar con registro INVIMA da total tranquilidad y nos alegra muchísimo que ya sientas ese cambio en tus antojos.',
    isHost: true,
  },
  {
    author: 'Laura Restrepo',
    city: 'Envigado',
    text: '¿Puedo pagar en efectivo cuando llegue el domiciliario?',
  },
  {
    author: 'Marié',
    text: '¡Claro que sí Laura! Puedes pagar en efectivo contra entrega apenas recibas tu pedido en la puerta de tu casa.',
    isHost: true,
  },
  {
    author: 'Carolina Vélez',
    city: 'Medellín',
    text: 'Totalmente garantizado, yo lo preparo frío con leche de almendras después de entrenar y cero cansancio en la tarde.',
  },
  {
    author: 'Marié',
    text: '¡Súper tip Carolina! Frío con leche de almendras queda espectacular y te mantiene con energía limpia toda la tarde.',
    isHost: true,
  },
];
