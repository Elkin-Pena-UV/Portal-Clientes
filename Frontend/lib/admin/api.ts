/* ============================================================
   Capa de servicios hacia el ERP — simulada.

   El portal no cambia estados directamente: cada acción del
   administrador dispara un procedimiento en el ERP y espera su
   confirmación. Hoy estas funciones simulan esa integración con
   latencia; al conectar el ERP real solo cambia su implementación
   (los componentes y el provider no se tocan).
   ============================================================ */

import type { CumplidoAdmin } from '@/lib/admin/data'

/** Latencia simulada del procedimiento en el ERP. */
const LATENCIA_ERP = 2200

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/** Fecha-hora actual con el formato del portal: "08 jul 2026 · 14:22". */
function ahora(): string {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${dd} ${MESES[d.getMonth()]} ${d.getFullYear()} · ${hh}:${mm}`
}

// Consecutivos de demo para los documentos que "genera" el ERP en la sesión.
let seq = 0

/** Procedimiento de despacho: valida cartera, genera el PVC y programa el vehículo. */
export async function solicitarDespachoERP(
  _pedidoId: string,
  _conductor: string,
  _placa: string,
): Promise<{ pvc: string }> {
  await delay(LATENCIA_ERP)
  seq += 1
  return { pvc: 'PVC-' + (276500 + seq) }
}

/** Procedimiento de entrega: registra el cumplido y emite la remisión firmada. */
export async function solicitarEntregaERP(
  _pedidoId: string,
  receptor: string,
): Promise<CumplidoAdmin> {
  await delay(LATENCIA_ERP)
  seq += 1
  return {
    rem: 'REM-' + (2450 + seq),
    codigo: '#PAR-' + (9100 + seq),
    receptor,
    hora: ahora(),
  }
}

/** Procedimiento de anulación: libera cupo y cierra la orden en el ERP. */
export async function solicitarAnulacionERP(_pedidoId: string): Promise<void> {
  await delay(LATENCIA_ERP)
}

/**
 * Procedimiento de codificación de sede: el ERP crea el punto de entrega en el
 * maestro del cliente y asigna el consecutivo. Recibe el código propuesto por
 * el portal y devuelve el confirmado por el ERP.
 */
export async function solicitarCodificacionSedeERP(
  _sedeId: string,
  codigoPropuesto: string,
): Promise<{ codigo: string }> {
  await delay(LATENCIA_ERP)
  return { codigo: codigoPropuesto }
}
