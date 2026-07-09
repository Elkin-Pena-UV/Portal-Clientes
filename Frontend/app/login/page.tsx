"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";
import { MA } from "@/lib/admin/data";
import { MLogo } from "@/components/shared/primitives";
import { useAuth, type Rol } from "@/contexts/auth";

const HOME: Record<Rol, string> = { cliente: "/inicio", admin: "/admin" };

export default function LoginPage() {
  const router = useRouter();
  const { authed, ready, rol, login } = useAuth();
  const [tipo, setTipo] = useState<Rol>("cliente");
  const [email, setEmail] = useState("mrestrepo@constpacifico.co");
  const [pass, setPass] = useState("••••••••••");

  useEffect(() => {
    if (ready && authed) router.replace(HOME[rol ?? "cliente"]);
  }, [ready, authed, rol, router]);

  function cambiarTipo(t: Rol) {
    setTipo(t);
    setEmail(t === "admin" ? MA.adminUser.correo : "mrestrepo@constpacifico.co");
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    login(tipo);
    router.replace(HOME[tipo]);
  }

  return (
    <div className="login">
      <div className="login-brand">
        <div className="lb-orb" /><div className="lb-orb two" />
        <div className="lb-logo">
          <div className="m"><MLogo size={25} /></div>
          <b>Cementos San Marcos</b>
        </div>
        <div className="lb-mid">
          <h2>Tu portal de clientes, en un solo lugar</h2>
          <p>Crea órdenes, programa tus entregas, paga tu cartera con PSE y descarga tus facturas y remisiones firmadas digitalmente.</p>
          <div className="lb-feats">
            <div className="lb-feat"><div className="fi"><Icon.truck /></div>Seguimiento de despachos en tiempo real</div>
            <div className="lb-feat"><div className="fi"><Icon.wallet /></div>Pago de cartera en línea vía PSE</div>
            <div className="lb-feat"><div className="fi"><Icon.shield /></div>Remisiones con firma digital del receptor</div>
          </div>
        </div>
        <div className="lb-foot">{MP.empresa.ciudad} · {MP.empresa.pbx}</div>
      </div>
      <div className="login-form">
        <form className="lf-inner" onSubmit={submit}>
          <h1>Inicia sesión</h1>
          <p className="lf-sub">Ingresa con las credenciales de tu empresa.</p>
          <div className="tabs" style={{ marginBottom: 18 }}>
            <button type="button" className={"tab" + (tipo === "cliente" ? " on" : "")} onClick={() => cambiarTipo("cliente")}>Cliente</button>
            <button type="button" className={"tab" + (tipo === "admin" ? " on" : "")} onClick={() => cambiarTipo("admin")}>Administrador</button>
          </div>
          <div className="lf-demo">
            <Icon.info />
            {tipo === "admin"
              ? "Prototipo de demostración — pulsa “Ingresar” para entrar al portal administrativo."
              : "Prototipo de demostración — pulsa “Ingresar” para entrar al portal."}
          </div>
          <div className="field">
            <label>Correo corporativo</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input className="input" type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-block" type="submit" style={{ marginTop: 6 }}>
            Ingresar <Icon.arrowR />
          </button>
          <div className="lf-meta">¿Olvidaste tu contraseña? Contacta a tu asesor comercial.</div>
        </form>
      </div>
    </div>
  );
}
