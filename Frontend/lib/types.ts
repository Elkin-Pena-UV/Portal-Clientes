export type TipoPunto = 'obra' | 'punto_venta'

export interface Sede {
  id: string
  nombre: string
  tipo: TipoPunto
  direccion: string
  ciudad: string
  contactoNombre?: string
  contactoTelefono?: string
}

export type TipoProducto = 'saco' | 'granel'

export interface Producto {
  id: string
  nombre: string
  marca: string
  tipo: TipoProducto
  presentacion: string
  precio: number
  imagen: string
}

export type MetodoDespacho = 'entregar' | 'retira'

export interface DatosEntrega {
  sedeId: string
  nombreRecibe: string
  celular: string
  correo: string
  necesitaEstiba: boolean
  necesitaDescarga: boolean
}

export interface DatosRetira {
  sedeId: string
  nombreConductor: string
  cedula: string
  placa: string
  celular: string
  necesitaEstiba: boolean
  observaciones: string
}

export interface ItemPedido {
  productoId: string
  cantidad: number
}

export interface Pedido {
  id: string
  tipoProducto: TipoProducto | null
  metodoDespacho: MetodoDespacho | null
  datosEntrega: DatosEntrega
  datosRetira: DatosRetira
  items: ItemPedido[]
}

export const datosEntregaVacios = (): DatosEntrega => ({
  sedeId: '',
  nombreRecibe: '',
  celular: '',
  correo: '',
  necesitaEstiba: false,
  necesitaDescarga: false,
})

export const datosRetiraVacios = (): DatosRetira => ({
  sedeId: '',
  nombreConductor: '',
  cedula: '',
  placa: '',
  celular: '',
  necesitaEstiba: false,
  observaciones: '',
})
