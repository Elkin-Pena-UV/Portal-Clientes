import { MP, type Pago } from '@/lib/data'
import { exportarTablaExcel, hoyISO, type ColumnaExcel } from '@/lib/xlsx'

const COLUMNAS: ColumnaExcel<Pago>[] = [
  { header: 'Registro', width: 20, value: (p) => p.reg },
  { header: 'Motivo', width: 14, value: (p) => p.motivo },
  { header: 'Código', width: 12, value: (p) => p.codigo },
  { header: 'Estado', width: 14, value: (p) => MP.pagoEstados[p.estado].label },
  { header: 'Fecha', width: 14, value: (p) => p.fecha },
  { header: 'Valor', width: 18, value: (p) => p.valor, total: true, bold: true },
  { header: 'Moneda', width: 10, value: (p) => p.moneda },
  { header: 'Método de pago', width: 18, value: (p) => p.metodo },
  { header: 'Origen', width: 24, value: (p) => p.site },
]

/** Exporta a Excel el historial de pagos (ya filtrado) y dispara la descarga. */
export function exportarHistorialExcel(pagos: Pago[]) {
  return exportarTablaExcel({
    nombreHoja: 'Historial de pagos',
    nombreArchivo: `Historial_de_pagos_${hoyISO()}.xlsx`,
    columnas: COLUMNAS,
    filas: pagos,
  })
}
