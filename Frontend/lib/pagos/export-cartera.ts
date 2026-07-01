import { MP, type Solicitud } from '@/lib/data'
import { exportarTablaExcel, hoyISO, type ColumnaExcel } from '@/lib/xlsx'

const COLUMNAS: ColumnaExcel<Solicitud>[] = [
  { header: 'N.º', width: 10, value: (s) => s.id, bold: true },
  { header: 'Fecha creación', width: 20, value: (s) => s.fecha },
  { header: 'Valor', width: 18, value: (s) => s.valor, total: true },
  { header: 'Proceso', width: 14, value: (s) => s.proceso },
  { header: 'Descripción', width: 30, value: (s) => s.desc },
  { header: 'Estado', width: 14, value: (s) => MP.pagoEstados[s.estado].label },
  { header: 'Pasarela', width: 12, value: (s) => s.pasarela },
  { header: 'Estado plataforma', width: 18, value: (s) => s.plataforma },
  { header: 'Recaudo', width: 12, value: (s) => s.recaudo },
  { header: 'Expira', width: 20, value: (s) => s.expira },
]

/** Exporta a Excel el estado de cartera (ya filtrado) y dispara la descarga. */
export function exportarCarteraExcel(solicitudes: Solicitud[]) {
  return exportarTablaExcel({
    nombreHoja: 'Estado de cartera',
    nombreArchivo: `Estado_de_cartera_${hoyISO()}.xlsx`,
    columnas: COLUMNAS,
    filas: solicitudes,
  })
}
