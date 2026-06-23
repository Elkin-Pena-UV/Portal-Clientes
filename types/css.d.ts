// Permite imports de hojas de estilo con efecto secundario (p. ej. `import "./globals.css"`)
// bajo `tsc --noEmit`. Next.js los resuelve vía webpack en build/dev.
declare module "*.css";
