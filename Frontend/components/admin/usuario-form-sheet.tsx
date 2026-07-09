'use client'

import * as React from 'react'
import { MA, type RolAdmin, type UsuarioAdmin } from '@/lib/admin/data'
import { useAdmin } from '@/components/admin/admin-provider'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface UsuarioFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario?: UsuarioAdmin | null
}

interface FormState {
  nombre: string
  correo: string
  rol: RolAdmin | ''
  activo: boolean
}

const emptyForm: FormState = { nombre: '', correo: '', rol: '', activo: true }

// value → label para que el trigger del Select muestre la etiqueta del rol.
const ROL_ITEMS = (Object.keys(MA.rolesAdmin) as RolAdmin[]).map((r) => ({
  value: r,
  label: MA.rolesAdmin[r].label,
}))

export function UsuarioFormSheet({ open, onOpenChange, usuario }: UsuarioFormSheetProps) {
  const { guardarUsuario } = useAdmin()
  const [form, setForm] = React.useState<FormState>(emptyForm)
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (open) {
      setErrors({})
      setForm(
        usuario
          ? { nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol, activo: usuario.activo }
          : emptyForm,
      )
    }
  }, [open, usuario])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate() {
    const next: Record<string, string> = {}
    if (!form.nombre.trim()) next.nombre = 'Ingresa el nombre completo.'
    if (!/^\S+@\S+\.\S+$/.test(form.correo.trim())) next.correo = 'Ingresa un correo válido.'
    if (!form.rol) next.rol = 'Selecciona un rol.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    guardarUsuario({
      id: usuario?.id,
      nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      rol: form.rol as RolAdmin,
      activo: form.activo,
    })
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{usuario ? 'Editar usuario' : 'Nuevo usuario'}</SheetTitle>
          <SheetDescription>
            {usuario
              ? 'Actualiza el acceso al portal administrativo.'
              : 'Crea un acceso al portal administrativo. Los roles limitan qué secciones puede gestionar.'}
          </SheetDescription>
        </SheetHeader>

        <form id="usuario-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-2">
          <FieldGroup>
            <Field data-invalid={!!errors.nombre}>
              <FieldLabel htmlFor="u-nombre">Nombre completo</FieldLabel>
              <Input
                id="u-nombre"
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                placeholder="Ej: Paula Andrade"
                aria-invalid={!!errors.nombre}
              />
              {errors.nombre && <FieldError>{errors.nombre}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.correo}>
              <FieldLabel htmlFor="u-correo">Correo corporativo</FieldLabel>
              <Input
                id="u-correo"
                value={form.correo}
                onChange={(e) => set('correo', e.target.value)}
                placeholder="usuario@sanmarcos.com.co"
                aria-invalid={!!errors.correo}
              />
              {errors.correo && <FieldError>{errors.correo}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.rol}>
              <FieldLabel htmlFor="u-rol">Rol</FieldLabel>
              <Select items={ROL_ITEMS} value={form.rol || null} onValueChange={(v) => set('rol', (v ?? '') as RolAdmin | '')}>
                <SelectTrigger id="u-rol" aria-invalid={!!errors.rol}>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {(Object.keys(MA.rolesAdmin) as RolAdmin[]).map((r) => (
                      <SelectItem key={r} value={r}>{MA.rolesAdmin[r].label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.rol
                ? <FieldError>{errors.rol}</FieldError>
                : form.rol && <FieldDescription>{MA.rolesAdmin[form.rol as RolAdmin].desc}.</FieldDescription>}
            </Field>

            <Field orientation="horizontal">
              <div>
                <FieldLabel htmlFor="u-activo">Acceso activo</FieldLabel>
                <FieldDescription>Los usuarios inactivos no pueden iniciar sesión.</FieldDescription>
              </div>
              <Switch id="u-activo" checked={form.activo} onCheckedChange={(v) => set('activo', v)} />
            </Field>
          </FieldGroup>
        </form>

        <SheetFooter>
          <Button type="submit" form="usuario-form">{usuario ? 'Guardar cambios' : 'Crear usuario'}</Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-destructive">{children}</p>
}
