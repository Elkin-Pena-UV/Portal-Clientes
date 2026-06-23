/* ============================================================
   Cementos San Marcos — Portal de Clientes · datos de ejemplo
   ============================================================ */
/* Cementos San Marcos — Portal de Clientes · datos de ejemplo (ES module) */
  const COP = (n) => "$" + Math.round(n).toLocaleString("es-CO");

  const empresa = {
    nombre: "Cementos San Marcos S.A.S.",
    nit: "900.155.107-1",
    direccion: "Km 24 Vía Panorama Cali – Buga, Corregimiento San Marcos",
    ciudad: "Yumbo, Valle del Cauca",
    pbx: "PBX +57 (2) 475 0010",
  };

  const cliente = {
    razon: "Constructora del Pacífico S.A.S.",
    nit: "830.221.554-8",
    usuario: "María Restrepo",
    rol: "Compras",
    iniciales: "MR",
    correo: "mrestrepo@constpacifico.co",
    sede: "Cali – Valle del Cauca",
  };

  // Cupo / cartera
  const cupo = { total: 800000000, utilizado: 512000000, disponible: 288000000 };
  const cartera = {
    total: 187450000,
    edades: [
      { rango: "Corriente", valor: 96200000, pill: "green" },
      { rango: "1 – 30 días", valor: 54300000, pill: "orange" },
      { rango: "31 – 60 días", valor: 21450000, pill: "yellow" },
      { rango: "61 – 90 días", valor: 9800000, pill: "red" },
      { rango: "+ 90 días", valor: 5700000, pill: "red" },
    ],
  };

  const sedes = [
    "0656-001 · Cali – Planta SC",
    "0656-002 · Yumbo – San Marcos",
    "0656-003 · Buga – Centro",
    "0656-004 · Palmira – Zona Franca",
  ];
  const puntos = ["Bodega principal", "Patio de descargue 2", "Obra Norte – Torre A", "Centro de acopio"];
  const conductores = ["Arturo Mosquera", "Jhon Camilo Mena", "Andrés Vélez", "Por asignar"];

  // Catálogo (cemento y afines)
  const productos = [
    { id: "CEM-UG50", nm: "Cemento Hidráulico Tipo UG x 50 kg", sku: "CEM-UG-50", unidad: "Saco 50 kg", precio: 38500, gravado: true, ficha: "2026-05-18" },
    { id: "CEM-UG25", nm: "Cemento Hidráulico Tipo UG x 25 kg", sku: "CEM-UG-25", unidad: "Saco 25 kg", precio: 21700, gravado: true, ficha: "2026-05-18" },
    { id: "CEM-GRA", nm: "Cemento ART Granel", sku: "CEM-ART-GRA", unidad: "Tonelada", precio: 690000, gravado: true, ficha: "2026-04-30" },
    { id: "CEM-TIP", nm: "Cemento Tiper Saco x 50 kg", sku: "CEM-TIP-50", unidad: "Saco 50 kg", precio: 36400, gravado: true, ficha: null },
    { id: "EST-INT", nm: "Estuco Interior DanMarcos x 25 kg", sku: "EST-INT-25", unidad: "Saco 25 kg", precio: 31900, gravado: true, ficha: "2026-05-02" },
    { id: "EST-EXT", nm: "Estuco Relleno Exterior DanMarcos x 25 kg", sku: "EST-EXT-25", unidad: "Saco 25 kg", precio: 33500, gravado: true, ficha: "2026-03-11" },
    { id: "BOQ-BLA", nm: "Boquilla Blanca x 2 kg", sku: "BOQ-BLA-2", unidad: "Bolsa 2 kg", precio: 8460, gravado: true, ficha: null },
    { id: "BOQ-TAB", nm: "Boquilla Tabaco x 2 kg", sku: "BOQ-TAB-2", unidad: "Bolsa 2 kg", precio: 8460, gravado: true, ficha: null },
    { id: "MOR-SEC", nm: "Mortero Seco Pega x 40 kg", sku: "MOR-SEC-40", unidad: "Saco 40 kg", precio: 27900, gravado: true, ficha: "2026-05-25" },
  ];

  // Pedidos
  const pedidos = [
    {
      id: "T-292313", pvc: "PVC-275293", fecha: "06 jun 2026", estado: "entregado",
      oc: "12552", valor: 14820000, items: 14, sede: "0656-001 · Cali – Planta SC",
      tipo: "Entrega", conductor: "Arturo Mosquera", placa: "SVL886", zona: "Cali – Valle",
      cumplido: { rem: "REM-2291", codigo: "#PAR-8842", receptor: "Arturo Mosquera", hora: "06 jun 2026 · 14:22" },
      hitos: [
        { k: "creada", t: "Orden creada", d: "03 jun 2026 · 09:14", done: true },
        { k: "cartera", t: "Aprobada por cartera", d: "03 jun 2026 · 11:42", done: true },
        { k: "pvc", t: "PVC generado", d: "PVC-275293 · 04 jun 2026", done: true },
        { k: "transito", t: "En tránsito", d: "06 jun 2026 · 06:30", done: true },
        { k: "entregado", t: "Entregado y firmado", d: "06 jun 2026 · 14:22 · firma del receptor capturada", done: true, current: true },
      ],
    },
    { id: "T-292208", pvc: "PVC-275251", fecha: "02 jun 2026", estado: "entregado", oc: "12544", valor: 6720000, items: 8, sede: "0656-002 · Yumbo – San Marcos", tipo: "Retiro", conductor: "Jhon Camilo Mena", placa: "TGK114", zona: "Yumbo" },
    { id: "T-291786", pvc: "—", fecha: "30 may 2026", estado: "pendiente", oc: "Prueba2011", valor: 21300000, items: 22, sede: "0656-001 · Cali – Planta SC", tipo: "Entrega", conductor: "Por asignar", placa: "—", zona: "Cali – Valle" },
    { id: "T-291640", pvc: "PVC-275190", fecha: "28 may 2026", estado: "entregado", oc: "12519", valor: 4150000, items: 5, sede: "0656-004 · Palmira – Zona Franca", tipo: "Entrega", conductor: "Andrés Vélez", placa: "WBN552", zona: "Palmira" },
    { id: "T-291402", pvc: "PVC-275133", fecha: "24 may 2026", estado: "transito", oc: "12498", valor: 9840000, items: 11, sede: "0656-001 · Cali – Planta SC", tipo: "Entrega", conductor: "Arturo Mosquera", placa: "SVL886", zona: "Cali – Valle" },
    { id: "T-291168", pvc: "—", fecha: "19 may 2026", estado: "anulado", oc: "16510a", valor: 3300000, items: 4, sede: "0656-002 · Yumbo – San Marcos", tipo: "Retiro", conductor: "—", placa: "—", zona: "Yumbo" },
    { id: "T-290985", pvc: "PVC-275069", fecha: "15 may 2026", estado: "entregado", oc: "12466", valor: 15600000, items: 18, sede: "0656-001 · Cali – Planta SC", tipo: "Entrega", conductor: "Jhon Camilo Mena", placa: "TGK114", zona: "Cali – Valle" },
  ];
  const estados = {
    transito: { label: "En tránsito", pill: "blue" },
    entregado: { label: "Entregado", pill: "green" },
    pendiente: { label: "En construcción", pill: "yellow" },
    anulado: { label: "Anulado", pill: "gray" },
  };

  // Programación de entregas (próximos despachos)
  const programacion = [
    { dia: "Lun 16 jun", items: [
      { hora: "07:00", pvc: "PVC-275293", producto: "Cemento UG x 50 kg", cant: "320 sacos", zona: "Obra Norte – Torre A", estado: "confirmada" },
      { hora: "11:30", pvc: "PVC-275301", producto: "Cemento ART Granel", cant: "14 ton", zona: "Centro de acopio", estado: "confirmada" },
    ]},
    { dia: "Mar 17 jun", items: [
      { hora: "08:00", pvc: "PVC-275312", producto: "Estuco Interior x 25 kg", cant: "180 sacos", zona: "Bodega principal", estado: "programada" },
    ]},
    { dia: "Mié 18 jun", items: [
      { hora: "06:30", pvc: "PVC-275320", producto: "Cemento UG x 50 kg", cant: "240 sacos", zona: "Patio de descargue 2", estado: "programada" },
      { hora: "14:00", pvc: "PVC-275322", producto: "Mortero Seco Pega", cant: "90 sacos", zona: "Obra Norte – Torre A", estado: "tentativa" },
    ]},
  ];
  const progEstados = {
    confirmada: { label: "Confirmada", pill: "green" },
    programada: { label: "Programada", pill: "blue" },
    tentativa: { label: "Tentativa", pill: "yellow" },
  };

  // Pagos — historial (anticipos / abonos)
  const pagos = [
    { reg: "21/11/2025 11:05", motivo: "ANTICIPO", codigo: "245", estado: "rechazado", fecha: "21/11/2025", valor: 1000000, moneda: "COP", site: "Recaudo anticipo en línea" },
    { reg: "19/10/2025 08:54", motivo: "ANTICIPO", codigo: "207", estado: "rechazado", fecha: "19/10/2025", valor: 2040000, moneda: "COP", site: "Recaudo anticipo en línea" },
    { reg: "19/10/2025 08:53", motivo: "ANTICIPO", codigo: "206", estado: "confirmado", fecha: "19/10/2025", valor: 1382000, moneda: "COP", site: "Recaudo anticipo en línea" },
    { reg: "11/08/2025 03:02", motivo: "ABONO", codigo: "138", estado: "confirmado", fecha: "11/08/2025", valor: 12500000, moneda: "COP", site: "Recaudo anticipo en línea" },
    { reg: "06/07/2025 02:32", motivo: "ANTICIPO", codigo: "92", estado: "confirmado", fecha: "06/07/2025", valor: 5400000, moneda: "COP", site: "Recaudo anticipo en línea" },
  ];
  const pagoEstados = {
    rechazado: { label: "RECHAZADO", pill: "red" },
    confirmado: { label: "CONFIRMADO", pill: "green" },
    empacado: { label: "EMPACADO", pill: "yellow" },
  };

  // Solicitudes de pago (PSE)
  const solicitudes = [
    { id: "396", fecha: "14/06/2026 08:33", valor: 1000000, proceso: "ANTICIPO", desc: "Pago Anticipo PortalCartera", estado: "empacado", pasarela: "PSE", plataforma: "CREATED", recaudo: "302", expira: "14/06/2026 08:54" },
    { id: "395", fecha: "13/06/2026 10:11", valor: 1000000, proceso: "ANTICIPO", desc: "Pago Anticipo PortalCartera", estado: "empacado", pasarela: "PSE", plataforma: "CREATED", recaudo: "301", expira: "13/06/2026 10:32" },
    { id: "248", fecha: "21/11/2025 11:05", valor: 1000000, proceso: "ANTICIPO", desc: "Pago Anticipo PortalCartera", estado: "rechazado", pasarela: "PSE", plataforma: "NOT_AUTHORIZED", recaudo: "245", expira: "21/11/2025 11:26" },
    { id: "211", fecha: "19/10/2025 08:54", valor: 2040000, proceso: "ANTICIPO", desc: "Pago Anticipo PortalCartera", estado: "rechazado", pasarela: "PSE", plataforma: "NOT_AUTHORIZED", recaudo: "207", expira: "19/10/2025 09:15" },
    { id: "138", fecha: "11/08/2025 03:02", valor: 1000000, proceso: "ABONO", desc: "Pago Anticipo PortalCartera", estado: "confirmado", pasarela: "PSE", plataforma: "OK", recaudo: "138", expira: "11/08/2025 03:24" },
    { id: "92", fecha: "06/07/2025 02:32", valor: 5400000, proceso: "ANTICIPO", desc: "Pago Anticipo PortalCartera", estado: "confirmado", pasarela: "PSE", plataforma: "OK", recaudo: "92", expira: "06/07/2025 02:54" },
  ];
  const platEstados = {
    CREATED: "blue", NOT_AUTHORIZED: "red", OK: "green",
  };

  // Facturas por pagar (cartera)
  const facturas = [
    { id: "FVE-44821", venc: "11 jun 2026", valor: 18420000, estado: "porvencer" },
    { id: "FVE-44780", venc: "18 jun 2026", valor: 12750000, estado: "vigente" },
    { id: "FVE-44712", venc: "05 jun 2026", valor: 9680000, estado: "vencida" },
    { id: "FVE-44698", venc: "27 jun 2026", valor: 22100000, estado: "vigente" },
    { id: "FVE-44655", venc: "02 jun 2026", valor: 7300000, estado: "vencida" },
  ];
  const factEstados = {
    vigente: { label: "Vigente", pill: "green" },
    porvencer: { label: "Por vencer", pill: "yellow" },
    vencida: { label: "Vencida", pill: "red" },
  };

  // Documentos — Facturas y Notas / Remisiones y Devoluciones
  const docsFacturas = [
    { id: "FVE-44821", emision: "21 may 2026", fn: "FVE", doc: "Factura de venta", pedido: "T-292313", nit: "830.221.554-8", valor: 18420000, adj: true },
    { id: "NC-1182", emision: "18 may 2026", fn: "NC", doc: "Nota crédito", pedido: "T-291786", nit: "830.221.554-8", valor: -1340000, adj: true },
    { id: "FVE-44780", emision: "19 may 2026", fn: "FVE", doc: "Factura de venta", pedido: "T-292208", nit: "830.221.554-8", valor: 12750000, adj: true },
    { id: "ND-0421", emision: "12 may 2026", fn: "ND", doc: "Nota débito", pedido: "T-290985", nit: "830.221.554-8", valor: 540000, adj: false },
  ];
  const docsRemisiones = [
    { id: "REM-2291", emision: "06 jun 2026", tipo: "Remisión", pedido: "T-292313", receptor: "Arturo Mosquera", cel: "3104458821", hora: "06 jun 2026 · 14:22", codigo: "#PAR-8842", firma: "ok", valor: 14820000 },
    { id: "REM-2274", emision: "02 jun 2026", tipo: "Remisión", pedido: "T-292208", receptor: "Laura Gómez", cel: "3128840193", hora: "02 jun 2026 · 10:48", codigo: "#PAR-8821", firma: "ok", valor: 6720000 },
    { id: "DEV-0455", emision: "27 may 2026", tipo: "Devolución", pedido: "T-291640", receptor: "Carolina Ruiz", cel: "3001129087", hora: "27 may 2026 · 16:05", codigo: "OPE-0455", firma: "ok", valor: -880000 },
  ];
  const firmaEstados = {
    ok: { label: "Validada", pill: "green" },
    pend: { label: "Pendiente", pill: "yellow" },
  };

  // Anticipos disponibles para aplicar a facturas
  const anticipos = [
    { id: "ANT-302", fecha: "14 jun 2026", valor: 1000000, origen: "PSE · Recaudo en línea" },
    { id: "ANT-206", fecha: "19 oct 2025", valor: 1382000, origen: "PSE · Recaudo en línea" },
    { id: "ANT-092", fecha: "06 jul 2025", valor: 5400000, origen: "PSE · Recaudo en línea" },
  ];

export const MP = {
    COP, empresa, cliente, cupo, cartera, sedes, puntos, conductores,
    productos, pedidos, estados, programacion, progEstados,
    pagos, pagoEstados, solicitudes, platEstados,
    facturas, factEstados, docsFacturas, docsRemisiones, firmaEstados, anticipos,
};
