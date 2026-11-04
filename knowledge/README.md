# Base de conocimiento del Asistente Buildex

El asistente recupera información del catálogo oficial publicado en `assets/products.js` y del contenido de esta carpeta antes de redactar una respuesta. No añadas información comercial sin validación de Buildex.

## Incorporar documentos oficiales

1. Añade aquí documentos Markdown (`.md`) aprobados, por ejemplo fichas técnicas, condiciones de importación y políticas de entrega.
2. Incluye fecha/versión y fuente en cada documento.
3. El endpoint lee los Markdown en cada solicitud; no requiere reconstruir un índice vectorial.
4. No incluyas precios sujetos a cambios a menos que Buildex autorice su publicación al asistente.

Los documentos que aún no se han proporcionado no se han inventado ni precargado.
