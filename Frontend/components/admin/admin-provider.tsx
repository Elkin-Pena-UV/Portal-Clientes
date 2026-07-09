'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { MA, type ParametrosPortal, type PedidoAdmin, type ProductoAdmin, type SedeAdmin, type UsuarioAdmin } from '@/lib/admin/data'
import { solicitarDespachoERP, solicitarEntregaERP, solicitarAnulacionERP, solicitarCodificacionSedeERP } from '@/lib/admin/api'

/** Cambios permitidos sobre la capa web de un producto (lo demás lo gobierna el ERP). */
export type CapaWebProducto = Partial<Pick<ProductoAdmin, 'visible' | 'imagen' | 'ficha'>>

interface AdminContextValue {
  pedidos: PedidoAdmin[]
  getPedido: (id: string) => PedidoAdmin | undefined
  /** Dispara el procedimiento de despacho en el ERP (pendiente → transito al confirmar). */
  confirmarDespacho: (id: string, conductor: string, placa: string) => void
  /** Dispara el procedimiento de entrega en el ERP (transito → entregado al confirmar). */
  marcarEntregado: (id: string, receptor: string) => void
  /** Dispara el procedimiento de anulación en el ERP (pendiente → anulado al confirmar). */
  anularPedido: (id: string) => void
  productos: ProductoAdmin[]
  /** Muestra u oculta el producto en el catálogo del cliente (capa web, sin ERP). */
  toggleVisibleProducto: (id: string) => void
  /** Actualiza imagen / ficha / visibilidad (capa web, sin ERP). */
  actualizarProductoWeb: (id: string, cambios: CapaWebProducto) => void
  sedes: SedeAdmin[]
  /** Aprueba la sede y dispara su codificación en el ERP (activa al confirmar). */
  aprobarSede: (id: string) => void
  /** Rechaza la solicitud (acción del portal: aún no existe en el ERP). */
  rechazarSede: (id: string) => void
  usuarios: UsuarioAdmin[]
  /** Crea o actualiza un usuario del portal administrativo (sin ERP). */
  guardarUsuario: (usuario: Omit<UsuarioAdmin, 'id' | 'ultimoAcceso'> & { id?: string }) => void
  /** Activa o desactiva el acceso de un usuario (sin ERP). */
  toggleActivoUsuario: (id: string) => void
  parametros: ParametrosPortal
  /** Guarda los parámetros generales del portal (sin ERP). */
  guardarParametros: (parametros: ParametrosPortal) => void
}

