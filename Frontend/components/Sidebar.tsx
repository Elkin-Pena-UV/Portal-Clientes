"use client";

import { usePathname, useRouter } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";
import { MP } from "@/lib/data";
import { MLogo } from "@/components/ui";

interface NavItem {
  id: string;
  label: string;
  icon: IconName;
  badge?: number;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
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

export function Sidebar({ collapsed, onToggle, onLogout }: {
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo"><MLogo /></div>
        <div className="name">San Marcos<small>Portal de clientes</small></div>
        <button className="sb-toggle" onClick={onToggle} title={collapsed ? "Expandir menú" : "Colapsar menú"} aria-label="Colapsar menú">
          {collapsed ? <Icon.chevR /> : <Icon.chevL />}
        </button>
      </div>
      <nav className="sb-nav">
        {NAV.map((g) => (
          <div className="sb-group" key={g.group}>
            <div className="sb-group-label">{g.group}</div>
            {g.items.map((it) => {
              const Ic = Icon[it.icon];
              const base = "/" + it.id;
              const active = pathname === base || pathname.startsWith(base + "/");
              return (
                <button
                  key={it.id}
                  className={"sb-item" + (active ? " active" : "")}
                  onClick={() => router.push("/" + it.id)}
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
        <div className="avatar">{MP.cliente.iniciales}</div>
        <div className="meta">
          <b>{MP.cliente.usuario}</b>
          <span>{MP.cliente.rol} · {MP.cliente.razon.split(" ")[0]}</span>
        </div>
        <button className="logout" onClick={onLogout} title="Cerrar sesión"><Icon.logout /></button>
      </div>
    </aside>
  );
}
