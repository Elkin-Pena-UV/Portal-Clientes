/* Cementos San Marcos — miniaturas alusivas al producto (deriva del id/sku) */

export const PROD_CATS = {
  granel: { icon: "truck", cls: "blue", label: "Granel" },
  saco: { icon: "bag", cls: "orange", label: "Saco" },
  estuco: { icon: "bucket", cls: "green", label: "Estuco" },
  boquilla: { icon: "drop", cls: "purple", label: "Boquilla" },
  mortero: { icon: "layers", cls: "slate", label: "Mortero" },
};

export function prodCat(p) {
  const id = (p.id || "") + (p.sku || "");
  if (/CEM-?ART|GRA|GRANEL/i.test(id)) return "granel";
  if (/EST/i.test(id)) return "estuco";
  if (/BOQ/i.test(id)) return "boquilla";
  if (/MOR/i.test(id)) return "mortero";
  return "saco";
}

/* SVG (data URI) del ícono de categoría — sirve de imagen del producto */
const PROD_ICON_SVG = {
  granel: '<path d="M3 6h11v9H3z"/><path d="M14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
  saco: '<path d="M6 8h12l-1 12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M9.5 13h5"/>',
  estuco: '<path d="M5 7h14l-1.4 12.2a1 1 0 0 1-1 .8H7.4a1 1 0 0 1-1-.8L5 7Z"/><path d="M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3"/>',
  boquilla: '<path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3Z"/>',
  mortero: '<path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 13l9 5 9-5"/><path d="M3 16l9 5 9-5"/>',
};

const PROD_COLORS = {
  granel: ["#E6ECFA", "#00359A"], saco: ["#FFF0E6", "#E25A00"], estuco: ["#E6F4EC", "#1E7A47"],
  boquilla: ["#F3ECFB", "#6D44C7"], mortero: ["#EEF0F3", "#4B5260"],
};

export function prodThumbSrc(p) {
  const k = prodCat(p);
  const [bg, fg] = PROD_COLORS[k];
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">'
    + '<rect width="48" height="48" rx="10" fill="' + bg + '"/>'
    + '<g transform="translate(12,12)" fill="none" stroke="' + fg + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + PROD_ICON_SVG[k] + '</g></svg>';
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

export function prodThumbSrcLarge(p) {
  const k = prodCat(p);
  const [bg, fg] = PROD_COLORS[k];
  // Icono 24px escalado x2.2 (≈53px) centrado en un lienzo 240x150
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="150" viewBox="0 0 240 150">'
    + '<rect width="240" height="150" fill="' + bg + '"/>'
    + '<g transform="translate(93.6,48.6) scale(2.2)" fill="none" stroke="' + fg + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + PROD_ICON_SVG[k] + '</g></svg>';
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
