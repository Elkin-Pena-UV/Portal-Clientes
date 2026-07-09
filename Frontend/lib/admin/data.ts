/* ============================================================
   Cementos San Marcos — Portal Administrativo · datos de ejemplo
   ============================================================ */

import { MP, type CarteraEdad, type EstadoMeta, type EstadoPedido, type PillKind } from "@/lib/data";
import { productosMock } from "@/lib/mock-data";
import type { Producto, TipoPunto } from "@/lib/types";

/* ---------------- Tipos de dominio ---------------- */

export interface AdminUser {
  nombre: string;
  rol: string;
  iniciales: string;
  correo: string;
}

export interface ClienteAdmin {
  id: string;
  razon: string;
  nit: string;
  ciudad: string;
  contacto: string;
  correo: string;
  telefono: string;
  cupoTotal: number;
  cupoUtilizado: number;
  carteraTotal: number;
  carteraVencida: number;
  /** Cartera por edades sincronizada del ERP (suma = carteraTotal). */
  edades: CarteraEdad[];
}

/** Semáforo del cliente derivado de cupo y cartera. */
export function estadoCliente(c: ClienteAdmin): EstadoMeta {
  if (c.cupoUtilizado / c.cupoTotal >= 0.9) return { label: "Cupo crítico", pill: "red" };
  if (c.carteraVencida > 0) return { label: "Cartera vencida", pill: "orange" };
  return { label: "Al día", pill: "green" };
}

export interface CumplidoAdmin {
  rem: string;
  codigo: string;
  receptor: string;
  hora: string;
}

export type AccionERP = "despacho" | "entrega" | "anulacion";

/** Procedimiento disparado en el ERP que aún no ha sido confirmado. */
export interface SolicitudERP {
  accion: AccionERP;
}

/** Pedido visto desde el back office: incluye el cliente que lo creó. */
export interface PedidoAdmin {
  id: string;
  pvc: string;
  fecha: string;
  estado: EstadoPedido;
  oc: string;
  valor: number;
  items: number;
  clienteId: string;
  cliente: string;
  sede: string;
  tipo: string;
  zona: string;
  conductor: string;
  placa: string;
  cumplido?: CumplidoAdmin;
  /** Presente mientras un procedimiento espera confirmación del ERP. */
  sync?: SolicitudERP;
}

export interface Vehiculo {
  conductor: string;
  placa: string;
}

/** Roles del portal administrativo (propios del portal, no del ERP). */
export type RolAdmin = "administrador" | "despachos" | "cartera";

export interface UsuarioAdmin {
  id: string;
  nombre: string;
  correo: string;
  rol: RolAdmin;
  activo: boolean;
  ultimoAcceso: string;
}

/** Parámetros generales del portal (propiedad del portal, editables aquí). */
export interface ParametrosPortal {
  correoNotificaciones: string;
  /** Hora de corte: pedidos creados después se programan al siguiente día hábil. */
  horaCorte: string;
  /** Permite que los clientes registren sedes nuevas desde su portal. */
  permitirSedesClientes: boolean;
}

export type EstadoSede = "activa" | "por_aprobar" | "rechazada";

/**
 * Sede de un cliente vista desde el back office. El cliente la registra en el
 * portal; al aprobarla, el ERP la codifica (asigna el código tipo "0656-005")
 * y queda activa para despachos. Sin código no se puede despachar.
 */
export interface SedeAdmin {
  id: string;
  clienteId: string;
  cliente: string;
  nombre: string;
  tipo: TipoPunto;
  direccion: string;
  ciudad: string;
  contactoNombre?: string;
  contactoTelefono?: string;
  /** Código asignado por el ERP; null mientras no esté codificada. */
  codigo: string | null;
  estado: EstadoSede;
  /** Fecha en que el cliente registró la sede (solo pendientes/rechazadas). */
  fechaSolicitud?: string;
  /** true mientras la codificación espera confirmación del ERP. */
  sync?: boolean;
}

