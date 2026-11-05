# Base de conocimiento Buildex

Agrega aquí documentos oficiales aprobados en PDF, DOCX o TXT, también dentro de subcarpetas. Actualiza el índice con `npm run knowledge:update`; el comando no necesita clave API.

El índice se reconstruye desde cero con los documentos que haya en esta carpeta y el catálogo de productos existente. Al reconstruir, reemplazos y eliminaciones quedan reflejados; se omiten fragmentos duplicados. Incluye el `index.json` generado al publicar para que la función del asistente pueda consultarlo.

La búsqueda vectorial de este piloto usa términos normalizados de los documentos. Las respuestas conversacionales siguen requiriendo `OPENAI_API_KEY` en las variables de entorno del servidor. Nunca pongas esa clave en el navegador ni la guardes en esta carpeta.
