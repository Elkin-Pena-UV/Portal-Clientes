"use client";

import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";
import { Pill, Checkbox } from "@/components/shared/primitives";

export function FacturasTable({ sel, onToggle, onToggleAll }: {
  sel: Record<string, boolean>;
  onToggle: (id: string) => void;
  onToggleAll: (keys: string[], value: boolean) => void;
}) {
  // El FVE no es único: una factura puede tener varios PVC/OC y aparece
  // "duplicada" (una fila por pedido). Usamos id+pedido como clave de fila.
  const rows = MP.docsFacturas.map((d) => ({ d, key: `${d.id}__${d.pedido}` }));
  const allOn = rows.length > 0 && rows.every((r) => sel[r.key]);

  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead><tr><th style={{ width: 44 }}><Checkbox on={allOn} onClick={() => onToggleAll(rows.map((r) => r.key), !allOn)} /></th><th>Emisión</th><th>FN</th><th>Documento</th><th>Pedido</th><th>Orden de Compra</th><th>NIT</th><th className="num">Valor</th><th></th></tr></thead>
        <tbody>
          {rows.map(({ d, key: rowKey }) => {
            return (
            <tr key={rowKey} style={sel[rowKey] ? { background: "var(--orange-light)" } : undefined}>
              <td><Checkbox on={!!sel[rowKey]} onClick={() => onToggle(rowKey)} /></td>
              <td className="t-muted">{d.emision}</td>
              <td><Pill kind={d.fn === "FVE" ? "blue" : d.fn === "NC" ? "yellow" : "gray"} dot={false}>{d.fn}</Pill></td>
              <td><div className="t-strong t-mono">{d.id}</div><div className="t-muted" style={{ fontSize: 12.5 }}>{d.doc}</div></td>
              <td className="t-muted t-mono">{d.pedido}</td>
              <td className="t-muted t-mono">{d.oc}</td>
              <td className="t-muted t-mono">{d.nit}</td>
              <td className="num t-mono" style={{ color: d.valor < 0 ? "var(--red-ink)" : "var(--ink)" }}>{(d.valor < 0 ? "−" : "") + MP.COP(Math.abs(d.valor))}</td>
              <td><button className="btn btn-quiet btn-sm"><Icon.download /> PDF</button></td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
