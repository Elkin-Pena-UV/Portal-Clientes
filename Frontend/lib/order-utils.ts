import type { Pedido } from './types'
import { datosEntregaVacios, datosRetiraVacios } from './types'

export function nuevoPedido(): Pedido {
  return {
    id: Math.random().toString(36).slice(2, 10),
    tipoProducto: null,
    metodoDespacho: null,
    datosEntrega: datosEntregaVacios(),
    datosRetira: datosRetiraVacios(),
    items: [],
  }
}

/** Crea un nuevo pedido copiando los datos de despacho/contacto del anterior. */
export function clonarPedido(prev: Pedido): Pedido {
  return {
    id: Math.random().toString(36).slice(2, 10),
    tipoProducto: prev.tipoProducto,
    metodoDespacho: prev.metodoDespacho,
    datosEntrega: { ...prev.datosEntrega },
    datosRetira: { ...prev.datosRetira },
    items: [],
  }
}

export function totalUnidades(pedido: Pedido): number {
  return pedido.items.reduce((acc, item) => acc + item.cantidad, 0)
}

export function despachoCompleto(pedido: Pedido): boolean {
  if (pedido.metodoDespacho === 'entregar') {
    const d = pedido.datosEntrega
    return (
      !!d.sedeId &&
      !!d.nombreRecibe.trim() &&
      /^\d{10}$/.test(d.celular) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo)
    )
  }
  if (pedido.metodoDespacho === 'retira') {
    const d = pedido.datosRetira
    return (
      !!d.sedeId &&
      !!d.nombreConductor.trim() &&
      /^\d{6,10}$/.test(d.cedula) &&
      /^[A-Z]{3}\d{3}$/.test(d.placa) &&
      /^\d{10}$/.test(d.celular)
    )
  }
  return false
}

export function pedidoCompleto(pedido: Pedido): boolean {
  return (
    pedido.tipoProducto !== null &&
    pedido.metodoDespacho !== null &&
    despachoCompleto(pedido) &&
    pedido.items.length > 0
  )
}

export type StepStatus = 'complete' | 'current' | 'pending'

/** Devuelve el índice del primer paso incompleto (0-3) para un pedido. */
export function pasoActual(pedido: Pedido): number {
  if (pedido.tipoProducto === null) return 0
  if (pedido.metodoDespacho === null || !despachoCompleto(pedido)) return 1
  if (pedido.items.length === 0) return 2
  return 3
}
