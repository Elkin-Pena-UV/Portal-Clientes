"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { MA, type UsuarioAdmin } from "@/lib/admin/data";
import { Pill } from "@/components/shared/primitives";
import { Switch } from "@/components/ui/switch";
import { useAdmin } from "@/components/admin/admin-provider";
import { UsuarioFormSheet } from "@/components/admin/usuario-form-sheet";

function iniciales(nombre: string): string {
  return nombre.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function ParametrosCard() {
  const { parametros, guardarParametros } = useAdmin();
  const [correo, setCorreo] = useState(parametros.correoNotificaciones);
  const [horaCorte, setHoraCorte] = useState(parametros.horaCorte);
  const [permitirSedes, setPermitirSedes] = useState(parametros.permitirSedesClientes);

  useEffect(() => {
    setCorreo(parametros.correoNotificaciones);
    setHoraCorte(parametros.horaCorte);
    setPermitirSedes(parametros.permitirSedesClientes);
  }, [parametros]);

  const sinCambios =
    correo === parametros.correoNotificaciones &&
    horaCorte === parametros.horaCorte &&
    permitirSedes === parametros.permitirSedesClientes;

  return (
    <div className="card card-pad">
      <b style={{ fontSize: 15 }}>Parámetros del portal</b>
      <div className="t-muted" style={{ fontSize: 12.5, marginTop: 2, marginBottom: 14 }}>
        Configuración propia del portal — no requiere procedimientos en el ERP.
      </div>
      <div className="field">
        <label>Correo de notificaciones</label>
        <input className="input" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <div className="hint">Recibe los avisos de pedidos nuevos y sedes por aprobar.</div>
      </div>
      <div className="field">
        <label>Hora de corte de pedidos</label>
        <input className="input" type="time" value={horaCorte} onChange={(e) => setHoraCorte(e.target.value)} />
        <div className="hint">Los pedidos creados después se programan al siguiente día hábil.</div>
      </div>
      <div className="between" style={{ padding: "6px 0 14px" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13 }}>Registro de sedes por clientes</div>
          <div className="t-muted" style={{ fontSize: 12 }}>Permite solicitar sedes nuevas desde el portal de clientes.</div>
        </div>
        <Switch checked={permitirSedes} onCheckedChange={setPermitirSedes} aria-label="Registro de sedes por clientes" />
      </div>
      <button
        className="btn btn-primary btn-block"
        disabled={sinCambios || !correo.trim()}
        onClick={() => guardarParametros({ correoNotificaciones: correo.trim(), horaCorte, permitirSedesClientes: permitirSedes })}
      >
        <Icon.check /> Guardar parámetros
      </button>
    </div>
  );
}

export function ConfiguracionView() {
  const { usuarios, toggleActivoUsuario } = useAdmin();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editando, setEditando] = useState<UsuarioAdmin | null>(null);

  const abrir = (u: UsuarioAdmin | null) => {
    setEditando(u);
    setSheetOpen(true);
  };

  return (
    <div className="content-inner stack">
      <div className="grid-2-1">
        <div className="card">
          <div className="card-head">
            <h3>Usuarios administradores</h3>
            <div className="spacer" />
            <button className="btn btn-primary btn-sm" onClick={() => abrir(null)}><Icon.plus /> Nuevo usuario</button>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Usuario</th><th>Rol</th><th>Último acceso</th><th>Activo</th><th></th></tr></thead>
              <tbody>
                {usuarios.map((u) => {
                  const esSesionActual = u.correo === MA.adminUser.correo;
                  return (
                    <tr key={u.id} style={u.activo ? undefined : { opacity: 0.55 }}>
                      <td>
                        <div className="row" style={{ gap: 10 }}>
                          <div className="avatar" style={{ flex: "none" }}>{iniciales(u.nombre)}</div>
                          <div>
                            <div className="t-strong">{u.nombre}{esSesionActual && <span className="t-muted" style={{ fontWeight: 600 }}> · tú</span>}</div>
                            <div className="t-muted" style={{ fontSize: 12 }}>{u.correo}</div>
                          </div>
                        </div>
                      </td>
                      <td><Pill kind={MA.rolesAdmin[u.rol].pill} dot={false}>{MA.rolesAdmin[u.rol].label}</Pill></td>
                      <td className="t-muted" style={{ fontSize: 12.5 }}>{u.ultimoAcceso}</td>
                      <td>
                        <Switch
                          checked={u.activo}
                          onCheckedChange={() => toggleActivoUsuario(u.id)}
                          disabled={esSesionActual}
                          aria-label={"Acceso de " + u.nombre}
                        />
                      </td>
                      <td><button className="btn btn-quiet btn-sm" onClick={() => abrir(u)}><Icon.pen /> Editar</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="card-pad" style={{ paddingTop: 10, paddingBottom: 12 }}>
            <span className="hint">No puedes desactivar tu propia sesión · los roles limitan las secciones que cada usuario gestiona</span>
          </div>
        </div>

        <ParametrosCard />
      </div>

      <UsuarioFormSheet open={sheetOpen} onOpenChange={setSheetOpen} usuario={editando} />
    </div>
  );
}
