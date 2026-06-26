"use client";

import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";
import { Pill, Checkbox } from "@/components/shared/primitives";

export function FacturasTable({ sel, onToggle }: {
  sel: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead><tr><th style={{ width: 44 }}></th><th>Emisión</th><th>FN</th><th>Documento</th><th>Pedido</th><th>Orden de Compra</th><th>NIT</th><th className="num">Valor</th><th></th></tr></thead>
        <tbody>
          {MP.docsFacturas.map((d) => (
            <tr key={d.id} style={sel[d.id] ? { background: "var(--orange-light)" } : undefined}>
              <td><Checkbox on={!!sel[d.id]} onClick={() => onToggle(d.id)} /></td>
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
  );
}
