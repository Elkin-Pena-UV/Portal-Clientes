import { MA, type PedidoAdmin } from '@/lib/admin/data'
import { exportarTablaExcel, hoyISO, type ColumnaExcel } from '@/lib/xlsx'

const COLUMNAS: ColumnaExcel<PedidoAdmin>[] = [
  { header: 'Cod', width: 14, value: (p) => p.id, bold: true },
  { header: 'Cliente', width: 34, value: (p) => p.cliente },
  { header: 'PVC', width: 16, value: (p) => p.pvc },
  { header: 'Orden compra', width: 16, value: (p) => p.oc },
  { header: 'Fecha', width: 14, value: (p) => p.fecha },
  { header: 'Sede', width: 30, value: (p) => p.sede.split('·')[1]?.trim() ?? p.sede },
  { header: 'Tipo', width: 12, value: (p) => p.tipo },
  { header: 'Zona', width: 16, value: (p) => p.zona },
  { header: 'Valor', width: 18, value: (p) => p.valor, total: true },
  { header: 'Estado', width: 16, value: (p) => MA.estados[p.estado].label },
]

/** Exporta a Excel los pedidos del back office (ya filtrados) y dispara la descarga. */
export function exportarPedidosAdminExcel(pedidos: PedidoAdmin[]) {
  return exportarTablaExcel({
    nombreHoja: 'Pedidos',
    nombreArchivo: `Pedidos_admin_${hoyISO()}.xlsx`,
    columnas: COLUMNAS,
    filas: pedidos,
  })
}
