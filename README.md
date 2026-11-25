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

## Decisiones de diseño vs. sugerencias del IS

### 1. Asistente híbrido: catálogo local e IA opcional

- **Qué propuso el sistema inteligente:** Combinar respuestas programadas y búsqueda en el catálogo y la base de conocimiento con una llamada opcional a OpenAI para preguntas abiertas. La clave de OpenAI debía permanecer en el servidor.
- **Qué decidí:** Aceptar el enfoque híbrido e implementar primero las respuestas del catálogo sin depender de una clave de IA.
- **Por qué:** La búsqueda de productos y las preguntas frecuentes siguen disponibles aunque OpenAI no esté configurado o no responda. Así la función principal del asistente no depende de una API externa y no genera ese costo por cada consulta; si después se activa OpenAI, la clave no se expone en el navegador.

### 2. Límite de solicitudes y protección de la rama principal

- **Qué propuso el sistema inteligente:** Añadir un límite en el firewall de Vercel para `/api/chat` de 15 solicitudes por dirección IP cada 60 segundos, y proteger `main` con pull requests, análisis CodeQL y bloqueo de force-push y borrado.
- **Qué decidí:** Aceptar esas medidas; quedaron configuradas en Vercel y GitHub.
- **Por qué:** El límite en el firewall reduce ráfagas automatizadas antes de que lleguen a la función, ayudando a controlar abuso y consumo. El pull request y CodeQL añaden una revisión antes de que el código llegue a producción; bloquear force-push y borrado reduce el riesgo de perder o reemplazar accidentalmente la versión publicada.

## Contacto

Las solicitudes de cotización y las consultas sobre precio o disponibilidad se canalizan al equipo de Buildex por WhatsApp desde el sitio.
