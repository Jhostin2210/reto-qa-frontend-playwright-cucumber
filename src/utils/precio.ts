export interface Producto {
  nombre: string;
  precio: number;
}

/** Convierte textos como "$29.99", "Item total: $39.98" o "Tax: $3.20" a número. */
export function parsePrecio(texto: string): number {
  const coincidencia = texto.match(/\$?\s*(\d+(?:\.\d+)?)/);
  if (!coincidencia) {
    throw new Error(`No se encontró un precio en el texto: "${texto}"`);
  }
  return Number(coincidencia[1]);
}

/** Redondea a 2 decimales para comparar montos sin errores de punto flotante. */
export function redondear(monto: number): number {
  return Math.round(monto * 100) / 100;
}

/** Expresión regular que coincide exactamente con un texto (escapando caracteres especiales). */
export function textoExacto(texto: string): RegExp {
  return new RegExp(`^${texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
}
