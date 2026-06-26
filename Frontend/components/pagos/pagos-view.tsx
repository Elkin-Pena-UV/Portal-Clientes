"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { MP, type Factura } from "@/lib/data";
import { CupoKpis } from "@/components/pagos/cupo-kpis";
import { PagarCartera } from "@/components/pagos/pagar-cartera";
import { CarteraEdades } from "@/components/pagos/cartera-edades";
import { HistorialPagos } from "@/components/pagos/historial-pagos";
import { SolicitudesPse } from "@/components/pagos/solicitudes-pse";
import { PagoExitoso } from "@/components/pagos/pago-exitoso";

type TabPago = "pagar" | "edades" | "historial" | "solicitudes";

const TABS: { id: TabPago; label: string }[] = [
  { id: "pagar", label: "Pagar cartera" },
  { id: "edades", label: "Cartera por edades" },
  { id: "historial", label: "Historial de pagos" },
  { id: "solicitudes", label: "Solicitudes PSE" },
];

export function PagosView() {
  const [tab, setTab] = useState<TabPago>("pagar");
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [montos, setMontos] = useState<Record<string, number>>({});
  const [antAplic, setAntAplic] = useState<Record<string, boolean>>({});
  const [paid, setPaid] = useState(false);

  const seleccionadas = MP.facturas.filter((f) => sel[f.id]);
  const montoDe = (f: Factura) => (sel[f.id] ? (montos[f.id] != null ? montos[f.id] : f.valor) : 0);
  const totalFacturas = seleccionadas.reduce((s, f) => s + montoDe(f), 0);
  const antAplicado = Math.min(MP.anticipos.filter((a) => antAplic[a.id]).reduce((s, a) => s + a.valor, 0), totalFacturas);
  const totalPagar = Math.max(0, totalFacturas - antAplicado);

  if (paid) {
    return (
      <PagoExitoso
        totalPagar={totalPagar}
        onVerSolicitudes={() => { setPaid(false); setSel({}); setTab("solicitudes"); }}
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

        {tab === "pagar" && (
          <PagarCartera
            sel={sel} setSel={setSel}
            montos={montos} setMontos={setMontos}
            antAplic={antAplic} setAntAplic={setAntAplic}
          />
        )}
        {tab === "edades" && <CarteraEdades />}
        {tab === "historial" && <HistorialPagos />}
        {tab === "solicitudes" && <SolicitudesPse />}
      </div>

      {tab === "pagar" && (
        <>
          <div className="paybar">
            <div className="sum">
              <div className="lbl">{seleccionadas.length} factura(s) · {MP.COP(totalFacturas)}{antAplicado > 0 ? "  − anticipos " + MP.COP(antAplicado) : ""}</div>
              <div className="amt">{MP.COP(totalPagar)}</div>
            </div>
            <button className="btn btn-secondary" disabled={totalPagar === 0} onClick={() => setPaid(true)}><Icon.lock /> Pagar con PSE</button>
          </div>
          <div className="muted-note">
            <Icon.info />Al retornar de la pasarela PSE, la solicitud queda en estado CREATED y se cruza automáticamente cuando la plataforma confirma (OK).
          </div>
        </>
      )}
    </div>
  );
}