/**
 * Producto visto desde el back office. El maestro (código, precios, IVA,
 * presentación) lo gobierna el ERP; la capa web (imagen, ficha técnica,
 * visibilidad en el catálogo) sí es del portal y el admin la edita.
 */
export interface ProductoAdmin extends Producto {
  visible: boolean;
  /** Fecha de la ficha técnica publicada, o null si no tiene. */
  ficha: string | null;
}

export interface Alerta {
  icon: "shield" | "wallet" | "pin" | "clock";
  titulo: string;
  detalle: string;
  pill: PillKind;
  pillLabel: string;
}

/* ---------------- Datos ---------------- */

const adminUser: AdminUser = {
  nombre: "Carlos Valencia",
  rol: "Administrador",
  iniciales: "CV",
  correo: "cvalencia@sanmarcos.com.co",
};

const clientes: ClienteAdmin[] = [
  {
    id: "c1", razon: "Constructora del Pacífico S.A.S.", nit: "830.221.554-8", ciudad: "Cali",
    contacto: "María Restrepo", correo: "mrestrepo@constpacifico.co", telefono: "315 442 8861",
    cupoTotal: 800000000, cupoUtilizado: 512000000, carteraTotal: 187450000, carteraVencida: 15500000,
    edades: [
      { rango: "Corriente", valor: 96200000, pill: "green" },
      { rango: "1 – 30 días", valor: 54300000, pill: "orange" },
      { rango: "31 – 60 días", valor: 21450000, pill: "yellow" },
      { rango: "61 – 90 días", valor: 9800000, pill: "red" },
      { rango: "+ 90 días", valor: 5700000, pill: "red" },
    ],
  },
  {
    id: "c2", razon: "Ferretería El Constructor S.A.S.", nit: "805.114.220-3", ciudad: "Yumbo",
    contacto: "Julián Bedoya", correo: "jbedoya@elconstructor.co", telefono: "310 228 4415",
    cupoTotal: 250000000, cupoUtilizado: 238000000, carteraTotal: 96300000, carteraVencida: 31200000,
    edades: [
      { rango: "Corriente", valor: 32500000, pill: "green" },
      { rango: "1 – 30 días", valor: 18400000, pill: "orange" },
      { rango: "31 – 60 días", valor: 14200000, pill: "yellow" },
      { rango: "61 – 90 días", valor: 19800000, pill: "red" },
      { rango: "+ 90 días", valor: 11400000, pill: "red" },
    ],
  },
  {
    id: "c3", razon: "Obras Civiles del Valle Ltda.", nit: "890.318.442-1", ciudad: "Palmira",
    contacto: "Carolina Ruiz", correo: "cruiz@obrascivilesvalle.co", telefono: "300 887 2109",
    cupoTotal: 400000000, cupoUtilizado: 176000000, carteraTotal: 64800000, carteraVencida: 0,
    edades: [
      { rango: "Corriente", valor: 48600000, pill: "green" },
      { rango: "1 – 30 días", valor: 16200000, pill: "orange" },
      { rango: "31 – 60 días", valor: 0, pill: "yellow" },
      { rango: "61 – 90 días", valor: 0, pill: "red" },
      { rango: "+ 90 días", valor: 0, pill: "red" },
    ],
  },
  {
    id: "c4", razon: "Concretos y Prefabricados Andinos S.A.", nit: "900.774.081-6", ciudad: "Buga",
    contacto: "Andrés Sarria", correo: "asarria@prefandinos.co", telefono: "312 664 0937",
    cupoTotal: 600000000, cupoUtilizado: 402000000, carteraTotal: 142600000, carteraVencida: 8900000,
    edades: [
      { rango: "Corriente", valor: 84300000, pill: "green" },
      { rango: "1 – 30 días", valor: 32700000, pill: "orange" },
      { rango: "31 – 60 días", valor: 16700000, pill: "yellow" },
      { rango: "61 – 90 días", valor: 8900000, pill: "red" },
      { rango: "+ 90 días", valor: 0, pill: "red" },
    ],
  },
];

