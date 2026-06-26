"use client";

import type { Dispatch, SetStateAction } from "react";
import { MP, type Factura } from "@/lib/data";
import { Pill, Checkbox } from "@/components/shared/primitives";

export function PagarCartera({ sel, setSel, montos, setMontos, antAplic, setAntAplic }: {
  sel: Record<string, boolean>;
  setSel: Dispatch<SetStateAction<Record<string, boolean>>>;
  montos: Record<string, number>;
  setMontos: Dispatch<SetStateAction<Record<string, number>>>;
  antAplic: Record<string, boolean>;
  setAntAplic: Dispatch<SetStateAction<Record<string, boolean>>>;
}) {
  const antDisponible = MP.anticipos.reduce((s, a) => s + a.valor, 0);
  const montoDe = (f: Factura) => (sel[f.id] ? (montos[f.id] != null ? montos[f.id] : f.valor) : 0);
  const allOn = MP.facturas.every((f) => sel[f.id]);

  const toggle = (id: string) => setSel((s) => ({ ...s, [id]: !s[id] }));
  const toggleAnt = (id: string) => setAntAplic((s) => ({ ...s, [id]: !s[id] }));
  const toggleAll = () => {
    const v = !allOn;
    const n: Record<string, boolean> = {};
    MP.facturas.forEach((f) => (n[f.id] = v));
    setSel(n);
  };

  return (
    <>
      <div className="card-pad" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="between" style={{ marginBottom: 12 }}>
          <div className="section-title" style={{ fontSize: 14, margin: 0 }}>Anticipos disponibles para aplicar</div>
          <span className="pill green" style={{ fontWeight: 800 }}>{MP.COP(antDisponible)} disponibles</span>
        </div>
        <div className="ant-grid">
          {MP.anticipos.map((a) => (
            <button key={a.id} type="button" className={"ant-card" + (antAplic[a.id] ? " on" : "")} onClick={() => toggleAnt(a.id)}>
              <Checkbox on={!!antAplic[a.id]} onClick={() => toggleAnt(a.id)} />
              <div className="ant-tx">
                <b className="t-mono">{MP.COP(a.valor)}</b>
                <span>{a.id} · {a.fecha}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr>
            <th style={{ width: 44 }}><Checkbox on={allOn} onClick={toggleAll} /></th>
            <th>N.º factura</th><th>Vencimiento</th><th className="num">Saldo</th>
            <th className="num" style={{ width: 180 }}>Monto a pagar</th><th>Estado</th>
          </tr></thead>
          <tbody>
            {MP.facturas.map((f) => (
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
      </div>
    </>
  );
}
