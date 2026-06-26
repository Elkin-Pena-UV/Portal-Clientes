"use client";

import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";
import { ProductoCard } from "@/components/producto/producto-card";

export function ProductoView() {
  const sinFicha = MP.productos.filter((p) => !p.ficha);
  const disponibles = MP.productos.filter((p) => p.ficha).length;

  return (
    <div className="content-inner stack">
      {sinFicha.length > 0 && (
        <div className="muted-note warn">
          <Icon.info />
          <span>{sinFicha.length} producto(s) aún no tienen ficha técnica disponible ({sinFicha.map((p) => p.sku).join(", ")}). El área comercial las cargará próximamente.</span>
        </div>
      )}
      <div className="card">
        <div className="card-head">
          <h3>Fichas técnicas por producto</h3>
          <div className="spacer" />
          <span className="hint">{disponibles} disponibles</span>
        </div>
        <div className="card-pad">
          <div className="prod-grid">
            {MP.productos.map((p) => (
              <ProductoCard key={p.id} prod={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