const pedidos: PedidoAdmin[] = [
  { id: "T-293102", pvc: "—", fecha: "08 jul 2026", estado: "pendiente", oc: "OC-13011", valor: 18400000, items: 16, clienteId: "c2", cliente: "Ferretería El Constructor S.A.S.", sede: "0712-001 · Yumbo – Bodega Central", tipo: "Entrega", zona: "Yumbo", conductor: "Por asignar", placa: "—" },
  { id: "T-293097", pvc: "—", fecha: "08 jul 2026", estado: "pendiente", oc: "OC-13008", valor: 9200000, items: 9, clienteId: "c1", cliente: "Constructora del Pacífico S.A.S.", sede: "0656-001 · Cali – Planta SC", tipo: "Entrega", zona: "Cali – Valle", conductor: "Por asignar", placa: "—" },
  { id: "T-293085", pvc: "PVC-276410", fecha: "07 jul 2026", estado: "transito", oc: "OC-12988", valor: 24600000, items: 21, clienteId: "c4", cliente: "Concretos y Prefabricados Andinos S.A.", sede: "0890-002 · Buga – Planta Prefabricados", tipo: "Entrega", zona: "Buga", conductor: "Arturo Mosquera", placa: "SVL886" },
  { id: "T-293071", pvc: "PVC-276398", fecha: "07 jul 2026", estado: "transito", oc: "OC-12979", valor: 6750000, items: 6, clienteId: "c3", cliente: "Obras Civiles del Valle Ltda.", sede: "0844-001 · Palmira – Obra Aeropuerto", tipo: "Entrega", zona: "Palmira", conductor: "Jhon Camilo Mena", placa: "TGK114" },
  { id: "T-293056", pvc: "PVC-276371", fecha: "06 jul 2026", estado: "transito", oc: "OC-12961", valor: 13100000, items: 12, clienteId: "c1", cliente: "Constructora del Pacífico S.A.S.", sede: "0656-003 · Buga – Centro", tipo: "Retiro", zona: "Buga", conductor: "Andrés Vélez", placa: "WBN552" },
  { id: "T-293040", pvc: "—", fecha: "06 jul 2026", estado: "pendiente", oc: "OC-12943", valor: 4300000, items: 4, clienteId: "c3", cliente: "Obras Civiles del Valle Ltda.", sede: "0844-002 · Palmira – Zona Franca", tipo: "Retiro", zona: "Palmira", conductor: "—", placa: "—" },
  { id: "T-293011", pvc: "PVC-276322", fecha: "05 jul 2026", estado: "entregado", oc: "OC-12930", valor: 15800000, items: 14, clienteId: "c2", cliente: "Ferretería El Constructor S.A.S.", sede: "0712-001 · Yumbo – Bodega Central", tipo: "Entrega", zona: "Yumbo", conductor: "Arturo Mosquera", placa: "SVL886", cumplido: { rem: "REM-2412", codigo: "#PAR-9034", receptor: "Diana Quintero", hora: "05 jul 2026 · 15:41" } },
  { id: "T-292996", pvc: "PVC-276301", fecha: "04 jul 2026", estado: "entregado", oc: "OC-12921", valor: 8900000, items: 8, clienteId: "c1", cliente: "Constructora del Pacífico S.A.S.", sede: "0656-001 · Cali – Planta SC", tipo: "Entrega", zona: "Cali – Valle", conductor: "Jhon Camilo Mena", placa: "TGK114", cumplido: { rem: "REM-2405", codigo: "#PAR-9021", receptor: "Héctor Girón", hora: "04 jul 2026 · 11:08" } },
  { id: "T-292965", pvc: "PVC-276258", fecha: "03 jul 2026", estado: "entregado", oc: "OC-12902", valor: 31400000, items: 26, clienteId: "c4", cliente: "Concretos y Prefabricados Andinos S.A.", sede: "0890-001 · Buga – Centro de Acopio", tipo: "Entrega", zona: "Buga", conductor: "Andrés Vélez", placa: "WBN552", cumplido: { rem: "REM-2398", codigo: "#PAR-9002", receptor: "Paola Rentería", hora: "03 jul 2026 · 16:55" } },
  { id: "T-292930", pvc: "—", fecha: "02 jul 2026", estado: "anulado", oc: "OC-12885", valor: 5200000, items: 5, clienteId: "c2", cliente: "Ferretería El Constructor S.A.S.", sede: "0712-002 · Yumbo – Punto de Venta Norte", tipo: "Retiro", zona: "Yumbo", conductor: "—", placa: "—" },
  { id: "T-292911", pvc: "PVC-276190", fecha: "01 jul 2026", estado: "entregado", oc: "OC-12871", valor: 11600000, items: 10, clienteId: "c3", cliente: "Obras Civiles del Valle Ltda.", sede: "0844-001 · Palmira – Obra Aeropuerto", tipo: "Entrega", zona: "Palmira", conductor: "Arturo Mosquera", placa: "SVL886", cumplido: { rem: "REM-2381", codigo: "#PAR-8977", receptor: "Julián Caicedo", hora: "01 jul 2026 · 09:32" } },
  { id: "T-292884", pvc: "PVC-276154", fecha: "30 jun 2026", estado: "entregado", oc: "OC-12856", valor: 19750000, items: 17, clienteId: "c1", cliente: "Constructora del Pacífico S.A.S.", sede: "0656-004 · Palmira – Zona Franca", tipo: "Entrega", zona: "Palmira", conductor: "Jhon Camilo Mena", placa: "TGK114", cumplido: { rem: "REM-2360", codigo: "#PAR-8951", receptor: "Sandra Mina", hora: "30 jun 2026 · 13:17" } },
];

