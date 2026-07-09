"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { MA, type ProductoAdmin } from "@/lib/admin/data";
import { Pill, ProdImg } from "@/components/shared/primitives";
import { Switch } from "@/components/ui/switch";
import { useAdmin } from "@/components/admin/admin-provider";
import { ProductoFormSheet } from "@/components/admin/producto-form-sheet";
import { exportarProductosExcel } from "@/lib/admin/export-productos";

type FiltroCat = "todos" | "cemento" | "acabados" | "granel";

const FILTROS: { id: FiltroCat; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "cemento", label: "Cemento" },
  { id: "acabados", label: "Línea acabados" },
  { id: "granel", label: "Granel" },
];

function enCategoria(p: ProductoAdmin, f: FiltroCat): boolean {
  if (f === "todos") return true;
  if (f === "granel") return p.tipo === "granel";
  if (f === "acabados") return p.categoria === "linea_acabados";
  return p.tipo === "saco" && p.categoria === "cemento";
}

export function ProductosView() {
  const { productos, toggleVisibleProducto } = useAdmin();
  const [filtro, setFiltro] = useState<FiltroCat>("todos");
  const [busqueda, setBusqueda] = useState("");
  const [exportando, setExportando] = useState(false);
  const [editando, setEditando] = useState<ProductoAdmin | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const lista = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return productos.filter((p) => {
      if (!enCategoria(p, filtro)) return false;
      if (q && ![p.nombre, p.codigo, p.presentacion].some((v) => v.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [productos, filtro, busqueda]);

  const sinFicha = productos.filter((p) => !p.ficha);
  const ocultos = productos.filter((p) => !p.visible).length;

  const exportar = async () => {
    if (lista.length === 0 || exportando) return;
    setExportando(true);
    try {
      await exportarProductosExcel(lista);
    } finally {
      setExportando(false);
    }
  };

  const abrirEdicion = (p: ProductoAdmin) => {
    setEditando(p);
    setSheetOpen(true);
  };

  return (
    <div className="content-inner stack">
      {sinFicha.length > 0 && (
        <div className="muted-note warn">
          <Icon.info />
          <span>{sinFicha.length} producto(s) sin ficha técnica publicada ({sinFicha.map((p) => p.codigo).join(", ")}). Los clientes no podrán descargarla hasta que se cargue.</span>
        </div>
      )}
      <div className="card">
        <div className="card-head" style={{ borderBottom: "none", paddingBottom: 4 }}>
          <h3>Catálogo del portal</h3>
          <div className="spacer" />
          <div className="search"><Icon.search /><input placeholder="Buscar por nombre, código o presentación…" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} /></div>
          <button className="btn btn-quiet btn-sm" onClick={exportar} disabled={lista.length === 0 || exportando}>
            <Icon.sheet /> {exportando ? "Exportando…" : "Exportar a Excel"}
          </button>
        </div>
        <div style={{ padding: "8px 20px 0" }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {FILTROS.map((f) => (
              <button key={f.id} className={"tab" + (filtro === f.id ? " on" : "")} onClick={() => setFiltro(f.id)}>{f.label}</button>
            ))}
          </div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>Producto</th><th>Presentación</th><th className="num">Precio</th><th>IVA</th><th>Ficha técnica</th><th>Visible</th><th></th></tr></thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id} style={p.visible ? undefined : { opacity: 0.55 }}>
                  <td>
                    <div className="row" style={{ gap: 10 }}>
                      <ProdImg src={p.imagen} alt={p.nombre} style={{ width: 38, height: 38, borderRadius: 8, border: "1px solid var(--line)", flex: "none" }} />
                      <div>
                        <div className="t-strong">{p.nombre}</div>
                        <div className="t-muted t-mono" style={{ fontSize: 12 }}>{p.codigo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="t-muted">{p.presentacion}</td>
                  <td className="num t-mono">{MA.COP(p.precio)} <span className="t-muted" style={{ fontSize: 11.5 }}>/ {p.unidad}</span></td>
                  <td className="t-muted">{Math.round(p.iva * 100)}%</td>
                  <td>{p.ficha ? <Pill kind="green" dot={false}>{p.ficha}</Pill> : <Pill kind="yellow" dot={false}>Sin ficha</Pill>}</td>
                  <td><Switch checked={p.visible} onCheckedChange={() => toggleVisibleProducto(p.id)} aria-label={"Visibilidad de " + p.nombre} /></td>
                  <td><button className="btn btn-quiet btn-sm" onClick={() => abrirEdicion(p)}><Icon.pen /> Editar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {lista.length === 0 && <div className="empty">No hay productos que coincidan con el filtro.</div>}
        </div>
        <div className="card-pad between" style={{ paddingTop: 10, paddingBottom: 12 }}>
          <span className="hint">Precios e IVA sincronizados desde el ERP · la capa web (imagen, ficha, visibilidad) se edita aquí</span>
          {ocultos > 0 && <span className="hint">{ocultos} producto(s) oculto(s) del catálogo</span>}
        </div>
      </div>

      <ProductoFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        producto={sheetOpen ? productos.find((p) => p.id === editando?.id) ?? null : editando}
      />
    </div>
  );
}
