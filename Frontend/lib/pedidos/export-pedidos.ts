import { MP, type Pedido } from '@/lib/data'
import { exportarTablaExcel, hoyISO, type ColumnaExcel } from '@/lib/xlsx'

const COLUMNAS: ColumnaExcel<Pedido>[] = [
  { header: 'Cod', width: 14, value: (p) => p.id, bold: true },
  { header: 'PVC', width: 16, value: (p) => p.pvc },
  { header: 'Orden compra', width: 16, value: (p) => p.oc },
  { header: 'Fecha', width: 14, value: (p) => p.fecha },
  { header: 'Sede', width: 24, value: (p) => p.sede.split('·')[1]?.trim() ?? p.sede },
  { header: 'Valor', width: 18, value: (p) => p.valor, total: true },
  { header: 'Estado', width: 16, value: (p) => MP.estados[p.estado].label },
]

/** Exporta a Excel el historial de pedidos (ya filtrado) y dispara la descarga. */
export function exportarPedidosExcel(pedidos: Pedido[]) {
  return exportarTablaExcel({
    nombreHoja: 'Historial de pedidos',
    nombreArchivo: `Historial_de_pedidos_${hoyISO()}.xlsx`,
    columnas: COLUMNAS,
    filas: pedidos,
  })
}
