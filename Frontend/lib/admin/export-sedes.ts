import { MA, type SedeAdmin } from '@/lib/admin/data'
import { exportarTablaExcel, hoyISO, type ColumnaExcel } from '@/lib/xlsx'

const COLUMNAS: ColumnaExcel<SedeAdmin>[] = [
  { header: 'Código', width: 14, value: (s) => s.codigo ?? '—', bold: true },
  { header: 'Sede', width: 30, value: (s) => s.nombre },
  { header: 'Cliente', width: 34, value: (s) => s.cliente },
  { header: 'Tipo', width: 16, value: (s) => MA.tiposPunto[s.tipo] },
  { header: 'Dirección', width: 32, value: (s) => s.direccion },
  { header: 'Ciudad', width: 14, value: (s) => s.ciudad },
  { header: 'Contacto', width: 22, value: (s) => s.contactoNombre ?? '—' },
  { header: 'Teléfono', width: 16, value: (s) => s.contactoTelefono ?? '—' },
  { header: 'Estado', width: 14, value: (s) => MA.estadosSede[s.estado].label },
]

/** Exporta a Excel las sedes (ya filtradas) y dispara la descarga. */
export function exportarSedesExcel(sedes: SedeAdmin[]) {
  return exportarTablaExcel({
    nombreHoja: 'Sedes',
    nombreArchivo: `Sedes_${hoyISO()}.xlsx`,
    columnas: COLUMNAS,
    filas: sedes,
  })
}
