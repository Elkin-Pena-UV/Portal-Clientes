/* Cementos San Marcos — primitivos compartidos (Pill, Checkbox, ProdImg, etc.) */
import React from "react";
import { Icon } from "@/components/icons";
import { PROD_CATS, prodCat, type ProdLike } from "@/lib/prodThumb";
import type { PillKind } from "@/lib/data";

export function MLogo({ size = 21 }: { size?: number }) {
  // Marca: saco/montaña estilizada
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 20 9 7l3 5 3-5 5 13" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 20h9" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}

export function Pill({ kind, children, dot = true }: { kind: PillKind; children: React.ReactNode; dot?: boolean }) {
  return <span className={"pill " + kind}>{dot && <span className="dt" />}{children}</span>;
}

export function Checkbox({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <div className={"checkbox" + (on ? " on" : "")} onClick={onClick}><Icon.check /></div>;
}

export function ProdThumb({ prod, size = 44 }: { prod: ProdLike; size?: number }) {
  const cat = PROD_CATS[prodCat(prod)];
  const Ic = Icon[cat.icon];
  return (
    <span className={"prod-thumb " + cat.cls} style={{ width: size, height: size }} title={cat.label}>
      <Ic />
    </span>
  );
}

/* Reemplaza al <image-slot> del prototipo: imagen del producto con el
   placeholder SVG por defecto (object-fit cover para llenar el contenedor). */
export function ProdImg({ src, alt = "", className, style, title }: {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      title={title}
      className={className}
      style={{ objectFit: "cover", display: "block", ...style }}
    />
  );
}

export function DetalleRow({ label, value, strong }: { label: React.ReactNode; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className="between" style={{ padding: "9px 0", borderBottom: "1px solid var(--line)" }}>
      <span className="t-muted" style={{ fontSize: 13 }}>{label}</span>
      <span style={{ fontWeight: strong ? 800 : 700, fontSize: 14, color: strong ? "var(--blue)" : "var(--ink)", textAlign: "right" }}>{value}</span>
    </div>
  );
}
