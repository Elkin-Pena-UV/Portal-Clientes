"use client";

import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";

export function PagoExitoso({ totalPagar, onVerSolicitudes }: {
  totalPagar: number;
  onVerSolicitudes: () => void;
}) {
  return (
    <div className="content-inner">
      <div className="card card-pad" style={{ textAlign: "center", padding: "56px 32px", maxWidth: 560, margin: "10px auto" }}>
        <div className="k-ic" style={{ width: 60, height: 60, borderRadius: 16, background: "var(--green-light)", color: "var(--green-ink)", margin: "0 auto 18px" }}><Icon.check style={{ width: 30, height: 30 }} /></div>
        <h2 style={{ margin: "0 0 8px", fontSize: 23, fontWeight: 800 }}>Pago registrado</h2>
        <p className="t-muted" style={{ maxWidth: "48ch", margin: "0 auto 6px" }}>Tu pago por <b style={{ color: "var(--ink)" }}>{MP.COP(totalPagar)}</b> fue recibido vía PSE y la solicitud quedó en estado <b style={{ color: "var(--ink)" }}>CREATED</b>.</p>
        <p className="t-muted" style={{ maxWidth: "52ch", margin: "0 auto 24px", fontSize: 13.5 }}>Al confirmarse en la plataforma, el documento se cruza automáticamente y libera cupo.</p>
        <button className="btn btn-ghost" onClick={onVerSolicitudes}>Ver solicitudes PSE</button>
      </div>
    </div>
  );
}