const vehiculos: Vehiculo[] = [
  { conductor: "Arturo Mosquera", placa: "SVL886" },
  { conductor: "Jhon Camilo Mena", placa: "TGK114" },
  { conductor: "Andrés Vélez", placa: "WBN552" },
  { conductor: "Óscar Perlaza", placa: "KJT903" },
];

/** Rol → etiqueta, alcance y pill para mostrar en la UI. */
const rolesAdmin: Record<RolAdmin, { label: string; desc: string; pill: PillKind }> = {
  administrador: { label: "Administrador", desc: "Acceso total al portal administrativo", pill: "blue" },
  despachos: { label: "Operador de despachos", desc: "Gestiona pedidos y sedes", pill: "orange" },
  cartera: { label: "Analista de cartera", desc: "Consulta clientes, cupos y cartera", pill: "green" },
};

const usuarios: UsuarioAdmin[] = [
  { id: "u1", nombre: "Carlos Valencia", correo: "cvalencia@sanmarcos.com.co", rol: "administrador", activo: true, ultimoAcceso: "09 jul 2026 · 07:41" },
  { id: "u2", nombre: "Paula Andrade", correo: "pandrade@sanmarcos.com.co", rol: "despachos", activo: true, ultimoAcceso: "09 jul 2026 · 06:55" },
  { id: "u3", nombre: "Ricardo Molina", correo: "rmolina@sanmarcos.com.co", rol: "cartera", activo: true, ultimoAcceso: "08 jul 2026 · 17:12" },
  { id: "u4", nombre: "Jorge Tenorio", correo: "jtenorio@sanmarcos.com.co", rol: "despachos", activo: false, ultimoAcceso: "22 jun 2026 · 10:30" },
];

const parametros: ParametrosPortal = {
  correoNotificaciones: "portal@sanmarcos.com.co",
  horaCorte: "16:00",
  permitirSedesClientes: true,
};

