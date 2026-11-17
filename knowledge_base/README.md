# Base de conocimiento Buildex

Esta carpeta contiene los documentos que el asistente consulta: archivos PDF, DOCX y TXT, también dentro de subcarpetas. Agrega aquí solo información aprobada para compartir con clientes.

Desde la raíz del proyecto ejecuta:

```sh
npm run knowledge:update
```

El comando no requiere una API key. Reconstruye `index.json` desde cero usando los documentos de esta carpeta y los productos de `assets/products.js`. Al reconstruir, refleja reemplazos y eliminaciones y elimina fragmentos duplicados.

Publica los documentos y el `index.json` generado en GitHub para que Vercel pueda incluirlos en el siguiente despliegue. No hay un portal de administración ni sincronización automática con una carpeta de tu computadora.

El repositorio es público. No agregues precios confidenciales, credenciales ni documentos de uso interno.
