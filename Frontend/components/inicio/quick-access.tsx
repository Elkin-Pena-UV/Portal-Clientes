"use client";

import { Icon, type IconName } from "@/components/icons";

interface Acceso {
  id: string;
  t: string;
  d: string;
  ic: IconName;
  c: string;
}

const ACCESOS: Acceso[] = [
  { id: "crear", t: "Crear orden", d: "Nueva orden de compra", ic: "plus", c: "orange" },
  { id: "pedidos", t: "Mis pedidos", d: "Seguimiento e historial", ic: "box", c: "blue" },
  { id: "programacion", t: "Programación", d: "Próximas entregas", ic: "calendar", c: "blue" },
  { id: "pagos", t: "Pagos", d: "Cartera y PSE", ic: "wallet", c: "orange" },
  { id: "documentos", t: "Documentos", d: "Facturas y remisiones", ic: "doc", c: "blue" },
  { id: "producto", t: "Producto", d: "Fichas técnicas", ic: "sheet", c: "orange" },
];

export function QuickAccess({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div>
      <div className="section-title">Accesos rápidos</div>
      <div className="acc-grid">
        {ACCESOS.map((a) => {
          const Ic = Icon[a.ic];
          return (
            <button className="acc-card" key={a.id} onClick={() => onNavigate(a.id)}>
              <span className={"acc-ic " + a.c}><Ic /></span>
              <div className="acc-tx"><b>{a.t}</b><span>{a.d}</span></div>
              <Icon.chevR />
            </button>
          );
        })}
      </div>
    </div>
  );
}