const sedes: SedeAdmin[] = [
  // --- Activas (codificadas en el ERP) ---
  { id: "s1", clienteId: "c1", cliente: "Constructora del Pacífico S.A.S.", nombre: "Cali – Planta SC", tipo: "obra", direccion: "Cra 36 # 10-95, Acopi", ciudad: "Cali", contactoNombre: "Ing. Marcela Ríos", contactoTelefono: "3104567890", codigo: "0656-001", estado: "activa" },
  { id: "s2", clienteId: "c1", cliente: "Constructora del Pacífico S.A.S.", nombre: "Yumbo – San Marcos", tipo: "obra", direccion: "Km 24 Vía Panorama", ciudad: "Yumbo", contactoNombre: "Héctor Girón", contactoTelefono: "3128840193", codigo: "0656-002", estado: "activa" },
  { id: "s3", clienteId: "c1", cliente: "Constructora del Pacífico S.A.S.", nombre: "Buga – Centro", tipo: "punto_venta", direccion: "Calle 6 # 14-28", ciudad: "Buga", contactoNombre: "Laura Gómez", contactoTelefono: "3201234567", codigo: "0656-003", estado: "activa" },
  { id: "s4", clienteId: "c1", cliente: "Constructora del Pacífico S.A.S.", nombre: "Palmira – Zona Franca", tipo: "obra", direccion: "Zona Franca del Pacífico, bodega 12", ciudad: "Palmira", contactoNombre: "Carolina Ruiz", contactoTelefono: "3001129087", codigo: "0656-004", estado: "activa" },
  { id: "s5", clienteId: "c2", cliente: "Ferretería El Constructor S.A.S.", nombre: "Yumbo – Bodega Central", tipo: "punto_venta", direccion: "Cra 32 # 11-45", ciudad: "Yumbo", contactoNombre: "Julián Bedoya", contactoTelefono: "3102284415", codigo: "0712-001", estado: "activa" },
  { id: "s6", clienteId: "c2", cliente: "Ferretería El Constructor S.A.S.", nombre: "Yumbo – Punto de Venta Norte", tipo: "punto_venta", direccion: "Calle 15 # 28-04", ciudad: "Yumbo", contactoNombre: "Diana Quintero", contactoTelefono: "3155048821", codigo: "0712-002", estado: "activa" },
  { id: "s7", clienteId: "c3", cliente: "Obras Civiles del Valle Ltda.", nombre: "Palmira – Obra Aeropuerto", tipo: "obra", direccion: "Vía Aeropuerto Alfonso Bonilla, km 3", ciudad: "Palmira", contactoNombre: "Julián Caicedo", contactoTelefono: "3009876543", codigo: "0844-001", estado: "activa" },
  { id: "s8", clienteId: "c3", cliente: "Obras Civiles del Valle Ltda.", nombre: "Palmira – Zona Franca", tipo: "obra", direccion: "Zona Franca del Pacífico, lote 8", ciudad: "Palmira", contactoNombre: "Carolina Ruiz", contactoTelefono: "3008872109", codigo: "0844-002", estado: "activa" },
  { id: "s9", clienteId: "c4", cliente: "Concretos y Prefabricados Andinos S.A.", nombre: "Buga – Centro de Acopio", tipo: "obra", direccion: "Km 2 vía Buga – Tuluá", ciudad: "Buga", contactoNombre: "Paola Rentería", contactoTelefono: "3126640937", codigo: "0890-001", estado: "activa" },
  { id: "s10", clienteId: "c4", cliente: "Concretos y Prefabricados Andinos S.A.", nombre: "Buga – Planta Prefabricados", tipo: "obra", direccion: "Parque Industrial, manzana C", ciudad: "Buga", contactoNombre: "Andrés Sarria", contactoTelefono: "3126640937", codigo: "0890-002", estado: "activa" },
  // --- Registradas por el cliente, pendientes de aprobación ---
  { id: "s11", clienteId: "c3", cliente: "Obras Civiles del Valle Ltda.", nombre: "Palmira – Obra Hospital", tipo: "obra", direccion: "Cra 28 # 45-60, Barrio Central", ciudad: "Palmira", contactoNombre: "Ing. Mauricio Lasso", contactoTelefono: "3114459082", codigo: null, estado: "por_aprobar", fechaSolicitud: "08 jul 2026" },
  { id: "s12", clienteId: "c1", cliente: "Constructora del Pacífico S.A.S.", nombre: "Cali – Obra Torre Mirador", tipo: "obra", direccion: "Av. Circunvalar # 5 Oeste-102", ciudad: "Cali", contactoNombre: "Ing. Sandra Mina", contactoTelefono: "3137721036", codigo: null, estado: "por_aprobar", fechaSolicitud: "09 jul 2026" },
];

