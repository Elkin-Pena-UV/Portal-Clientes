"use client";

import { Icon } from "@/components/icons";

const CAMPOS: [string, string][] = [
  ["Fecha creación", "rango"], ["Cod", "text"], ["Orden de compra", "text"],
  ["Punto de entrega", "select"], ["Estado", "select"], ["Tipo documento", "select"],
  ["Forma de pago", "select"], ["Moneda", "select"], ["Estado proceso", "select"],
];

export function FiltroGeneralModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="card modal-card" style={{ width: 560 }} onClick={(e) => e.stopPropagation()}>
        <div className="card-head">
          <h3>Filtro general</h3>
          <div className="spacer" />
          <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={onClose}><Icon.x /></button>
        </div>
        <div className="card-pad">
          <div className="field-row" style={{ rowGap: 0 }}>
            {CAMPOS.map(([label, t]) => (
              <div className="field" key={label}>
                <label>{label}</label>
                {t === "select"
                  ? <select className="input"><option>Todos</option></select>
                  : t === "rango"
                  ? <input className="input" type="date" />
                  : <input className="input" placeholder={"Ingrese " + label.toLowerCase()} />}
              </div>
            ))}
          </div>
        </div>
        <div className="card-pad between" style={{ borderTop: "1px solid var(--line)", paddingTop: 16 }}>
          <button className="btn btn-quiet" onClick={onClose}>Limpiar</button>
          <button className="btn btn-primary" onClick={onClose}><Icon.search /> Aplicar filtro</button>
        </div>
      </div>
    </div>
  );
}
