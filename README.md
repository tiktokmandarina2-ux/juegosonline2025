# 📚 LibrosMágicos - Web Logger

Una aplicación web que simula una tienda de libros con funcionalidades de logging avanzado para recopilar información de los visitantes.

## 🌟 Características

### 🛍️ Tienda de Libros
- **Diseño moderno y atractivo** con gradientes y animaciones
- **Catálogo de libros** con imágenes, precios y calificaciones
- **Carrito de compras** funcional
- **Categorías de libros** organizadas
- **Responsive design** para todos los dispositivos

### 🔍 Sistema de Logging
- **IP Pública** y geolocalización automática
- **Coordenadas GPS** del usuario
- **User Agent** completo del navegador
- **Información de batería** del dispositivo
- **Datos de pantalla** y resolución
- **Información de conexión** a internet
- **Idioma y zona horaria**

### 🤖 Integración con Discord
- **Webhook configurable** para envío automático
- **Embeds ricos** con toda la información recopilada
- **Panel de administración** para configurar el webhook
- **Envío en tiempo real** cuando un usuario visita la página

## 🚀 Instalación y Uso

### 1. Configuración Básica
1. Descarga todos los archivos en una carpeta
2. Abre `index.html` en un navegador web
3. La aplicación comenzará a recopilar datos automáticamente

### 2. Configurar Webhook de Discord
1. **Crear webhook en Discord:**
   - Ve a tu servidor de Discord
   - Configuración del canal → Integraciones → Webhooks
   - Crear nuevo webhook
   - Copia la URL del webhook

2. **Configurar en la aplicación:**
   - Presiona `Ctrl + Shift + A` para abrir el panel de administración
   - Clave de acceso: `libros2024`
   - Pega la URL del webhook de Discord
   - Haz clic en "Guardar"

### 3. Acceso al Panel de Administración
- **Atajo de teclado:** `Ctrl + Shift + A`
- **Clave de acceso:** `libros2024`
- **Funciones:**
  - Configurar webhook de Discord
  - Ver datos recopilados en tiempo real
  - Monitorear visitantes

## 📊 Datos Recopilados

La aplicación recopila la siguiente información de cada visitante:

### 🌐 Información de Red
- IP pública del usuario
- Ubicación geográfica (país, ciudad, región)
- Coordenadas GPS (latitud, longitud)
- Proveedor de internet (ISP)
- Zona horaria

### 💻 Información del Dispositivo
- User Agent completo
- Plataforma del sistema operativo
- Resolución de pantalla
- Profundidad de color
- Orientación de pantalla
- Número de núcleos del procesador

### 🔋 Información de Batería
- Nivel de batería (porcentaje)
- Estado de carga (cargando/descargando)
- Tiempo estimado de carga/descarga

### 🌍 Información del Navegador
- Idioma preferido
- Idiomas disponibles
- Estado de conexión (online/offline)
- Soporte para cookies
- Configuración de privacidad (Do Not Track)

## 🎨 Características de Diseño

### 🎭 Interfaz Atractiva
- **Gradientes modernos** en colores púrpura y azul
- **Animaciones suaves** y transiciones
- **Iconos Font Awesome** para mejor UX
- **Tipografía Poppins** para legibilidad

### 📱 Responsive Design
- **Mobile-first** approach
- **Breakpoints** para tablet y desktop
- **Navegación adaptativa** según el dispositivo
- **Imágenes optimizadas** para diferentes resoluciones

### ⚡ Interactividad
- **Hover effects** en tarjetas de libros
- **Animaciones de scroll** para elementos
- **Notificaciones** de carrito de compras
- **Modal de acceso** para administración

## 🔧 Personalización

### 🎨 Cambiar Colores
Edita las variables CSS en `styles.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #ff6b6b;
}
```

### 📚 Agregar Libros
Modifica el array de libros en `script.js`:
```javascript
const bookTitles = {
    1: 'Tu Libro',
    2: 'Otro Libro',
    // ...
};
```

### 🔑 Cambiar Clave de Acceso
Modifica la variable `accessKey` en `script.js`:
```javascript
this.accessKey = 'tu_clave_personalizada';
```

## 🛡️ Consideraciones de Privacidad

⚠️ **IMPORTANTE:** Esta aplicación está diseñada para fines educativos y de demostración. 

- **Información sensible:** Se recopila información personal del usuario
- **Consentimiento:** Los usuarios deben ser informados sobre la recopilación de datos
- **Cumplimiento legal:** Asegúrate de cumplir con GDPR, CCPA y otras regulaciones
- **Uso responsable:** Solo usa esta herramienta en contextos apropiados

## 📝 Estructura de Archivos

```
web-logger/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript
└── README.md           # Documentación
```

## 🚀 Despliegue

### Opción 1: Servidor Local
```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx http-server

# Con PHP
php -S localhost:8000
```

### Opción 2: Servicios de Hosting
- **Netlify:** Arrastra y suelta la carpeta
- **Vercel:** Conecta con GitHub
- **GitHub Pages:** Sube a un repositorio
- **Firebase Hosting:** Usa Firebase CLI

## 🔗 URLs Llamativas

Para crear URLs más atractivas, considera usar servicios como:
- **Bit.ly** para acortar URLs
- **TinyURL** para enlaces personalizados
- **Rebrandly** para URLs con marca personalizada

Ejemplo: `https://bit.ly/libros-magicos-2024`

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la consola del navegador para errores
2. Verifica que el webhook de Discord sea válido
3. Asegúrate de que las APIs externas estén disponibles
4. Comprueba la conexión a internet

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Desarrollado con ❤️ para fines educativos**
