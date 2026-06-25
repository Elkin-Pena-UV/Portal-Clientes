"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { MP, type DocRemision } from "@/lib/data";
import { Pill, Checkbox, DetalleRow } from "@/components/ui";

export default function DocumentosPage() {
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

        {tab === "facturas" && (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th style={{ width: 44 }}></th><th>Emisión</th><th>FN</th><th>Documento</th><th>Pedido</th><th>Orden de Compra</th><th>NIT</th><th className="num">Valor</th><th></th></tr></thead>
              <tbody>
                {MP.docsFacturas.map((d) => (
                  <tr key={d.id} style={sel[d.id] ? { background: "var(--orange-light)" } : undefined}>
                    <td><Checkbox on={!!sel[d.id]} onClick={() => toggle(d.id)} /></td>
                    <td className="t-muted">{d.emision}</td>
                    <td><Pill kind={d.fn === "FVE" ? "blue" : d.fn === "NC" ? "yellow" : "gray"} dot={false}>{d.fn}</Pill></td>
                    <td><div className="t-strong t-mono">{d.id}</div><div className="t-muted" style={{ fontSize: 12.5 }}>{d.doc}</div></td>
                    <td className="t-muted t-mono">{d.pedido}</td>
                    <td className="t-muted t-mono">{d.oc}</td>
                    <td className="t-muted t-mono">{d.nit}</td>
                    <td className="num t-mono" style={{ color: d.valor < 0 ? "var(--red-ink)" : "var(--ink)" }}>{(d.valor < 0 ? "−" : "") + MP.COP(Math.abs(d.valor))}</td>
                    <td><button className="btn btn-quiet btn-sm"><Icon.download /> PDF</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "remisiones" && (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th style={{ width: 44 }}></th><th>Emisión</th><th>Tipo</th><th>Documento</th><th>Pedido</th><th>Firma digital</th><th className="num">Valor</th><th></th></tr></thead>
              <tbody>
                {MP.docsRemisiones.map((d) => (
                  <tr key={d.id} style={sel[d.id] ? { background: "var(--orange-light)" } : undefined}>
                    <td><Checkbox on={!!sel[d.id]} onClick={() => toggle(d.id)} /></td>
                    <td className="t-muted">{d.emision}</td>
                    <td><Pill kind={d.tipo === "Remisión" ? "orange" : "gray"} dot={false}>{d.tipo}</Pill></td>
                    <td className="t-strong t-mono">{d.id}</td>
                    <td className="t-muted t-mono">{d.pedido}</td>
                    <td><Pill kind={MP.firmaEstados[d.firma].pill}>{MP.firmaEstados[d.firma].label}</Pill></td>
                    <td className="num t-mono" style={{ color: d.valor < 0 ? "var(--red-ink)" : "var(--ink)" }}>{(d.valor < 0 ? "−" : "") + MP.COP(Math.abs(d.valor))}</td>
                    <td><button className="btn btn-quiet btn-sm" onClick={() => setPreview(d)}><Icon.eye /> Vista previa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {preview && <RemisionModal doc={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

function RemisionModal({ doc, onClose }: { doc: DocRemision; onClose: () => void }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="card modal-card" style={{ width: 460 }} onClick={(e) => e.stopPropagation()}>
        <div className="card-head">
          <h3>{doc.tipo} digital</h3>
          <Pill kind="orange" dot={false}>{doc.codigo}</Pill>
          <div className="spacer" />
          <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose}><Icon.x /></button>
        </div>
        <div className="card-pad">
          <DetalleRow label="Documento" value={doc.id} />
          <DetalleRow label="Pedido" value={doc.pedido} />
          <DetalleRow label="Nombre del receptor" value={doc.receptor} />
          <DetalleRow label="Celular del receptor" value={doc.cel} />
          <DetalleRow label="Fecha y hora de entrega" value={doc.hora} />
          <DetalleRow label="Código del documento" value={doc.codigo} />
          <div className="between" style={{ padding: "12px 0 2px" }}>
            <span className="t-muted" style={{ fontSize: 13 }}>Estado firma digital</span>
            <Pill kind={MP.firmaEstados[doc.firma].pill}>{doc.firma === "ok" ? "Capturada y validada" : "Pendiente"}</Pill>
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }}><Icon.download /> Descargar {doc.tipo.toLowerCase()} (PDF)</button>
        </div>
      </div>
    </div>
  );
}
