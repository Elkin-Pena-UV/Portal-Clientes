import type { Metadata } from 'next'
import { ExcelImportWizard } from '@/components/plantilla/excel-import-wizard'

export const metadata: Metadata = {
  title: 'Cargar pedidos desde Excel | Portal de Clientes',
  description:
    'Descarga la plantilla, complétala con tus pedidos y cárgala para crear múltiples órdenes de forma masiva.',
}

export default function CargarPlantillaPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <ExcelImportWizard />
    </div>
  )
}
