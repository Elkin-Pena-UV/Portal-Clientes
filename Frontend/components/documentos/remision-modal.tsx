"use client";

import { Icon } from "@/components/icons";
import { MP, type DocRemision } from "@/lib/data";
import { Pill, DetalleRow } from "@/components/shared/primitives";

export function RemisionModal({ doc, onClose }: { doc: DocRemision; onClose: () => void }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="card modal-card" style={{ width: 460 }} onClick={(e) => e.stopPropagation()}>
        <div className="card-head">
          <h3>{doc.tipo} digital</h3>
          <Pill kind="orange" dot={false}>{doc.codigo}</Pill>
          <div className="spacer" />
          <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose}><Icon.x /></button>
        </div>
        <div className="card-pad">
          <DetalleRow label="Documento" value={doc.id} />
          <DetalleRow label="Pedido" value={doc.pedido} />
          <DetalleRow label="Nombre del receptor" value={doc.receptor} />
          <DetalleRow label="Celular del receptor" value={doc.cel} />
          <DetalleRow label="Fecha y hora de entrega" value={doc.hora} />
          <DetalleRow label="Código del documento" value={doc.codigo} />
          <div className="between" style={{ padding: "12px 0 2px" }}>
            <span className="t-muted" style={{ fontSize: 13 }}>Estado firma digital</span>
            <Pill kind={MP.firmaEstados[doc.firma].pill}>{doc.firma === "ok" ? "Capturada y validada" : "Pendiente"}</Pill>
          </div>
          <button className="btn btn-primary btn-block" style={{ marginTop: 16 }}><Icon.download /> Descargar {doc.tipo.toLowerCase()} (PDF)</button>
        </div>
      </div>
    </div>
  );
}
