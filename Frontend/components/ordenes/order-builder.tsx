'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { CheckCircle2, ClipboardList, Loader2, Plus } from 'lucide-react'
import type { Pedido } from '@/lib/types'
import {
  clonarPedido,
  nuevoPedido,
  pedidoCompleto,
  pasoActual,
  totalUnidades,
  totalesGlobales,
} from '@/lib/order-utils'
import { formatCOP } from '@/lib/format'
import { usePortal } from '@/components/portal-provider'
import { OrderStepper } from '@/components/ordenes/order-stepper'
import { PedidoCard } from '@/components/ordenes/pedido-card'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function OrderBuilder() {
  const {
    getProducto,
    consumirBorradorImportado,
    mirrorBorradorPedidos,
    consumirRestaurarBorrador,
  } = usePortal()
  const [pedidos, setPedidos] = React.useState<Pedido[]>(() => [nuevoPedido()])
  const [openId, setOpenId] = React.useState<string>(() => pedidos[0].id)
  const [showErrors, setShowErrors] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [confirmed, setConfirmed] = React.useState(false)

  // Restaurar el borrador preservado al volver de "Agregar nueva sede".
  React.useEffect(() => {
    const restaurado = consumirRestaurarBorrador()
    if (restaurado && restaurado.length) {
      setPedidos(restaurado)
      setOpenId(restaurado[0].id)
      toast.info('Recuperamos tu pedido en progreso.')
      return
    }
    // Si no hay restauración, cargar un lote importado desde Excel (si existe).
    const borrador = consumirBorradorImportado()
    if (borrador && borrador.length) {
      setPedidos(borrador)
      setOpenId(borrador[0].id)
      toast.info(
        `Se cargaron ${borrador.length} ${
          borrador.length === 1 ? 'pedido' : 'pedidos'
        } desde la plantilla para edición.`,
      )
    }
  }, [consumirBorradorImportado, consumirRestaurarBorrador])

  // Mantener un espejo del borrador para preservarlo al navegar a otra ruta.
  React.useEffect(() => {
    mirrorBorradorPedidos(pedidos)
  }, [pedidos, mirrorBorradorPedidos])

  const totalPedidos = pedidos.length
  const totalUnidadesGlobal = pedidos.reduce((acc, p) => acc + totalUnidades(p), 0)
  const totalProductos = pedidos.reduce((acc, p) => acc + p.items.length, 0)
  const totales = totalesGlobales(pedidos, getProducto)

  // El stepper global refleja el primer paso pendiente entre todos los pedidos.
  const stepperCurrent = React.useMemo(() => {
    if (pedidos.every(pedidoCompleto)) return 3
    return Math.min(...pedidos.map(pasoActual))
  }, [pedidos])

  function updatePedido(id: string, pedido: Pedido) {
    setPedidos((prev) => prev.map((p) => (p.id === id ? pedido : p)))
  }

  function agregarPedido() {
    const ultimo = pedidos[pedidos.length - 1]
    const nuevo = clonarPedido(ultimo)
    setPedidos((prev) => [...prev, nuevo])
    setOpenId(nuevo.id)
    toast.info('Nuevo pedido agregado con los datos del pedido anterior.')
  }

  function removePedido(id: string) {
    setPedidos((prev) => {
      const next = prev.filter((p) => p.id !== id)
      if (openId === id && next.length) setOpenId(next[next.length - 1].id)
      return next
    })
  }

  function confirmar() {
    const incompleto = pedidos.find((p) => !pedidoCompleto(p))
    if (incompleto) {
      setShowErrors(true)
      setOpenId(incompleto.id)
      toast.error('Revisa los datos: hay pedidos incompletos.')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setConfirmed(true)
      toast.success('¡Pedidos confirmados correctamente!')
    }, 1100)
  }

  function reiniciar() {
    const fresh = nuevoPedido()
    setPedidos([fresh])
    setOpenId(fresh.id)
    setShowErrors(false)
    setConfirmed(false)
  }

  if (confirmed) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-9" />
            </span>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">¡Pedidos confirmados!</h2>
              <p className="text-sm text-muted-foreground text-pretty">
                Registramos {totalPedidos}{' '}
                {totalPedidos === 1 ? 'pedido' : 'pedidos'} con un total de{' '}
                {totalUnidadesGlobal} unidades. Pronto recibirás la confirmación.
              </p>
            </div>
            <Button onClick={reiniciar}>
              <Plus data-icon="inline-start" />
              Crear nuevos pedidos
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 pb-32">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Crear pedido
        </h1>
        <p className="text-sm text-muted-foreground text-pretty">
          Configura tu pedido de cemento en pocos pasos. Puedes agregar varios
          pedidos en una misma sesión.
        </p>
      </div>

      {/* Stepper */}
      <Card className="mt-6">
        <CardContent className="py-4">
          <OrderStepper current={stepperCurrent} />
        </CardContent>
      </Card>

      {/* Pedidos */}
      <div className="mt-6 flex flex-col gap-4">
        {pedidos.map((pedido, index) => (
          <PedidoCard
            key={pedido.id}
            pedido={pedido}
            index={index}
            isOpen={openId === pedido.id}
            onToggle={() =>
              setOpenId((cur) => (cur === pedido.id ? '' : pedido.id))
            }
            onChange={(p) => updatePedido(pedido.id, p)}
            onRemove={pedidos.length > 1 ? () => removePedido(pedido.id) : null}
            showErrors={showErrors}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={agregarPedido}
        className="mt-4 w-full border-dashed"
      >
        <Plus data-icon="inline-start" />
        Agregar otro pedido
      </Button>

      {/* Resumen sticky */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
            <div className="flex items-center gap-2">
              <ClipboardList className="size-4 text-brand" />
              <span>
                <span className="font-semibold">{totalPedidos}</span>{' '}
                <span className="text-muted-foreground">
                  {totalPedidos === 1 ? 'pedido' : 'pedidos'}
                </span>
                <span className="text-muted-foreground">
                  {' · '}
                  {totalProductos} prod. · {totalUnidadesGlobal} und.
                </span>
              </span>
            </div>
            <div className="flex items-center gap-x-4 gap-y-1">
              <span className="text-muted-foreground">
                Neto{' '}
                <span className="font-medium text-foreground tabular-nums">
                  {formatCOP(totales.neto)}
                </span>
              </span>
              <span className="text-muted-foreground">
                IVA{' '}
                <span className="font-medium text-foreground tabular-nums">
                  {formatCOP(totales.iva)}
                </span>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 sm:ml-auto">
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Total general
              </span>
              <span className="text-lg font-bold tabular-nums text-primary">
                {formatCOP(totales.total)}
              </span>
            </div>
            <Button onClick={confirmar} disabled={submitting}>
              {submitting && (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              )}
              Confirmar pedidos
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
