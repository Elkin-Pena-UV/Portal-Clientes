import { MP, type Factura } from '@/lib/data'
import { exportarTablaExcel, hoyISO, type ColumnaExcel } from '@/lib/xlsx'

export interface FilaFacturaExport {
  factura: Factura
  montoPagar: number
}

const COLUMNAS: ColumnaExcel<FilaFacturaExport>[] = [
  { header: 'N.º factura', width: 18, value: (f) => f.factura.id, bold: true },
  { header: 'Fecha factura', width: 16, value: (f) => f.factura.emision },
  { header: 'Vencimiento', width: 16, value: (f) => f.factura.venc },
  { header: 'Estado', width: 14, value: (f) => MP.factEstados[f.factura.estado].label },
  { header: 'Saldo (con IVA)', width: 18, value: (f) => f.factura.valor, total: true },
  { header: 'Monto a pagar', width: 18, value: (f) => f.montoPagar, total: true },
]

/** Exporta a Excel las facturas seleccionadas (ya filtradas) y dispara la descarga. */
export function exportarFacturasExcel(filas: FilaFacturaExport[]) {
  return exportarTablaExcel({
    nombreHoja: 'Facturas por pagar',
    nombreArchivo: `Facturas_por_pagar_${hoyISO()}.xlsx`,
    columnas: COLUMNAS,
    filas,
  })
}
