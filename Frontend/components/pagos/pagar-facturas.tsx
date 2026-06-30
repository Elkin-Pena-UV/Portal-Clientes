"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { Icon } from "@/components/icons";
import { MP, type Factura } from "@/lib/data";
import { Pill, Checkbox } from "@/components/shared/primitives";

export function PagarFacturas({ sel, setSel, montos, setMontos }: {
  sel: Record<string, boolean>;
  setSel: Dispatch<SetStateAction<Record<string, boolean>>>;
  montos: Record<string, number>;
  setMontos: Dispatch<SetStateAction<Record<string, number>>>;
}) {
  const [q, setQ] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const montoDe = (f: Factura) => (sel[f.id] ? (montos[f.id] != null ? montos[f.id] : f.valor) : 0);

  const term = q.trim().toLowerCase();
  const lista = MP.facturas.filter((f) =>
    (term ? f.id.toLowerCase().includes(term) : true) &&
    (desde ? f.vencISO >= desde : true) &&
    (hasta ? f.vencISO <= hasta : true)
  );
  const allOn = lista.length > 0 && lista.every((f) => sel[f.id]);

  const toggle = (id: string) => setSel((s) => ({ ...s, [id]: !s[id] }));
  const toggleAll = () => {
    const v = !allOn;
    setSel((s) => {
      const n = { ...s };
      lista.forEach((f) => (n[f.id] = v));
      return n;
    });
  };

  return (
    <>
      <div className="card-head" style={{ borderBottom: "none", paddingBottom: 4 }}>
        <h3>Pagar facturas</h3>
        <div className="spacer" />
        <div className="search">
          <Icon.search />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por N.º de factura…" />
        </div>
        <div className="search" style={{ width: "auto" }}>
          <Icon.calendar />
          <input type="date" value={desde} max={hasta || undefined} onChange={(e) => setDesde(e.target.value)} style={{ width: "auto" }} aria-label="Fecha desde" />
          <span className="t-muted" style={{ padding: "0 2px" }}>–</span>
          <input type="date" value={hasta} min={desde || undefined} onChange={(e) => setHasta(e.target.value)} style={{ width: "auto" }} aria-label="Fecha hasta" />
        </div>
        {(q || desde || hasta) && (
          <button className="btn btn-quiet btn-sm" onClick={() => { setQ(""); setDesde(""); setHasta(""); }}><Icon.x /> Limpiar</button>
        )}
      </div>

      <div className="tbl-wrap" style={{ borderTop: "1px solid var(--line)" }}>
        <table className="tbl">
          <thead><tr>
            <th style={{ width: 44 }}><Checkbox on={allOn} onClick={toggleAll} /></th>
            <th>N.º factura</th><th>Vencimiento</th><th className="num">Saldo</th>
            <th className="num" style={{ width: 180 }}>Monto a pagar</th><th>Estado</th>
          </tr></thead>
          <tbody>
            {lista.map((f) => (
              <tr key={f.id} style={sel[f.id] ? { background: "var(--orange-light)" } : undefined}>
                <td><Checkbox on={!!sel[f.id]} onClick={() => toggle(f.id)} /></td>
                <td className="t-strong t-mono">{f.id}</td>
                <td className="t-muted">{f.venc}</td>
                <td className="num t-mono">{MP.COP(f.valor)}</td>
                <td className="num">
                  <div className="money-input">
                    <span>$</span>
                    <input inputMode="numeric" disabled={!sel[f.id]}
                      value={sel[f.id] ? montoDe(f).toLocaleString("es-CO") : ""}
                      placeholder={f.valor.toLocaleString("es-CO")}
                      onChange={(e) => {
                        const v = Math.min(f.valor, Math.max(0, parseInt(e.target.value.replace(/\D/g, "")) || 0));
                        setMontos((m) => ({ ...m, [f.id]: v }));
                      }} />
                  </div>
                </td>
                <td><Pill kind={MP.factEstados[f.estado].pill}>{MP.factEstados[f.estado].label}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
        {lista.length === 0 && <div className="empty">No hay facturas que coincidan con los filtros.</div>}
      </div>
    </>
  );
}
