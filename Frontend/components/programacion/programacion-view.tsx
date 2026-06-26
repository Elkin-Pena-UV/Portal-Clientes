"use client";

import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";
import { DiaCard } from "@/components/programacion/dia-card";

export function ProgramacionView() {
  return (
    <div className="content-inner stack">
      <div className="muted-note">
        <Icon.info />Estas son tus entregas confirmadas y programadas. Las entregas tentativas dependen de disponibilidad de flota.
      </div>
      {MP.programacion.map((d) => (
        <DiaCard key={d.dia} dia={d} />
      ))}
    </div>
  );
}
