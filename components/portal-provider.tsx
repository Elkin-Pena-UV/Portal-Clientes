'use client'

import * as React from 'react'
import type { Producto, Sede } from '@/lib/types'
import { productosMock, sedesMock } from '@/lib/mock-data'

interface PortalContextValue {
  sedes: Sede[]
  productos: Producto[]
  addSede: (sede: Omit<Sede, 'id'>) => void
  updateSede: (id: string, sede: Omit<Sede, 'id'>) => void
  deleteSede: (id: string) => void
  getSede: (id: string) => Sede | undefined
  getProducto: (id: string) => Producto | undefined
}

const PortalContext = React.createContext<PortalContextValue | null>(null)

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [sedes, setSedes] = React.useState<Sede[]>(sedesMock)
  const [productos] = React.useState<Producto[]>(productosMock)

  const addSede = React.useCallback((sede: Omit<Sede, 'id'>) => {
    setSedes((prev) => [{ ...sede, id: uid() }, ...prev])
  }, [])

  const updateSede = React.useCallback(
    (id: string, sede: Omit<Sede, 'id'>) => {
      setSedes((prev) => prev.map((s) => (s.id === id ? { ...sede, id } : s)))
    },
    [],
  )

  const deleteSede = React.useCallback((id: string) => {
    setSedes((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const getSede = React.useCallback(
    (id: string) => sedes.find((s) => s.id === id),
    [sedes],
  )

  const getProducto = React.useCallback(
    (id: string) => productos.find((p) => p.id === id),
    [productos],
  )

  const value = React.useMemo(
    () => ({
      sedes,
      productos,
      addSede,
      updateSede,
      deleteSede,
      getSede,
      getProducto,
    }),
    [sedes, productos, addSede, updateSede, deleteSede, getSede, getProducto],
  )

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal() {
  const ctx = React.useContext(PortalContext)
  if (!ctx) throw new Error('usePortal debe usarse dentro de PortalProvider')
  return ctx
}
