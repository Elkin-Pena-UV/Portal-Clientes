'use client'

import * as React from 'react'
import type { ProductoAdmin } from '@/lib/admin/data'
import { MA } from '@/lib/admin/data'
import { useAdmin } from '@/components/admin/admin-provider'
import { ProdImg } from '@/components/shared/primitives'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface ProductoFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto?: ProductoAdmin | null
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function hoyCorto(): string {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]} ${d.getFullYear()}`
}

export function ProductoFormSheet({ open, onOpenChange, producto }: ProductoFormSheetProps) {
  const { actualizarProductoWeb } = useAdmin()
  const [visible, setVisible] = React.useState(true)
  const [imagen, setImagen] = React.useState('')
  const [ficha, setFicha] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (open && producto) {
      setVisible(producto.visible)
      setImagen(producto.imagen)
      setFicha(producto.ficha)
    }
  }, [open, producto])

  if (!producto) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!producto) return
    actualizarProductoWeb(producto.id, { visible, imagen, ficha })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{producto.nombre}</SheetTitle>
          <SheetDescription>
            El maestro del producto lo gobierna el ERP. Desde el portal solo se administra la capa web del catálogo.
          </SheetDescription>
        </SheetHeader>

        <form id="producto-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-2">
          <FieldGroup>
            <Field>
              <FieldLabel>Datos del ERP · solo lectura</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                <Input value={producto.codigo} disabled aria-label="Código" />
                <Input value={producto.presentacion} disabled aria-label="Presentación" />
                <Input value={MA.COP(producto.precio) + ' / ' + producto.unidad} disabled aria-label="Precio" />
                <Input value={'IVA ' + Math.round(producto.iva * 100) + '%'} disabled aria-label="IVA" />
              </div>
              <FieldDescription>Código, presentación, precio e IVA se actualizan por sincronización.</FieldDescription>
            </Field>

            <Field orientation="horizontal">
              <div>
                <FieldLabel htmlFor="visible">Visible en el catálogo</FieldLabel>
                <FieldDescription>Los productos ocultos no aparecen para los clientes.</FieldDescription>
              </div>
              <Switch id="visible" checked={visible} onCheckedChange={setVisible} />
            </Field>

            <Field>
              <FieldLabel htmlFor="imagen">Imagen del catálogo</FieldLabel>
              <div className="flex items-center gap-3">
                <ProdImg src={imagen} alt={producto.nombre} style={{ width: 54, height: 54, borderRadius: 8, border: '1px solid var(--line)' }} />
                <select id="imagen" className="input" style={{ flex: 1 }} value={imagen} onChange={(e) => setImagen(e.target.value)}>
                  {MA.imagenesProducto.map((img) => (
                    <option key={img} value={img}>{img.replace('/images/', '').replace('.png', '')}</option>
                  ))}
                </select>
              </div>
            </Field>

            <Field>
              <FieldLabel>Ficha técnica</FieldLabel>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm" style={{ color: ficha ? 'var(--ink-2)' : 'var(--red-ink)' }}>
                  {ficha ? `Publicada · ${ficha}` : 'Sin ficha publicada'}
                </span>
                <Button type="button" variant="outline" size="sm" onClick={() => setFicha(hoyCorto())}>
                  Marcar actualizada hoy
                </Button>
              </div>
              <FieldDescription>Simula la carga del PDF de la ficha; en producción abre el gestor de archivos.</FieldDescription>
            </Field>
          </FieldGroup>
        </form>

        <SheetFooter>
          <Button type="submit" form="producto-form">Guardar cambios</Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