const AdminContext = React.createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [pedidos, setPedidos] = React.useState<PedidoAdmin[]>(MA.pedidos)
  const [productos, setProductos] = React.useState<ProductoAdmin[]>(MA.productos)
  const [sedes, setSedes] = React.useState<SedeAdmin[]>(MA.sedes)
  const [usuarios, setUsuarios] = React.useState<UsuarioAdmin[]>(MA.usuarios)
  const [parametros, setParametros] = React.useState<ParametrosPortal>(MA.parametros)

  const actualizar = (id: string, cambio: (p: PedidoAdmin) => PedidoAdmin) =>
    setPedidos((prev) => prev.map((p) => (p.id === id ? cambio(p) : p)))

  const actualizarProducto = (id: string, cambio: (p: ProductoAdmin) => ProductoAdmin) =>
    setProductos((prev) => prev.map((p) => (p.id === id ? cambio(p) : p)))

  const actualizarSede = (id: string, cambio: (s: SedeAdmin) => SedeAdmin) =>
    setSedes((prev) => prev.map((s) => (s.id === id ? cambio(s) : s)))

  /** Siguiente consecutivo de sede para el cliente, con el prefijo que usa el ERP. */
  const proximoCodigoSede = (clienteId: string): string => {
    const codigos = sedes
      .filter((s) => s.clienteId === clienteId && s.codigo)
      .map((s) => s.codigo as string)
    const prefijo = codigos[0]?.split('-')[0] ?? '0000'
    const mayor = Math.max(0, ...codigos.map((c) => Number(c.split('-')[1]) || 0))
    return `${prefijo}-${String(mayor + 1).padStart(3, '0')}`
  }

  const value: AdminContextValue = {
    pedidos,
    getPedido: (id) => pedidos.find((p) => p.id === id),

    confirmarDespacho: (id, conductor, placa) => {
      actualizar(id, (p) => ({ ...p, sync: { accion: 'despacho' } }))
      toast.info(`Solicitud de despacho enviada al ERP`, { description: `Pedido ${id} · ${conductor} · ${placa}` })
      solicitarDespachoERP(id, conductor, placa)
        .then(({ pvc }) => {
          actualizar(id, (p) => ({ ...p, estado: 'transito', pvc, conductor, placa, sync: undefined }))
          toast.success(`El ERP confirmó el despacho de ${id}`, { description: `PVC ${pvc} generado` })
        })
        .catch(() => {
          actualizar(id, (p) => ({ ...p, sync: undefined }))
          toast.error(`El ERP rechazó el despacho de ${id}`, { description: 'Intenta de nuevo o revisa el pedido en el ERP.' })
        })
    },

    marcarEntregado: (id, receptor) => {
      actualizar(id, (p) => ({ ...p, sync: { accion: 'entrega' } }))
      toast.info(`Solicitud de entrega enviada al ERP`, { description: `Pedido ${id} · recibe ${receptor}` })
      solicitarEntregaERP(id, receptor)
        .then((cumplido) => {
          actualizar(id, (p) => ({ ...p, estado: 'entregado', cumplido, sync: undefined }))
          toast.success(`El ERP registró la entrega de ${id}`, { description: `Remisión ${cumplido.rem} · ${cumplido.codigo}` })
        })
        .catch(() => {
          actualizar(id, (p) => ({ ...p, sync: undefined }))
          toast.error(`El ERP no registró la entrega de ${id}`, { description: 'Intenta de nuevo o revisa el pedido en el ERP.' })
        })
    },

    productos,

    toggleVisibleProducto: (id) => {
      const prod = productos.find((p) => p.id === id)
      if (!prod) return
      actualizarProducto(id, (p) => ({ ...p, visible: !p.visible }))
      toast.success(
        prod.visible
          ? `«${prod.nombre}» quedó oculto del catálogo`
          : `«${prod.nombre}» ahora es visible en el catálogo`,
      )
    },

    actualizarProductoWeb: (id, cambios) => {
      const prod = productos.find((p) => p.id === id)
      if (!prod) return
      actualizarProducto(id, (p) => ({ ...p, ...cambios }))
      toast.success(`Capa web de «${prod.nombre}» actualizada`)
    },

    sedes,

    aprobarSede: (id) => {
      const sede = sedes.find((s) => s.id === id)
      if (!sede) return
      const codigo = proximoCodigoSede(sede.clienteId)
      actualizarSede(id, (s) => ({ ...s, sync: true }))
      toast.info('Solicitud de codificación enviada al ERP', { description: `${sede.nombre} · ${sede.cliente}` })
      solicitarCodificacionSedeERP(id, codigo)
        .then(({ codigo: confirmado }) => {
          actualizarSede(id, (s) => ({ ...s, estado: 'activa', codigo: confirmado, sync: undefined, fechaSolicitud: undefined }))
          toast.success(`El ERP codificó la sede «${sede.nombre}»`, { description: `Código ${confirmado} · habilitada para despachos` })
        })
        .catch(() => {
          actualizarSede(id, (s) => ({ ...s, sync: undefined }))
          toast.error(`El ERP no pudo codificar «${sede.nombre}»`, { description: 'Intenta de nuevo o revisa el maestro en el ERP.' })
        })
    },

    rechazarSede: (id) => {
      const sede = sedes.find((s) => s.id === id)
      if (!sede) return
      actualizarSede(id, (s) => ({ ...s, estado: 'rechazada' }))
      toast.warning(`Solicitud de sede «${sede.nombre}» rechazada`, { description: 'El cliente verá el rechazo en su portal.' })
    },

    usuarios,

    guardarUsuario: (usuario) => {
      if (usuario.id) {
        const id = usuario.id
        setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol, activo: usuario.activo } : u)))
        toast.success(`Usuario «${usuario.nombre}» actualizado`)
      } else {
        const nuevo: UsuarioAdmin = {
          id: 'u' + Math.random().toString(36).slice(2, 8),
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol,
          activo: usuario.activo,
          ultimoAcceso: 'Nunca',
        }
        setUsuarios((prev) => [...prev, nuevo])
        toast.success(`Usuario «${usuario.nombre}» creado`, { description: 'Recibirá la invitación en su correo.' })
      }
    },

    toggleActivoUsuario: (id) => {
      const usuario = usuarios.find((u) => u.id === id)
      if (!usuario) return
      setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, activo: !u.activo } : u)))
      toast.success(usuario.activo ? `Acceso de «${usuario.nombre}» desactivado` : `Acceso de «${usuario.nombre}» reactivado`)
    },

    parametros,

    guardarParametros: (nuevos) => {
      setParametros(nuevos)
      toast.success('Parámetros del portal actualizados')
    },

    anularPedido: (id) => {
      actualizar(id, (p) => ({ ...p, sync: { accion: 'anulacion' } }))
      toast.info(`Solicitud de anulación enviada al ERP`, { description: `Pedido ${id}` })
      solicitarAnulacionERP(id)
        .then(() => {
          actualizar(id, (p) => ({ ...p, estado: 'anulado', conductor: '—', placa: '—', sync: undefined }))
          toast.success(`El ERP anuló el pedido ${id}`, { description: 'Cupo liberado.' })
        })
        .catch(() => {
          actualizar(id, (p) => ({ ...p, sync: undefined }))
          toast.error(`El ERP no pudo anular ${id}`, { description: 'Intenta de nuevo o revisa el pedido en el ERP.' })
        })
    },
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin(): AdminContextValue {
  const ctx = React.useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
