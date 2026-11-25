# Buildex Global Supply

Sitio web de Buildex Global Supply para presentar pisos y acabados para proyectos en México, explorar el catálogo y solicitar cotizaciones por WhatsApp.

## Qué incluye

- Página responsiva en español con información de la empresa, soluciones, catálogo, proceso y contacto.
- Catálogo interactivo con búsqueda y filtros; los datos y especificaciones de productos están en `assets/products.js`.
- Asistente en `/api/chat` que responde preguntas frecuentes, consulta información del catálogo y documentos aprobados, y dirige consultas de precio o disponibilidad al equipo por WhatsApp.
- Base de conocimiento en `knowledge_base/`; el índice utilizado por el asistente se guarda en `knowledge_base/index.json`.
- Despliegue en Vercel. Los cambios integrados en `main` se publican mediante el despliegue conectado del proyecto.

## Tecnologías

- HTML, CSS y JavaScript
- Node.js para la función de chat y las herramientas de actualización del conocimiento
- Vercel Functions
- OpenAI opcional para respuestas generativas

## Desarrollo local

Requisitos: Node.js y npm.

```bash
npm install
npx vercel dev
```

El segundo comando sirve el sitio y la función `/api/chat` en el entorno local de Vercel. Para respuestas generativas, configura `OPENAI_API_KEY` en el entorno local. Sin esa variable, el asistente conserva sus respuestas programadas y las respuestas basadas en el catálogo y la base de conocimiento.

La clave de OpenAI debe mantenerse en variables de entorno del servidor; no la escribas en archivos HTML o JavaScript del navegador.

## Actualizar el catálogo y la base de conocimiento

1. Edita los productos en `assets/products.js`.
2. Agrega documentos aprobados en PDF, DOCX o TXT a `knowledge_base/`.
3. Regenera el índice desde la raíz:

   ```bash
   npm run knowledge:update
   ```

4. Revisa y publica juntos los cambios de los documentos y `knowledge_base/index.json`.

La carpeta también contiene instrucciones adicionales en [ASSISTANT_SETUP.md](ASSISTANT_SETUP.md).

## Contacto

Las solicitudes de cotización y las consultas sobre precio o disponibilidad se canalizan al equipo de Buildex por WhatsApp desde el sitio.
