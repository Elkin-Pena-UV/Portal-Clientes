import { PedidoDetalleView } from "@/components/admin/pedido-detalle-view";

export default async function AdminPedidoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PedidoDetalleView id={id} />;
}
