import { Icon } from "@/components/icons";
import { MP } from "@/lib/data";

export function Footer() {
  return (
    <footer className="appfoot">
      <div className="af-inner">
        <div className="af-brand">
          <b>{MP.empresa.nombre}</b>
          <div className="af-line"><Icon.pin /> {MP.empresa.direccion} · {MP.empresa.ciudad}</div>
          <div className="af-line"><Icon.phone /> {MP.empresa.pbx} · NIT {MP.empresa.nit}</div>
        </div>
        <div className="af-links">
          <a href="#">Política de privacidad</a>
          <a href="#">Términos de uso</a>
          <span className="af-copy">© 2026 Cementos San Marcos S.A.S. — Todos los derechos reservados</span>
        </div>
      </div>
    </footer>
  );
}
