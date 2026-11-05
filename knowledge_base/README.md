# Base de conocimiento Buildex

Agrega aquí archivos PDF, DOCX o TXT que contengan información oficial aprobada por Buildex. Se permiten subcarpetas. El índice vectorial se genera con `npm run knowledge:update`; requiere `OPENAI_API_KEY` en el entorno local.

Después de actualizar, incluye en el despliegue tanto los documentos como `index.json` (o vuelve a ejecutar el comando en tu flujo de publicación). El índice se reconstruye desde cero con el contenido actual: reemplazos y eliminaciones quedan reflejados, y no se duplican fragmentos con el mismo contenido. No guardes aquí secretos ni datos personales de clientes.

El índice contiene embeddings y fragmentos del material comercial para búsqueda; sólo la función de servidor lo usa. No contiene la clave API.
