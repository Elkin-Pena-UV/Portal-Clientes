import { estadoCliente, type ClienteAdmin } from '@/lib/admin/data'
import { exportarTablaExcel, hoyISO, type ColumnaExcel } from '@/lib/xlsx'

const COLUMNAS: ColumnaExcel<ClienteAdmin>[] = [
  { header: 'Razón social', width: 38, value: (c) => c.razon, bold: true },
  { header: 'NIT', width: 16, value: (c) => c.nit },
  { header: 'Ciudad', width: 14, value: (c) => c.ciudad },
  { header: 'Contacto', width: 22, value: (c) => c.contacto },
  { header: 'Cupo total', width: 18, value: (c) => c.cupoTotal, money: true },
  { header: 'Cupo utilizado', width: 18, value: (c) => c.cupoUtilizado, money: true },
  { header: 'Cupo disponible', width: 18, value: (c) => c.cupoTotal - c.cupoUtilizado, money: true },
  { header: 'Cartera', width: 18, value: (c) => c.carteraTotal, total: true },
  { header: 'Cartera vencida', width: 18, value: (c) => c.carteraVencida, total: true },
  { header: 'Estado', width: 16, value: (c) => estadoCliente(c).label },
]

/** Exporta a Excel el listado de clientes (ya filtrado) y dispara la descarga. */
export function exportarClientesExcel(clientes: ClienteAdmin[]) {
  return exportarTablaExcel({
    nombreHoja: 'Clientes',
    nombreArchivo: `Clientes_${hoyISO()}.xlsx`,
    columnas: COLUMNAS,
    filas: clientes,
  })
}
