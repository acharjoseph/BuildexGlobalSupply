# Asistente y catálogo de Buildex

El asistente está integrado en la web y su endpoint es `/api/chat`. Vercel aloja el sitio y publica los cambios que se integran en la rama `main`; no existe un portal de administración independiente.

## Funcionamiento sin clave de IA

No se necesita una clave para que el chat salude, conteste algunas preguntas frecuentes, consulte productos y especificaciones publicadas, o pase preguntas de precio y disponibilidad al WhatsApp existente. La respuesta se construye con los datos del catálogo y reglas de conversación. Puede mantener el contexto de los últimos mensajes de la sesión.

Este modo no genera conocimiento general ilimitado. Para responder preguntas abiertas con un modelo generativo se puede agregar `OPENAI_API_KEY` a **Vercel → Settings → Environment Variables**. La clave se guarda solo en el servidor; nunca en HTML ni JavaScript del navegador.

## Actualizar productos y documentos

- Los productos y sus especificaciones visibles en la web están en `assets/products.js`.
- Agrega documentos aprobados PDF, DOCX o TXT en `knowledge_base/`.
- Desde la raíz del proyecto, ejecuta `npm run knowledge:update`. El comando reconstruye `knowledge_base/index.json` con los productos del sitio y los documentos de esa carpeta; también quita fragmentos obsoletos y duplicados.
- Publica juntos el documento y el índice actualizado en GitHub. Al integrar los cambios en `main`, Vercel vuelve a desplegar la web.

El repositorio de GitHub es público actualmente: los archivos que agregues allí podrán ser vistos por cualquiera. No subas listas privadas de precios, credenciales ni contratos confidenciales.

El catálogo actual no confirma precios ni existencias; el chat ofrece WhatsApp para esos datos.
