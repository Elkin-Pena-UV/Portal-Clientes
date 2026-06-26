"use client";

import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";
import { ProdImg } from "@/components/shared/primitives";
import { prodThumbSrcLarge } from "@/lib/prodThumb";

type Producto = (typeof MP.productos)[number];

export function ProductoCard({ prod }: { prod: Producto }) {
  return (
    <div className="prod-card">
      <div className="ph" style={{ padding: 0, overflow: "hidden" }}>
        <ProdImg src={prodThumbSrcLarge(prod)} style={{ width: "100%", height: "100%" }} title="Foto del producto" />
        {!prod.ficha && <span className="pill yellow" style={{ position: "absolute", top: 10, right: 10, fontSize: 11, zIndex: 2 }}>Pendiente</span>}
      </div>
      <div className="body">
        <div className="nm">{prod.nm}</div>
        <div className="sku">SKU: {prod.sku} · {prod.unidad}</div>
        <div style={{ marginTop: "auto", paddingTop: 12 }}>
          {prod.ficha
            ? <><div className="t-muted" style={{ fontSize: 12.5, marginBottom: 9 }}>Actualizada: {new Date(prod.ficha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}</div>
                <button className="btn btn-ghost btn-sm btn-block"><Icon.download /> Descargar PDF</button></>
            : <button className="btn btn-ghost btn-sm btn-block" disabled>No disponible</button>}
        </div>
      </div>
    </div>
  );
}
