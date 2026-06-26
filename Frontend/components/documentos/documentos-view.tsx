"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { type DocRemision } from "@/lib/data";
import { FacturasTable } from "@/components/documentos/facturas-table";
import { RemisionesTable } from "@/components/documentos/remisiones-table";
import { RemisionModal } from "@/components/documentos/remision-modal";

export function DocumentosView() {
  const [tab, setTab] = useState<"facturas" | "remisiones">("facturas");
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState<DocRemision | null>(null);
  const toggle = (id: string) => setSel((s) => ({ ...s, [id]: !s[id] }));
  const count = Object.values(sel).filter(Boolean).length;

  return (
    <div className="content-inner">
      <div className="card">
        <div className="card-head">
          <h3>Mis documentos</h3>
          <div className="spacer" />
          <button className="btn btn-ghost btn-sm" disabled={!count}><Icon.sheet /> Exportar Excel</button>
          <button className="btn btn-ghost btn-sm" disabled={!count}><Icon.download /> Descargar PDF</button>
        </div>
        <div style={{ padding: "12px 20px 0" }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            <button className={"tab" + (tab === "facturas" ? " on" : "")} onClick={() => setTab("facturas")}>Facturas y Notas</button>
            <button className={"tab" + (tab === "remisiones" ? " on" : "")} onClick={() => setTab("remisiones")}>Remisiones y Devoluciones</button>
          </div>
        </div>

        {tab === "facturas" && <FacturasTable sel={sel} onToggle={toggle} />}
        {tab === "remisiones" && <RemisionesTable sel={sel} onToggle={toggle} onPreview={setPreview} />}
      </div>

      {preview && <RemisionModal doc={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
