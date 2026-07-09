import type { ProductoAdmin } from '@/lib/admin/data'
import { exportarTablaExcel, hoyISO, type ColumnaExcel } from '@/lib/xlsx'

const COLUMNAS: ColumnaExcel<ProductoAdmin>[] = [
  { header: 'Código', width: 14, value: (p) => p.codigo, bold: true },
  { header: 'Producto', width: 34, value: (p) => p.nombre },
  { header: 'Marca', width: 14, value: (p) => p.marca },
  { header: 'Tipo', width: 10, value: (p) => (p.tipo === 'saco' ? 'Saco' : 'Granel') },
  { header: 'Presentación', width: 18, value: (p) => p.presentacion },
  { header: 'Unidad', width: 14, value: (p) => p.unidad },
  { header: 'Precio', width: 16, value: (p) => p.precio, money: true },
  { header: 'IVA', width: 8, value: (p) => Math.round(p.iva * 100) + '%' },
  { header: 'Ficha técnica', width: 16, value: (p) => p.ficha ?? 'Sin ficha' },
  { header: 'Visible', width: 10, value: (p) => (p.visible ? 'Sí' : 'No') },
]

/** Exporta a Excel el catálogo de productos (ya filtrado) y dispara la descarga. */
export function exportarProductosExcel(productos: ProductoAdmin[]) {
  return exportarTablaExcel({
    nombreHoja: 'Productos',
    nombreArchivo: `Productos_${hoyISO()}.xlsx`,
    columnas: COLUMNAS,
    filas: productos,
  })
}
