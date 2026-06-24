'use client'

import * as React from 'react'
import Image from 'next/image'
import { Minus, Plus, Search, ShoppingCart } from 'lucide-react'
import type { ItemPedido, TipoProducto } from '@/lib/types'
import { usePortal } from '@/components/portal-provider'
import { formatCOP } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

interface ProductPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tipoProducto: TipoProducto
  currentItems: ItemPedido[]
  onConfirm: (items: ItemPedido[]) => void
}

export function ProductPickerDialog({
  open,
  onOpenChange,
  tipoProducto,
  currentItems,
  onConfirm,
}: ProductPickerDialogProps) {
  const { productos } = usePortal()
  const [query, setQuery] = React.useState('')
  const [draft, setDraft] = React.useState<Record<string, number>>({})

  React.useEffect(() => {
    if (open) {
      setQuery('')
      const initial: Record<string, number> = {}
      for (const item of currentItems) initial[item.productoId] = item.cantidad
      setDraft(initial)
    }
  }, [open, currentItems])

  const disponibles = React.useMemo(
    () => productos.filter((p) => p.tipo === tipoProducto),
    [productos, tipoProducto],
  )

  const filtrados = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return disponibles
    return disponibles.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.marca.toLowerCase().includes(q),
    )
  }, [disponibles, query])

  function setQty(id: string, qty: number) {
    setDraft((prev) => {
      const next = { ...prev }
      if (qty <= 0) delete next[id]
      else next[id] = qty
      return next
    })
  }

  const totalUnidades = Object.values(draft).reduce((a, b) => a + b, 0)
  const totalProductos = Object.keys(draft).length

  function handleConfirm() {
    const prevFechas = new Map(
      currentItems.map((i) => [i.productoId, i.fechaEntrega]),
    )
    const items: ItemPedido[] = Object.entries(draft).map(
      ([productoId, cantidad]) => ({
        productoId,
        cantidad,
        fechaEntrega: prevFechas.get(productoId) ?? null,
      }),
    )
    onConfirm(items)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-3xl">
        <DialogHeader className="border-b p-4">
          <DialogTitle>
            Agregar productos · {tipoProducto === 'saco' ? 'Productos ensacados' : 'Cemento a granel'}
          </DialogTitle>
          <DialogDescription>
            Ajusta las cantidades de los productos que deseas incluir en el
            pedido.
          </DialogDescription>
          <InputGroup className="mt-2">
            <InputGroupInput
              placeholder="Buscar por nombre o marca..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {filtrados.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Search />
                </EmptyMedia>
                <EmptyTitle>Sin productos</EmptyTitle>
                <EmptyDescription>
                  No hay productos que coincidan con tu búsqueda.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filtrados.map((producto) => {
                const qty = draft[producto.id] ?? 0
                const added = qty > 0
                return (
                  <div
                    key={producto.id}
                    className={cn(
                      'relative flex gap-3 rounded-lg border bg-card p-3 transition-colors',
                      added ? 'border-primary ring-1 ring-primary/20' : 'border-border',
                    )}
                  >
                    {added && (
                      <Badge className="absolute -right-2 -top-2 px-2">
                        {qty}
                      </Badge>
                    )}
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={producto.imagen || '/placeholder.svg'}
                        alt={producto.nombre}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {producto.marca}
                      </span>
                      <span className="font-medium leading-tight text-pretty">
                        {producto.nombre}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {producto.presentacion}
                      </span>
                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <span className="text-sm font-semibold">
                          {formatCOP(producto.precio)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-7"
                            disabled={qty <= 0}
                            onClick={() => setQty(producto.id, qty - 1)}
                            aria-label={`Quitar uno de ${producto.nombre}`}
                          >
                            <Minus />
                          </Button>
                          <input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            value={qty}
                            onChange={(e) =>
                              setQty(
                                producto.id,
                                Math.max(0, Number(e.target.value) || 0),
                              )
                            }
                            className="h-7 w-12 rounded-md border bg-background text-center text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                            aria-label={`Cantidad de ${producto.nombre}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-7"
                            onClick={() => setQty(producto.id, qty + 1)}
                            aria-label={`Agregar uno de ${producto.nombre}`}
                          >
                            <Plus />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t bg-muted/30 p-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {totalProductos} {totalProductos === 1 ? 'producto' : 'productos'}
            </span>
            <span className="text-xs text-muted-foreground">
              {totalUnidades} {totalUnidades === 1 ? 'unidad' : 'unidades'} en total
            </span>
          </div>
          <Button onClick={handleConfirm} disabled={totalProductos === 0}>
            <ShoppingCart data-icon="inline-start" />
            Agregar al pedido ({totalProductos})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
