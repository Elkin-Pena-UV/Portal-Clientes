"use client";

import { Fragment, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";
import { Checkbox, DetalleRow, ProdImg } from "@/components/ui";
import { prodThumbSrc, prodThumbSrcLarge } from "@/lib/prodThumb";
import { useToast } from "@/contexts/toast";

export default function CrearOrdenPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);

  // Paso 1 — tipo
  const [tipoProd, setTipoProd] = useState("saco");   // saco | granel
  const [tipoEnt, setTipoEnt] = useState("entrega");  // entrega | retiro

  // Paso 2 — punto de entrega / datos
  const [d2, setD2] = useState({
    sede: MP.sedes[0], punto: MP.puntos[0], dir: "Cra 100 # 11-60, Bodega A · Cali",
    fecha: "2026-06-18", conductor: "", cc: "", placa: "", celular: "", puntoRetiro: "",
  });
  const [touched, setTouched] = useState({});

  // Paso 3 — productos { id: qty }, estibado, adjuntos
  const [cart, setCart] = useState({ "CEM-UG50": 320, "EST-INT": 60 });
  const [estibado, setEstibado] = useState(false);
  const [descargue, setDescargue] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const bulkRef = useRef(null);
  const [modal, setModal] = useState(false);

  const steps = [
    { n: 1, t: "Tipo de entrega", s: "Producto y modalidad" },
    { n: 2, t: "Punto de entrega", s: "Sede y logística" },
    { n: 3, t: "Entregas", s: "Productos y servicios" },
    { n: 4, t: "Resumen", s: "Confirmación final" },
  ];

  function onDone() {
    showToast("Orden enviada — pasó a aprobación de cartera.");
    router.push("/pedidos");
  }

  // -------- validación paso 2 --------
  const e2 = {};
  if (tipoEnt === "entrega") {
    if (touched.conductor && d2.conductor.trim().length < 3) e2.conductor = "Mínimo 3 caracteres.";
    if (touched.cc && !/^\d{6,12}$/.test(d2.cc)) e2.cc = "Documento entre 6 y 12 dígitos.";
    if (touched.placa && !/^[A-Z]{3}\d{2,3}[A-Z]?$/.test(d2.placa.toUpperCase())) e2.placa = "Formato de placa no válido (ej: SVL886).";
    if (touched.celular && !/^3\d{9}$/.test(d2.celular)) e2.celular = "10 dígitos, inicia en 3.";
  } else {
    if (touched.puntoRetiro && d2.puntoRetiro.trim().length < 3) e2.puntoRetiro = "Indica el punto de retiro.";
  }
  const step2valid = tipoEnt === "entrega"
    ? d2.conductor.trim().length >= 3 && /^\d{6,12}$/.test(d2.cc) && /^[A-Z]{3}\d{2,3}[A-Z]?$/.test(d2.placa.toUpperCase()) && /^3\d{9}$/.test(d2.celular)
    : d2.puntoRetiro.trim().length >= 3;

  // -------- carrito --------
  const cartItems = Object.entries(cart).filter(([, q]) => q > 0).map(([id, q]) => ({ ...MP.productos.find((p) => p.id === id), qty: q }));
  const gravado = cartItems.filter((it) => it.gravado).reduce((s, it) => s + it.precio * it.qty, 0);
  const noGravado = cartItems.filter((it) => !it.gravado).reduce((s, it) => s + it.precio * it.qty, 0);
  const estibCost = estibado ? 120000 : 0;
  const descCost = descargue ? 95000 : 0;
  const subtotal = gravado + noGravado + estibCost + descCost;
  const descuento = 0;
  const iva = Math.round((gravado + estibCost + descCost) * 0.19);
  const total = subtotal - descuento + iva;

  const canNext = step === 2 ? step2valid : step === 3 ? cartItems.length > 0 : true;

  function next() {
    if (step === 2 && !step2valid) {
      setTouched(tipoEnt === "entrega" ? { conductor: true, cc: true, placa: true, celular: true } : { puntoRetiro: true });
      return;
    }
    setStep((s) => Math.min(4, s + 1));
  }

  return (
    <div className="content-inner">
      <div className="stepper">
        {steps.map((s, i) => (
          <Fragment key={s.n}>
            <div className={"step" + (step === s.n ? " active" : step > s.n ? " done" : "")}>
              <div className="dot">{step > s.n ? <Icon.check /> : s.n}</div>
              <div className="s-txt"><b>{s.t}</b><span>{s.s}</span></div>
            </div>
            {i < steps.length - 1 && <div className={"step-line" + (step > s.n ? " done" : "")} />}
          </Fragment>
        ))}
      </div>

      {/* ---------------- PASO 1 ---------------- */}
      {step === 1 && (
        <div className="card card-pad">
          <div className="section-title">Seleccione el tipo de producto</div>
          <div className="choice-row" style={{ marginBottom: 26 }}>
            {[
              { id: "saco", t: "Cemento Saco", d: "Presentaciones ensacadas", ic: "box" },
              { id: "granel", t: "Cemento Granel", d: "Despacho a granel por tonelada", ic: "truck" },
            ].map((o) => {
              const Ic = Icon[o.ic];
              return (
                <button key={o.id} className={"choice" + (tipoProd === o.id ? " on" : "")} onClick={() => setTipoProd(o.id)}>
                  <span className="choice-ic"><Ic /></span>
                  <b>{o.t}</b><span>{o.d}</span>
                  {tipoProd === o.id && <span className="choice-chk"><Icon.check /></span>}
                </button>
              );
            })}
          </div>
          <div className="section-title">Seleccione el tipo de entrega</div>
          <div className="choice-row">
            {[
              { id: "entrega", t: "Entrega", d: "San Marcos despacha a tu obra", ic: "truck" },
              { id: "retiro", t: "Retiro", d: "Retiras en planta con tu vehículo", ic: "pin" },
            ].map((o) => {
              const Ic = Icon[o.ic];
              return (
                <button key={o.id} className={"choice" + (tipoEnt === o.id ? " on" : "")} onClick={() => setTipoEnt(o.id)}>
                  <span className="choice-ic"><Ic /></span>
                  <b>{o.t}</b><span>{o.d}</span>
                  {tipoEnt === o.id && <span className="choice-chk"><Icon.check /></span>}
                </button>
              );
            })}
          </div>

          <div className="bulk">
            <div className="bulk-head">
              <span className="bulk-ic"><Icon.sheet /></span>
              <div className="bulk-tx">
                <b>¿Tienes muchos productos?</b>
                <span>Sube tu pedido en Excel o archivo plano y lo cargamos por ti.</span>
              </div>
              <button className="btn btn-ghost btn-sm" type="button"><Icon.download /> Descargar plantilla</button>
            </div>
            <input ref={bulkRef} type="file" accept=".xlsx,.xls,.csv,.txt" hidden
              onChange={(e) => setBulkFile(e.target.files[0] ? e.target.files[0].name : null)} />
            <div className={"dropzone bulk-drop" + (bulkFile ? " filled" : "")} onClick={() => bulkRef.current && bulkRef.current.click()}>
              {bulkFile ? (
                <>
                  <Icon.check />
                  <div><b>{bulkFile}</b> cargado</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Haz clic para reemplazar el archivo</div>
                </>
              ) : (
                <>
                  <Icon.upload />
                  <div><b>Arrastra o selecciona</b> tu archivo de pedido</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Formatos .xlsx, .csv o .txt · máx. 5 MB</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PASO 2 ---------------- */}
      {step === 2 && (
        <div className="card card-pad">
          <div className="section-title">Punto de entrega</div>
          <div className="field-row">
            <div className="field">
              <label>Sede<span className="req">*</span></label>
              <select className="input" value={d2.sede} onChange={(e) => setD2({ ...d2, sede: e.target.value })}>
                {MP.sedes.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Punto de entrega<span className="req">*</span></label>
              <select className="input" value={d2.punto} onChange={(e) => setD2({ ...d2, punto: e.target.value })}>
                {MP.puntos.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Dirección<span className="req">*</span></label>
              <input className="input" value={d2.dir} onChange={(e) => setD2({ ...d2, dir: e.target.value })} />
            </div>
            <div className="field">
              <label>Fecha deseada<span className="req">*</span></label>
              <input className="input" type="date" value={d2.fecha} onChange={(e) => setD2({ ...d2, fecha: e.target.value })} />
            </div>
          </div>

          {tipoEnt === "entrega" ? (
            <>
              <div style={{ borderTop: "1px solid var(--line)", margin: "6px 0 18px" }} />
              <div className="section-title" style={{ fontSize: 14 }}>Datos del conductor (firma digital de entrega)</div>
              <div className="field">
                <label>Nombre del conductor<span className="req">*</span></label>
                <input className={"input" + (e2.conductor ? " err" : "")} placeholder="Ej: Arturo Mosquera"
                  value={d2.conductor} onChange={(e) => setD2({ ...d2, conductor: e.target.value })} onBlur={() => setTouched({ ...touched, conductor: true })} />
                {e2.conductor && <div className="err-msg">{e2.conductor}</div>}
              </div>
              <div className="field-row" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                <div className="field">
                  <label>C.C. conductor<span className="req">*</span></label>
                  <input className={"input" + (e2.cc ? " err" : "")} inputMode="numeric" maxLength={12} placeholder="Cédula"
                    value={d2.cc} onChange={(e) => setD2({ ...d2, cc: e.target.value.replace(/\D/g, "") })} onBlur={() => setTouched({ ...touched, cc: true })} />
                  {e2.cc && <div className="err-msg">{e2.cc}</div>}
                </div>
                <div className="field">
                  <label>Placa vehículo<span className="req">*</span></label>
                  <input className={"input" + (e2.placa ? " err" : "")} maxLength={6} placeholder="SVL886" style={{ textTransform: "uppercase" }}
                    value={d2.placa} onChange={(e) => setD2({ ...d2, placa: e.target.value.toUpperCase() })} onBlur={() => setTouched({ ...touched, placa: true })} />
                  {e2.placa && <div className="err-msg">{e2.placa}</div>}
                </div>
                <div className="field">
                  <label>Celular<span className="req">*</span></label>
                  <input className={"input" + (e2.celular ? " err" : "")} inputMode="numeric" maxLength={10} placeholder="3XXXXXXXXX"
                    value={d2.celular} onChange={(e) => setD2({ ...d2, celular: e.target.value.replace(/\D/g, "") })} onBlur={() => setTouched({ ...touched, celular: true })} />
                  {e2.celular && <div className="err-msg">{e2.celular}</div>}
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ borderTop: "1px solid var(--line)", margin: "6px 0 18px" }} />
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Punto de retiro<span className="req">*</span></label>
                <input className={"input" + (e2.puntoRetiro ? " err" : "")} placeholder="Ej: Planta SC – Báscula 2"
                  value={d2.puntoRetiro} onChange={(e) => setD2({ ...d2, puntoRetiro: e.target.value })} onBlur={() => setTouched({ ...touched, puntoRetiro: true })} />
                {e2.puntoRetiro ? <div className="err-msg">{e2.puntoRetiro}</div> : <div className="hint">El cliente retira la mercancía en planta con su propio transporte.</div>}
              </div>
            </>
          )}
        </div>
      )}

      {/* ---------------- PASO 3 ---------------- */}
      {step === 3 && (
        <div className="stack">
          <div className="muted-note warn">
            <Icon.info />Precios sujetos a verificación por parte del equipo de Servicio al Cliente de Cementos San Marcos.
          </div>
          <div className="card">
            <div className="card-head">
              <h3>Entregas</h3>
              <div className="spacer" />
              <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}><Icon.plus /> Agregar artículo</button>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th style={{ width: 60 }}>Foto</th><th>Producto</th><th>SKU</th><th>Unidad</th><th className="num">Precio</th><th className="num">Cantidad</th><th className="num">Subtotal</th><th></th></tr></thead>
                <tbody>
                  {cartItems.map((it) => (
                    <tr key={it.id}>
                      <td>
                        <ProdImg src={prodThumbSrc(it)} style={{ width: 44, height: 44, borderRadius: 9 }} title="Foto del producto" />
                      </td>
                      <td className="t-strong">{it.nm}</td>
                      <td className="t-muted t-mono">{it.sku}</td>
                      <td className="t-muted">{it.unidad}</td>
                      <td className="num t-mono">{MP.COP(it.precio)}</td>
                      <td className="num">
                        <div className="qty" style={{ display: "inline-flex" }}>
                          <button onClick={() => setCart({ ...cart, [it.id]: Math.max(0, it.qty - 1) })}><Icon.minus /></button>
                          <input value={it.qty} onChange={(e) => setCart({ ...cart, [it.id]: Math.max(0, parseInt(e.target.value) || 0) })} />
                          <button onClick={() => setCart({ ...cart, [it.id]: it.qty + 1 })}><Icon.plus /></button>
                        </div>
                      </td>
                      <td className="num t-mono t-strong">{MP.COP(it.precio * it.qty)}</td>
                      <td><button className="btn btn-quiet btn-sm" onClick={() => setCart({ ...cart, [it.id]: 0 })}><Icon.trash /></button></td>
                    </tr>
                  ))}
                  {cartItems.length === 0 && <tr><td colSpan={8}><div className="empty">No se han añadido artículos. Pulsa “Agregar artículo”.</div></td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid-2-1">
            <div className="card card-pad">
              <div className="section-title" style={{ fontSize: 14 }}>Servicios adicionales</div>
              <label className="row" style={{ cursor: "pointer", gap: 11 }}>
                <Checkbox on={estibado} onClick={() => setEstibado(!estibado)} />
                <span>Estibado <span className="t-muted">(tiene costo adicional · {MP.COP(120000)})</span></span>
              </label>
              <label className="row" style={{ cursor: "pointer", gap: 11, alignItems: "flex-start", marginTop: 12 }}>
                <Checkbox on={descargue} onClick={() => setDescargue(!descargue)} />
                <span style={{ lineHeight: 1.4 }}>
                  Descargue <span className="t-muted">(tiene costo adicional · {MP.COP(95000)})</span>
                  <span className="svc-note">Solo disponible para zonas autorizadas (ej: Valle del Cauca)</span>
                </span>
              </label>
              <div style={{ borderTop: "1px solid var(--line)", margin: "16px 0" }} />
              <div className="section-title" style={{ fontSize: 14 }}>Adjuntos del documento</div>
              <div className="dropzone"><Icon.upload /><div><b>Arrastra o selecciona</b> un archivo</div><div style={{ fontSize: 12, marginTop: 4 }}>PDF, JPG o PNG · máx. 10 MB</div></div>
            </div>
            <div className="card card-pad" style={{ background: "#FBFCFD" }}>
              <div className="section-title" style={{ fontSize: 14 }}>Información</div>
              <ResumenRow label="Gravado" value={MP.COP(gravado)} />
              <ResumenRow label="No gravado" value={MP.COP(noGravado)} />
              <ResumenRow label="Estibado" value={MP.COP(estibCost)} />
              <ResumenRow label="Descargue" value={MP.COP(descCost)} />
              <ResumenRow label="Subtotal" value={MP.COP(subtotal)} />
              <ResumenRow label="Descuento" value={MP.COP(descuento)} />
              <ResumenRow label="IVA (19%)" value={MP.COP(iva)} />
              <div className="between" style={{ padding: "12px 0 2px", marginTop: 6, borderTop: "2px solid var(--line-strong)" }}>
                <b style={{ fontSize: 15 }}>Total</b><b className="t-mono" style={{ fontSize: 21, color: "var(--blue)" }}>{MP.COP(total)}</b>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- PASO 4 ---------------- */}
      {step === 4 && (
        <div className="stack">
          <div className="muted-note" style={{ background: "var(--green-light)", color: "var(--green-ink)" }}>
            <Icon.check />Revisa el resumen antes de enviar. La orden pasará a aprobación de cartera y se generará el código de pedido.
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="card-head"><h3>Entrega</h3></div>
              <div className="card-pad" style={{ paddingTop: 6 }}>
                <DetalleRow label="Tipo de producto" value={tipoProd === "saco" ? "Cemento Saco" : "Cemento Granel"} />
                <DetalleRow label="Tipo de entrega" value={tipoEnt === "entrega" ? "Entrega" : "Retiro"} />
                <DetalleRow label="Sede" value={d2.sede.split("·")[1]} />
                <DetalleRow label="Punto / Dirección" value={d2.punto} />
                <DetalleRow label="Fecha deseada" value={d2.fecha} />
              </div>
            </div>
            <div className="card">
              <div className="card-head"><h3>{tipoEnt === "entrega" ? "Conductor" : "Retiro"}</h3></div>
              <div className="card-pad" style={{ paddingTop: 6 }}>
                {tipoEnt === "entrega" ? (
                  <>
                    <DetalleRow label="Nombre" value={d2.conductor || "—"} />
                    <DetalleRow label="C.C." value={d2.cc || "—"} />
                    <DetalleRow label="Placa" value={d2.placa || "—"} />
                    <DetalleRow label="Celular" value={d2.celular || "—"} />
                  </>
                ) : (
                  <DetalleRow label="Punto de retiro" value={d2.puntoRetiro || "—"} />
                )}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Productos</h3><div className="spacer" /><span className="hint">{cartItems.length} ítem(s)</span></div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th style={{ width: 56 }}>Foto</th><th>Producto</th><th>Unidad</th><th className="num">Cantidad</th><th className="num">Precio</th><th className="num">Subtotal</th></tr></thead>
                <tbody>
                  {cartItems.map((it) => (
                    <tr key={it.id}>
                      <td>
                        <ProdImg src={prodThumbSrc(it)} style={{ width: 40, height: 40, borderRadius: 9 }} />
                      </td>
                      <td className="t-strong">{it.nm}</td>
                      <td className="t-muted">{it.unidad}</td>
                      <td className="num t-mono">{it.qty}</td>
                      <td className="num t-mono">{MP.COP(it.precio)}</td>
                      <td className="num t-mono t-strong">{MP.COP(it.precio * it.qty)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-pad" style={{ borderTop: "1px solid var(--line)" }}>
              <div className="between" style={{ padding: "3px 0" }}><span className="t-muted">Subtotal</span><span className="t-mono">{MP.COP(subtotal)}</span></div>
              <div className="between" style={{ padding: "3px 0" }}><span className="t-muted">IVA (19%)</span><span className="t-mono">{MP.COP(iva)}</span></div>
              <div className="between" style={{ padding: "8px 0 0", marginTop: 6, borderTop: "1px solid var(--line)" }}><b style={{ fontSize: 16 }}>Total con IVA</b><b className="t-mono" style={{ fontSize: 20, color: "var(--blue)" }}>{MP.COP(total)}</b></div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Footer nav ---------------- */}
      <div className="between" style={{ marginTop: 24 }}>
        <button className="btn btn-ghost" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}><Icon.chevL /> Atrás</button>
        <div className="row">
          <span className="hint">Paso {step} de 4</span>
          {step < 4
            ? <button className="btn btn-primary" disabled={!canNext} onClick={next}>Continuar <Icon.arrowR /></button>
            : <button className="btn btn-primary" onClick={onDone}><Icon.check /> Enviar orden</button>}
        </div>
      </div>

      {modal && <ArticulosModal cart={cart} setCart={setCart} onClose={() => setModal(false)} />}
    </div>
  );
}

function ResumenRow({ label, value }) {
  return (
    <div className="between" style={{ padding: "5px 0" }}>
      <span className="t-muted" style={{ textTransform: "uppercase", letterSpacing: ".03em", fontWeight: 700, fontSize: 11.5 }}>{label}</span>
      <span className="t-mono" style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function ArticulosModal({ cart, setCart, onClose }) {
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState({});
  const lista = MP.productos.filter((p) => (p.nm + p.sku).toLowerCase().includes(q.toLowerCase()));
  function agregar() {
    const next = { ...cart };
    Object.entries(draft).forEach(([id, n]) => { if (n > 0) next[id] = (next[id] || 0) + n; });
    setCart(next); onClose();
  }
  const totalDraft = Object.values(draft).reduce((a, b) => a + (b || 0), 0);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="card modal-card" style={{ width: 720 }} onClick={(e) => e.stopPropagation()}>
        <div className="card-head">
          <h3>Artículos</h3>
          <div className="spacer" />
          <div className="search"><Icon.search /><input placeholder="Búsqueda rápida por nombre o SKU…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose}><Icon.x /></button>
        </div>
        <div className="prodsel-wrap">
          <div className="prodsel-grid">
            {lista.map((p) => {
              const n = draft[p.id] || 0;
              return (
                <div className={"prodsel-card" + (n > 0 ? " on" : "")} key={p.id}>
                  <div className="ps-img">
                    <ProdImg src={prodThumbSrcLarge(p)} style={{ width: "100%", height: "100%" }} title="Foto del producto" />
                  </div>
                  <div className="ps-body">
                    <div className="ps-nm">{p.nm}</div>
                    <div className="ps-sku">{p.sku} · {p.unidad}</div>
                    <div className="ps-foot">
                      <span className="ps-price t-mono">{MP.COP(p.precio)}</span>
                      <div className="qty">
                        <button onClick={() => setDraft({ ...draft, [p.id]: Math.max(0, n - 1) })}><Icon.minus /></button>
                        <input inputMode="numeric" value={n || ""} placeholder="0"
                          onChange={(e) => setDraft({ ...draft, [p.id]: Math.max(0, parseInt(e.target.value) || 0) })} />
                        <button onClick={() => setDraft({ ...draft, [p.id]: n + 1 })}><Icon.plus /></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {lista.length === 0 && <div className="empty" style={{ gridColumn: "1 / -1" }}>Sin resultados para “{q}”.</div>}
          </div>
        </div>
        <div className="card-pad between" style={{ borderTop: "1px solid var(--line)" }}>
          <span className="hint">{totalDraft > 0 ? totalDraft + " unidad(es) por agregar" : "Indica las cantidades a agregar"}</span>
          <div className="row">
            <button className="btn btn-quiet" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" disabled={totalDraft === 0} onClick={agregar}><Icon.plus /> Agregar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
