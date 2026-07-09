import { ClienteDetalleView } from "@/components/admin/cliente-detalle-view";

export default async function AdminClienteDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClienteDetalleView id={id} />;
}
