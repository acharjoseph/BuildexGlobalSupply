# Configuración del asistente en Vercel

El código ya está publicado y el endpoint `/api/chat` está activo. Para habilitar respuestas generadas:

1. En el proyecto **buildex-global-supply** de Vercel, abre **Settings → Environment Variables**.
2. Agrega `OPENAI_API_KEY` con una clave de API de OpenAI. Márcala como **Sensitive** y asígnala a Production (y Preview sólo si quieres probar allí).
3. Opcionalmente, agrega `OPENAI_MODEL`; de forma predeterminada el endpoint usa `gpt-4o-mini`.
4. Guarda y vuelve a desplegar Production. No pegues la clave en GitHub, HTML o JavaScript del navegador.

El asistente ya recupera coincidencias del catálogo publicado en `assets/products.js` y de archivos Markdown aprobados en `knowledge/`. No requiere una base vectorial para la primera versión; es recuperación léxica sobre fuentes oficiales. Para ampliar la cobertura, coloca fichas técnicas y políticas verificadas en esa carpeta.

Sin `OPENAI_API_KEY`, el asistente informa que falta configuración y ofrece WhatsApp. No puede producir respuestas generadas hasta que Vercel tenga la variable. La limitación básica de solicitudes en memoria ayuda contra ráfagas, pero puede reiniciarse entre instancias de funciones; para tráfico alto conviene añadir un limitador persistente administrado.
