"use client";

import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";
import { ProdImg } from "@/components/ui";
import { prodThumbSrcLarge } from "@/lib/prodThumb";

export default function ProductoPage() {
  const sinFicha = MP.productos.filter((p) => !p.ficha);
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
          <span className="hint">{MP.productos.filter((p) => p.ficha).length} disponibles</span>
        </div>
        <div className="card-pad">
          <div className="prod-grid">
            {MP.productos.map((p) => (
              <div className="prod-card" key={p.id}>
                <div className="ph" style={{ padding: 0, overflow: "hidden" }}>
                  <ProdImg src={prodThumbSrcLarge(p)} style={{ width: "100%", height: "100%" }} title="Foto del producto" />
                  {!p.ficha && <span className="pill yellow" style={{ position: "absolute", top: 10, right: 10, fontSize: 11, zIndex: 2 }}>Pendiente</span>}
                </div>
                <div className="body">
                  <div className="nm">{p.nm}</div>
                  <div className="sku">SKU: {p.sku} · {p.unidad}</div>
                  <div style={{ marginTop: "auto", paddingTop: 12 }}>
                    {p.ficha
                      ? <><div className="t-muted" style={{ fontSize: 12.5, marginBottom: 9 }}>Actualizada: {new Date(p.ficha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}</div>
                          <button className="btn btn-ghost btn-sm btn-block"><Icon.download /> Descargar PDF</button></>
                      : <button className="btn btn-ghost btn-sm btn-block" disabled>No disponible</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
