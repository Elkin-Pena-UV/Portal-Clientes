"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { MP, type Factura } from "@/lib/data";
import { CupoKpis } from "@/components/pagos/cupo-kpis";
import { EstadoCartera } from "@/components/pagos/estado-cartera";
import { PagarFacturas } from "@/components/pagos/pagar-facturas";
import { PagosAnticipos } from "@/components/pagos/pagos-anticipos";
import { HistorialPagos } from "@/components/pagos/historial-pagos";
import { PagoExitoso } from "@/components/pagos/pago-exitoso";

type TabPago = "estado" | "pagar" | "anticipos" | "historial";

const TABS: { id: TabPago; label: string }[] = [
  { id: "estado", label: "Estado de cartera" },
  { id: "pagar", label: "Pagar facturas" },
  { id: "anticipos", label: "Pagos de anticipos" },
  { id: "historial", label: "Historial de pagos" },
];

export function PagosView() {
  const [tab, setTab] = useState<TabPago>("estado");
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [montos, setMontos] = useState<Record<string, number>>({});
  const [paid, setPaid] = useState<number | null>(null);

  const seleccionadas = MP.facturas.filter((f) => sel[f.id]);
  const montoDe = (f: Factura) => (sel[f.id] ? (montos[f.id] != null ? montos[f.id] : f.valor) : 0);
  const totalPagar = seleccionadas.reduce((s, f) => s + montoDe(f), 0);

  if (paid != null) {
    return (
      <PagoExitoso
        totalPagar={paid}
        onVerEstado={() => { setPaid(null); setSel({}); setTab("estado"); }}
      />
    );
  }

  return (
    <div className="content-inner stack">
      <CupoKpis />

      <div className="card">
        <div style={{ padding: "10px 20px 0" }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {TABS.map((tb) => <button key={tb.id} className={"tab" + (tab === tb.id ? " on" : "")} onClick={() => setTab(tb.id)}>{tb.label}</button>)}
          </div>
        </div>

        {tab === "estado" && <EstadoCartera />}
        {tab === "pagar" && (
          <PagarFacturas
            sel={sel} setSel={setSel}
            montos={montos} setMontos={setMontos}
          />
        )}
        {tab === "anticipos" && <PagosAnticipos onPagar={(monto) => setPaid(monto)} />}
        {tab === "historial" && <HistorialPagos />}
      </div>

      {tab === "pagar" && (
        <>
          <div className="paybar">
            <div className="sum">
              <div className="lbl">{seleccionadas.length} factura(s) seleccionada(s)</div>
              <div className="amt">{MP.COP(totalPagar)}</div>
            </div>
            <button className="btn btn-secondary" disabled={totalPagar === 0} onClick={() => setPaid(totalPagar)}><Icon.lock /> Pagar con PSE</button>
          </div>
          <div className="muted-note">
            <Icon.info />Al retornar de la pasarela PSE, la solicitud queda en estado CREATED y se cruza automáticamente cuando la plataforma confirma (OK).
          </div>
        </>
      )}
    </div>
  );
}
