# Fuentes self-hosted

Coloca aquí los archivos WOFF2 de las fuentes tipográficas licenciadas:

- `plateia-bold.woff2` — Plateia Bold (titulares / display)
- `blisspro-regular.woff2` — Bliss Pro Regular (cuerpo)
- `blisspro-semibold.woff2` — Bliss Pro Semibold (UI, labels)
- `blisspro-bold.woff2` — Bliss Pro Bold (énfasis)

Estos archivos se sirven desde la raíz del sitio como `/fonts/{archivo}.woff2`.
Mientras no estén disponibles, el navegador usará los fallbacks del sistema
(Arial, Helvetica, sans-serif).

Los `@font-face` correspondientes se definen en `src/styles/tokens.css`.
