"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { MP, type Factura } from "@/lib/data";
import { Pill, Checkbox } from "@/components/ui";

type TabPago = "pagar" | "edades" | "historial" | "solicitudes";

export default function PagosPage() {
  const [tab, setTab] = useState<TabPago>("pagar");
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [montos, setMontos] = useState<Record<string, number>>({});
  const [antAplic, setAntAplic] = useState<Record<string, boolean>>({});
  const [paid, setPaid] = useState(false);
  const pct = Math.round((MP.cupo.utilizado / MP.cupo.total) * 100);

  const seleccionadas = MP.facturas.filter((f) => sel[f.id]);
  const montoDe = (f: Factura) => (sel[f.id] ? (montos[f.id] != null ? montos[f.id] : f.valor) : 0);
  const totalFacturas = seleccionadas.reduce((s, f) => s + montoDe(f), 0);
  const antDisponible = MP.anticipos.reduce((s, a) => s + a.valor, 0);
  const antAplicado = Math.min(MP.anticipos.filter((a) => antAplic[a.id]).reduce((s, a) => s + a.valor, 0), totalFacturas);
  const totalPagar = Math.max(0, totalFacturas - antAplicado);
  const toggle = (id: string) => setSel((s) => ({ ...s, [id]: !s[id] }));
  const toggleAnt = (id: string) => setAntAplic((s) => ({ ...s, [id]: !s[id] }));
  const allOn = MP.facturas.every((f) => sel[f.id]);
  const toggleAll = () => { const v = !allOn; const n: Record<string, boolean> = {}; MP.facturas.forEach((f) => (n[f.id] = v)); setSel(n); };
  const maxEdad = Math.max(...MP.cartera.edades.map((e) => e.valor));

  const tabs: { id: TabPago; label: string }[] = [
    { id: "pagar", label: "Pagar cartera" },
    { id: "edades", label: "Cartera por edades" },
    { id: "historial", label: "Historial de pagos" },
    { id: "solicitudes", label: "Solicitudes PSE" },
  ];

  if (paid) {
    return (
      <div className="content-inner">
        <div className="card card-pad" style={{ textAlign: "center", padding: "56px 32px", maxWidth: 560, margin: "10px auto" }}>
          <div className="k-ic" style={{ width: 60, height: 60, borderRadius: 16, background: "var(--green-light)", color: "var(--green-ink)", margin: "0 auto 18px" }}><Icon.check style={{ width: 30, height: 30 }} /></div>
          <h2 style={{ margin: "0 0 8px", fontSize: 23, fontWeight: 800 }}>Pago registrado</h2>
          <p className="t-muted" style={{ maxWidth: "48ch", margin: "0 auto 6px" }}>Tu pago por <b style={{ color: "var(--ink)" }}>{MP.COP(totalPagar)}</b> fue recibido vía PSE y la solicitud quedó en estado <b style={{ color: "var(--ink)" }}>CREATED</b>.</p>
          <p className="t-muted" style={{ maxWidth: "52ch", margin: "0 auto 24px", fontSize: 13.5 }}>Al confirmarse en la plataforma, el documento se cruza automáticamente y libera cupo.</p>
          <button className="btn btn-ghost" onClick={() => { setPaid(false); setSel({}); setTab("solicitudes"); }}>Ver solicitudes PSE</button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-inner stack">
      <div className="kpi-row">
        <div className="kpi blue">
          <div className="k-top"><span className="k-ic"><Icon.shield /></span>Cupo total asignado</div>
          <div className="k-val">{MP.COP(MP.cupo.total)}</div>
        </div>
        <div className="kpi orange">
          <div className="k-top"><span className="k-ic"><Icon.wallet /></span>Cupo utilizado</div>
          <div className="k-val">{MP.COP(MP.cupo.utilizado)}</div>
          <div className="k-sub">{pct}% del total</div>
        </div>
        <div className="kpi blue">
          <div className="k-top"><span className="k-ic"><Icon.bolt /></span>Cupo disponible</div>
          <div className="k-val">{MP.COP(MP.cupo.disponible)}</div>
        </div>
      </div>

      <div className="card">
        <div style={{ padding: "10px 20px 0" }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {tabs.map((tb) => <button key={tb.id} className={"tab" + (tab === tb.id ? " on" : "")} onClick={() => setTab(tb.id)}>{tb.label}</button>)}
          </div>
        </div>

        {/* PAGAR */}
        {tab === "pagar" && (
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
        )}

        {/* CARTERA POR EDADES */}
        {tab === "edades" && (
          <div className="card-pad">
            {MP.cartera.edades.map((e) => (
              <div key={e.rango} style={{ marginBottom: 16 }}>
                <div className="between" style={{ marginBottom: 7 }}>
                  <div className="row" style={{ gap: 9 }}><Pill kind={e.pill} dot={true}>{e.rango}</Pill></div>
                  <b className="t-mono">{MP.COP(e.valor)}</b>
                </div>
                <div className={"progress" + (e.pill === "red" ? " crit" : e.pill === "yellow" ? " warn" : "")}><span style={{ width: (e.valor / maxEdad * 100) + "%" }} /></div>
              </div>
            ))}
            <div className="between" style={{ paddingTop: 14, marginTop: 6, borderTop: "2px solid var(--line-strong)" }}>
              <b style={{ fontSize: 15 }}>Cartera total</b>
              <b className="t-mono" style={{ fontSize: 20, color: "var(--blue)" }}>{MP.COP(MP.cartera.total)}</b>
            </div>
          </div>
        )}

        {/* HISTORIAL DE PAGOS */}
        {tab === "historial" && (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Registro</th><th>Motivo</th><th>Código</th><th>Estado</th><th>Fecha</th><th className="num">Valor</th><th>Moneda</th><th>Origen</th></tr></thead>
              <tbody>
                {MP.pagos.map((p, i) => (
                  <tr key={i}>
                    <td className="t-muted t-mono">{p.reg}</td>
                    <td><Pill kind="gray" dot={false}>{p.motivo}</Pill></td>
                    <td className="t-mono">{p.codigo}</td>
                    <td><Pill kind={MP.pagoEstados[p.estado].pill} dot={false}>{MP.pagoEstados[p.estado].label}</Pill></td>
                    <td className="t-muted">{p.fecha}</td>
                    <td className="num t-mono t-strong">{MP.COP(p.valor)}</td>
                    <td className="t-muted">{p.moneda}</td>
                    <td className="t-muted" style={{ fontSize: 12.5 }}>{p.site}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SOLICITUDES PSE */}
        {tab === "solicitudes" && (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>N.º</th><th>Fecha creación</th><th className="num">Valor</th><th>Proceso</th><th>Descripción</th><th>Estado</th><th>Pasarela</th><th>Estado plataforma</th><th>Recaudo</th><th>Expira</th></tr></thead>
              <tbody>
                {MP.solicitudes.map((s) => (
                  <tr key={s.id}>
                    <td className="t-strong t-mono">{s.id}</td>
                    <td className="t-muted t-mono">{s.fecha}</td>
                    <td className="num t-mono">{MP.COP(s.valor)}</td>
                    <td><Pill kind="gray" dot={false}>{s.proceso}</Pill></td>
                    <td className="t-muted" style={{ fontSize: 12.5 }}>{s.desc}</td>
                    <td><Pill kind={MP.pagoEstados[s.estado].pill} dot={false}>{MP.pagoEstados[s.estado].label}</Pill></td>
                    <td className="t-mono">{s.pasarela}</td>
                    <td><Pill kind={MP.platEstados[s.plataforma]} dot={false}>{s.plataforma}</Pill></td>
                    <td className="t-mono">{s.recaudo}</td>
                    <td className="t-muted t-mono" style={{ fontSize: 12 }}>{s.expira}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
