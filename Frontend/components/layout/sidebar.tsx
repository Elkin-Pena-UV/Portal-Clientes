"use client";

import { usePathname, useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";
import { MP } from "@/lib/data";
import { MLogo } from "@/components/shared/primitives";

export interface NavItem {
  id: string;
  label: string;
  icon: IconName;
  badge?: number;
  /** Marca activo solo con coincidencia exacta de ruta (útil para el dashboard). */
  exact?: boolean;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export interface SidebarUser {
  iniciales: string;
  nombre: string;
  detalle: string;
}

const NAV_CLIENTE: NavGroup[] = [
  { group: "Principal", items: [
    { id: "inicio", label: "Inicio", icon: "home" },
  ]},
  { group: "Pedidos", items: [
    { id: "crear", label: "Crear orden", icon: "plus" },
    { id: "pedidos", label: "Mis pedidos", icon: "box", badge: 3 },
    { id: "programacion", label: "Programación de entregas", icon: "calendar" },
  ]},
  { group: "Cartera", items: [
    { id: "pagos", label: "Pagos", icon: "wallet", badge: 2 },
    { id: "documentos", label: "Documentos", icon: "doc" },
  ]},
  { group: "Catálogo", items: [
    { id: "producto", label: "Producto", icon: "sheet" },
    { id: "sedes", label: "Sedes", icon: "pin" },
  ]},
];

const USER_CLIENTE: SidebarUser = {
  iniciales: MP.cliente.iniciales,
  nombre: MP.cliente.usuario,
  detalle: MP.cliente.rol + " · " + MP.cliente.razon.split(" ")[0],
};

export function Sidebar({ collapsed, onToggle, onLogout, onNavigate, nav = NAV_CLIENTE, subtitle = "Portal de clientes", user = USER_CLIENTE }: {
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
  onNavigate?: () => void;
  nav?: NavGroup[];
  subtitle?: string;
  user?: SidebarUser;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo"><MLogo /></div>
        <div className="name">San Marcos<small>{subtitle}</small></div>
        <button className="sb-toggle" onClick={onToggle} title={collapsed ? "Expandir menú" : "Colapsar menú"} aria-label="Colapsar menú">
          {collapsed ? <Icon.chevR /> : <Icon.chevL />}
        </button>
      </div>
      <nav className="sb-nav">
        {nav.map((g) => (
          <div className="sb-group" key={g.group}>
            <div className="sb-group-label">{g.group}</div>
            {g.items.map((it) => {
              const Ic = Icon[it.icon];
              const base = "/" + it.id;
              const active = pathname === base || (!it.exact && pathname.startsWith(base + "/"));
              return (
                <button
                  key={it.id}
                  className={"sb-item" + (active ? " active" : "")}
                  onClick={() => { router.push("/" + it.id); onNavigate?.(); }}
                  title={collapsed ? it.label : undefined}
                >
                  <Ic />
                  <span className="label">{it.label}</span>
                  {it.badge ? <span className="sb-badge">{it.badge}</span> : null}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="sb-user">
        <div className="avatar">{user.iniciales}</div>
        <div className="meta">
          <b>{user.nombre}</b>
          <span>{user.detalle}</span>
        </div>
        <button className="logout" onClick={onLogout} title="Cerrar sesión"><Icon.logout /></button>
      </div>
    </aside>
  );
}
