"use client";

import { useState } from "react";
import { Lock, Wallet } from "lucide-react";
import { usePortal } from "@/components/portal-provider";
import { SedeCombobox } from "@/components/ordenes/sede-combobox";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MP } from "@/lib/data";

export function PagosAnticipos({ onPagar }: { onPagar: (monto: number) => void }) {
  const { getSede } = usePortal();
  const [sedeId, setSedeId] = useState("");
  const [monto, setMonto] = useState(0);

  const sede = sedeId ? getSede(sedeId) : undefined;

  return (
    <div className="p-5 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Wallet className="size-4" />
          </span>
          <h4 className="text-base font-semibold text-foreground">Realizar anticipo</h4>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          Selecciona la sede y el valor que deseas anticipar. El pago se realiza en línea a través de PSE.
        </p>

        <div className="rounded-xl border bg-muted/30 p-4 sm:p-5">
          <FieldGroup>
            <Field data-invalid={false}>
              <FieldLabel>Sede a la que harás el anticipo</FieldLabel>
              <SedeCombobox
                value={sedeId}
                onChange={setSedeId}
                placeholder="Selecciona una sede"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="monto-anticipo">Valor del anticipo</FieldLabel>
              <div className="relative max-w-[240px]">
                <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  id="monto-anticipo"
                  inputMode="numeric"
                  placeholder="0"
                  className="pl-6 font-medium tabular-nums"
                  value={monto ? monto.toLocaleString("es-CO") : ""}
                  onChange={(e) => setMonto(Math.max(0, parseInt(e.target.value.replace(/\D/g, "")) || 0))}
                />
              </div>
              <FieldDescription>
                Queda disponible para aplicar a futuras facturas una vez la plataforma confirma el recaudo (OK).
              </FieldDescription>
            </Field>
          </FieldGroup>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs text-muted-foreground">
              {sede ? `${sede.nombre} · ${sede.ciudad}` : "Selecciona una sede"}
            </div>
            <div className="text-2xl font-bold tracking-tight text-brand tabular-nums">{MP.COP(monto)}</div>
          </div>
          <Button
            size="lg"
            disabled={!sedeId || monto === 0}
            onClick={() => onPagar(monto)}
          >
            <Lock /> Pagar anticipo con PSE
          </Button>
        </div>
      </div>
    </div>
  );
}
