"use client";

import { Icon } from "@/components/icons";
import { MP, type DocRemision } from "@/lib/data";
import { Pill, Checkbox } from "@/components/shared/primitives";

export function RemisionesTable({ sel, onToggle, onPreview }: {
  sel: Record<string, boolean>;
  onToggle: (id: string) => void;
  onPreview: (doc: DocRemision) => void;
}) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead><tr><th style={{ width: 44 }}></th><th>Emisión</th><th>Tipo</th><th>Documento</th><th>Pedido</th><th>Firma digital</th><th className="num">Valor</th><th></th></tr></thead>
        <tbody>
          {MP.docsRemisiones.map((d) => (
            <tr key={d.id} style={sel[d.id] ? { background: "var(--orange-light)" } : undefined}>
              <td><Checkbox on={!!sel[d.id]} onClick={() => onToggle(d.id)} /></td>
              <td className="t-muted">{d.emision}</td>
              <td><Pill kind={d.tipo === "Remisión" ? "orange" : "gray"} dot={false}>{d.tipo}</Pill></td>
              <td className="t-strong t-mono">{d.id}</td>
              <td className="t-muted t-mono">{d.pedido}</td>
              <td><Pill kind={MP.firmaEstados[d.firma].pill}>{MP.firmaEstados[d.firma].label}</Pill></td>
              <td className="num t-mono" style={{ color: d.valor < 0 ? "var(--red-ink)" : "var(--ink)" }}>{(d.valor < 0 ? "−" : "") + MP.COP(Math.abs(d.valor))}</td>
              <td><button className="btn btn-quiet btn-sm" onClick={() => onPreview(d)}><Icon.eye /> Vista previa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
