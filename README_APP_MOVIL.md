# App movil: Calculadora de Robotica

Esta version ya esta preparada como PWA. Eso significa que se puede abrir desde el navegador del telefono e instalar en la pantalla de inicio como una app.

## Archivos agregados

- `manifest.webmanifest`: nombre, color, iconos y modo de instalacion.
- `service-worker.js`: permite que la app cargue mas rapido y pueda funcionar sin conexion despues de abrirla.
- `icons/`: iconos para Android, iPhone y navegadores.
- `index.html`, `style.css`, `script.js`: ajustados para telefono y corregidos en UTF-8.

## Publicarla con GitHub Pages

1. Abre una terminal en esta carpeta:
   `C:\Users\edaga\OneDrive\Desktop\calculadora-cuaternios`
2. Guarda los cambios en Git:
   ```bash
   git add .
   git commit -m "Convertir calculadora en app movil PWA"
   git push origin main
   ```
3. Entra a tu repositorio:
   `https://github.com/edagarariel123-pixel/calculadora-cuaternios`
4. Ve a `Settings > Pages`.
5. En `Branch`, selecciona `main` y carpeta `/root`.
6. Guarda y espera a que GitHub te muestre la URL publicada.

## Instalar en Android

1. Abre la URL de GitHub Pages en Chrome.
2. Toca el menu de tres puntos.
3. Elige `Instalar app` o `Agregar a pantalla principal`.
4. Abrela desde el icono nuevo del telefono.

## Instalar en iPhone

1. Abre la URL de GitHub Pages en Safari.
2. Toca el boton de compartir.
3. Elige `Agregar a pantalla de inicio`.
4. Abrela desde el icono nuevo.

## Nota

Si abres `index.html` directamente como archivo, la calculadora funciona, pero la instalacion como app necesita una URL segura con HTTPS. GitHub Pages ya da HTTPS gratis.
