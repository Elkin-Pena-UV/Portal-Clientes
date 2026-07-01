import ExcelJS from 'exceljs'
import { descargarBlob } from '@/lib/plantilla/template'

const COLOR_AZUL = 'FF00359A'
const COLOR_BLANCO = 'FFFFFFFF'
const COLOR_ZEBRA = 'FFF3F6FC'
const FMT_COP = '"$"#,##0'

export interface ColumnaExcel<T> {
  header: string
  width: number
  value: (row: T) => string | number
  /** Aplica formato de moneda COP a la celda. */
  money?: boolean
  /** Muestra la celda en negrita. */
  bold?: boolean
  /** Suma esta columna en la fila de totales (implica formato de moneda). */
  total?: boolean
}

/** Fecha actual formateada YYYY-MM-DD para el nombre del archivo. */
export function hoyISO(): string {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

/**
 * Genera un archivo Excel a partir de una definición de columnas y dispara la
 * descarga. Incluye encabezado corporativo, filas zebra, formato de moneda y
 * una fila de totales opcional (cuando alguna columna tiene `total: true`).
 */
export async function exportarTablaExcel<T>(opts: {
  nombreHoja: string
  nombreArchivo: string
  columnas: ColumnaExcel<T>[]
  filas: T[]
}) {
  const { nombreHoja, nombreArchivo, columnas, filas } = opts

  const wb = new ExcelJS.Workbook()
  wb.creator = 'Cementos San Marcos'
  wb.created = new Date()

  const ws = wb.addWorksheet(nombreHoja, { views: [{ state: 'frozen', ySplit: 1 }] })
  ws.columns = columnas.map((c, i) => ({ key: String(i), width: c.width }))

  // Encabezado con estilo corporativo.
  const headerRow = ws.getRow(1)
  columnas.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1)
    cell.value = col.header
    cell.font = { bold: true, color: { argb: COLOR_BLANCO }, size: 11 }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_AZUL } }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
  })
  headerRow.height = 24

  // Filas de datos.
  filas.forEach((f, i) => {
    const row = ws.addRow(columnas.map((c) => c.value(f)))
    columnas.forEach((col, idx) => {
      const cell = row.getCell(idx + 1)
      if (col.money || col.total) cell.numFmt = FMT_COP
      if (col.bold) cell.font = { bold: true }
      if (i % 2 === 1) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLOR_ZEBRA } }
      }
    })
  })

  // Fila de totales (si alguna columna la solicita).
  if (columnas.some((c) => c.total)) {
    const totalRow = ws.addRow(
      columnas.map((c, idx) =>
        idx === 0 ? 'Total' : c.total ? filas.reduce((s, f) => s + Number(c.value(f)), 0) : '',
      ),
    )
    columnas.forEach((col, idx) => {
      const cell = totalRow.getCell(idx + 1)
      if (col.total) cell.numFmt = FMT_COP
      cell.font = { bold: true, color: { argb: COLOR_AZUL } }
      cell.border = { top: { style: 'thin', color: { argb: 'FFCCCCCC' } } }
    })
  }

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  descargarBlob(blob, nombreArchivo)
}
