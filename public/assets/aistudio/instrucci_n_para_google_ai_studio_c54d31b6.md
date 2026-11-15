# Prompt / Instrucción Maestra para Google AI Studio (Live Shopping App)

Actúa como un Desarrollador Frontend Senior experto en UI/UX móvil, Tailwind CSS y arquitecturas de e-commerce moderno. 

Tu objetivo es diseñar y generar el código fuente completo de una aplicación web interactiva en un **único archivo `.html`** (que incluya HTML, Tailwind CSS vía CDN y JavaScript nativo) que replique exactamente el modelo de **Live Shopping simulado** de plataformas como Live-On, pero especializado para el comercio de productos de bienestar y salud en Colombia.

---

## 📋 Parámetros de Negocio y Marca
1. **Nombre de la Tienda:** ColShopi Tienda (By Leps Digital).
2. **Asesora / Guía de Bienestar:** Marié (con su respectiva placa/avatar corporativo en el entorno visual).
3. **Producto Principal:** **Tyruss Full (500g)** - Alimento en polvo a base de crema de coco, clorofila, espirulina, chlorella, arveja, almendras, banano, aguacate, espinaca, fibra y omega 3. (Registro INVIMA: RSA-0021928-2022).
4. **Línea Oficial de Pedidos y WhatsApp:** `3235700653`.
5. **Beneficio / Regalo de Compra:** Acceso 100% GRATIS a la App de Bienestar **TyroFem 30D**.

---

## 💰 Listas de Precios y Combos Requeridos (Selector Interactivo)
El modal de compra y checkout debe permitir seleccionar entre los siguientes paquetes oficiales, actualizando el valor total automáticamente:
* **1 Tarro (500g):** $89.900 COP (+ App TyroFem Gratis)
* **2 Tarros (500g):** $134.850 COP (+ App TyroFem Gratis)
* **Pague 2 Lleve 3 Tarros:** $179.800 COP (+ App TyroFem Gratis) 🔥 *(Seleccionado por defecto)*
* **Pague 3 Lleve 5 Tarros:** $269.700 COP (+ App TyroFem VIP Gratis) ⭐

---

## 🎨 Especificaciones de Interfaz y Diseño (UX/UI Móvil)
1. **Contenedor Vertical Estilo Smartphone (9:16):** Ancho máximo controlado de `430px`, altura de `100vh`, centrado en pantalla con fondo negro absoluto y bordes sutiles.
2. **Reproductor de Video de Fondo (Loop):** Un video vertical simulando la transmisión en vivo, acompañado de una capa flotante inicial ("Toca para activar el sonido del Live") para cumplir con las políticas de autoplay de los navegadores.
3. **Header Superior:**
   * Logo y nombre de **ColShopi Tienda** con etiqueta brillante **LIVE SHOP**.
   * Contador de "Me gusta" dinámico e interactivo (ej. `4.8K Me gusta`).
   * Contador de espectadores en línea con punto rojo parpadeante (ej. `612`).
4. **Tarjeta Flotante de Producto (Derecha):**
   * Imagen miniatura del tarro Tyruss Full.
   * Nombre del producto, precio actual y llamada a la acción clara para abrir el carrito/checkout.
5. **Chat Automatizado (Inferior Izquierdo):**
   * Un contenedor con scroll automático que inyecta mensajes periódicos simulados por IA/sistema de usuarias reales preguntando por envíos a ciudades de Colombia, energía natural y métodos de pago contra entrega.
6. **Footer / Barra de Acciones:**
   * Botón principal de llamada a la acción: `🛒 Comprar Tyruss Full + App Gratis`.
   * Botones interactivos para enviar comentarios, dar "Me gusta" y un botón directo al enlace de WhatsApp oficial (`https://wa.me/573235700653`).

---

## 🛒 Formulario de Checkout y Estructura de Mensaje WhatsApp
Al hacer clic en el botón de compra o ver combos, debe abrirse un **Modal flotante estilizado** que contenga:
* Resumen del combo seleccionado y el precio total.
* Campos de captura de datos limpios:
  * Nombre Completo
  * Celular / WhatsApp
  * Ciudad / Municipio
  * Dirección y Barrio
* **Botón de Confirmación:** Al completarlo, debe estructurar automáticamente un mensaje formateado con negritas y emojis, y redirigir al usuario mediante API de WhatsApp directamente a la línea oficial **`573235700653`**, especificando los datos del cliente, el combo seleccionado y la bonificación de la App TyroFem 30D.

---

## ⚙️ Requerimientos Técnicos Estrictos
* **El Single-File Mandate:** Todo el código HTML, estilos CSS y scripts JavaScript deben entregarse en un único bloque de archivo listo para compilar.
* Cero dependencias externas complejas; utiliza Tailwind CSS vía CDN (`https://cdn.tailwindcss.com`).
* Código limpio, comentado en español y con animaciones fluidas en transiciones de modales y contador de likes.