const estadosSede: Record<EstadoSede, EstadoMeta> = {
  activa: { label: "Activa", pill: "green" },
  por_aprobar: { label: "Por aprobar", pill: "yellow" },
  rechazada: { label: "Rechazada", pill: "gray" },
};

const tiposPunto: Record<TipoPunto, string> = {
  obra: "Obra",
  punto_venta: "Punto de venta",
};

// Fecha de ficha técnica publicada por producto (null = sin ficha).
const FICHAS: Record<string, string | null> = {
  p1: "18 may 2026",
  p2: "18 may 2026",
  p3: "02 may 2026",
  p4: "30 abr 2026",
  p7: "11 mar 2026",
  p8: "25 may 2026",
  p9: null,
  p10: "30 abr 2026",
  p11: "25 may 2026",
  p12: null,
  p13: "25 may 2026",
};

/** Catálogo del portal: maestro sincronizado del ERP + capa web editable. */
const productos: ProductoAdmin[] = productosMock.map((p) => ({
  ...p,
  visible: true,
  ficha: FICHAS[p.id] ?? null,
}));

/** Imágenes de producto disponibles en el portal. */
const imagenesProducto: string[] = [
  "/images/saco-gris.png",
  "/images/saco-blanco.png",
  "/images/saco-mortero.png",
  "/images/saco-pegante.png",
  "/images/saco-pegante-ceramico.png",
  "/images/saco-estuco.png",
  "/images/saco-estuco-relleno.png",
  "/images/saco-estuco-relleno-exterior.png",
  "/images/saco-boquilla.png",
  "/images/granel.png",
];

/** Etiquetas de estado con semántica de back office ("pendiente" = por confirmar). */
const estados: Record<EstadoPedido, EstadoMeta> = {
  pendiente: { label: "Por confirmar", pill: "yellow" },
  transito: { label: "En tránsito", pill: "blue" },
  entregado: { label: "Entregado", pill: "green" },
  anulado: { label: "Anulado", pill: "gray" },
};

const alertas: Alerta[] = [
  { icon: "shield", titulo: "Ferretería El Constructor S.A.S.", detalle: "Cupo utilizado al 95% — pedidos nuevos pueden quedar retenidos por cartera.", pill: "red", pillLabel: "Cupo" },
  { icon: "wallet", titulo: "Cartera vencida global", detalle: "3 clientes suman $55.6M en facturas vencidas a más de 30 días.", pill: "orange", pillLabel: "Cartera" },
  { icon: "pin", titulo: "Sede nueva por aprobar", detalle: "Obras Civiles del Valle registró “Palmira – Obra Hospital” y espera habilitación.", pill: "yellow", pillLabel: "Sedes" },
  { icon: "clock", titulo: "Despachos sin conductor", detalle: "2 pedidos confirmados para mañana aún no tienen vehículo asignado.", pill: "blue", pillLabel: "Logística" },
];

export const MA = {
  COP: MP.COP,
  adminUser,
  clientes,
  pedidos,
  vehiculos,
  productos,
  imagenesProducto,
  sedes,
  estadosSede,
  tiposPunto,
  rolesAdmin,
  usuarios,
  parametros,
  estados,
  alertas,
};
