# 🤖 Configuración de Webhook de Discord

## 📋 Pasos para Configurar el Webhook

### 1. Crear Webhook en Discord

#### En tu Servidor de Discord:
1. **Ve a tu servidor** de Discord
2. **Haz clic derecho** en el canal donde quieres recibir las notificaciones
3. **Selecciona "Configuración del canal"** (⚙️)
4. **Ve a "Integraciones"** en el menú lateral
5. **Haz clic en "Webhooks"**
6. **Haz clic en "Crear webhook"**
7. **Configura el webhook:**
   - **Nombre:** `LibrosMágicos Logger`
   - **Avatar:** Opcional (puedes subir una imagen)
   - **Canal:** Selecciona el canal donde quieres las notificaciones
8. **Haz clic en "Copiar URL del webhook"**
9. **Guarda la URL** - se ve así: `https://discord.com/api/webhooks/123456789/abcdefghijklmnop`

### 2. Configurar en tu Sitio Web

#### En tu sitio desplegado:
1. **Abre tu sitio** en el navegador
2. **Presiona `Ctrl + Shift + A`** (o `Cmd + Shift + A` en Mac)
3. **Ingresa la clave:** `libros2024`
4. **Pega la URL del webhook** en el campo correspondiente
5. **Haz clic en "Guardar"**
6. **Haz clic en "🔄 Probar Recopilación"** para verificar que funciona

### 3. Verificar que Funciona

#### Deberías ver en Discord:
- **Mensaje con embed** con toda la información del visitante
- **IP pública** del usuario
- **Ubicación geográfica** (país, ciudad)
- **Coordenadas GPS** (latitud, longitud)
- **Información de batería** del dispositivo
- **User Agent** del navegador
- **Datos de pantalla** y resolución
- **Timestamp** de la visita

## 🔧 Solución de Problemas

### Si no llegan mensajes a Discord:

#### 1. Verificar la URL del Webhook:
- ✅ **Formato correcto:** `https://discord.com/api/webhooks/ID/TOKEN`
- ❌ **Formato incorrecto:** `https://discord.com/api/webhooks/` (falta ID y TOKEN)

#### 2. Verificar que el Webhook esté Activo:
- Ve a Discord → Configuración del canal → Integraciones → Webhooks
- Asegúrate de que el webhook esté **habilitado**

#### 3. Verificar Permisos:
- El bot debe tener permisos para **enviar mensajes** en el canal
- El canal debe permitir **webhooks**

#### 4. Revisar la Consola:
- Presiona **F12** en tu navegador
- Ve a la pestaña **Console**
- Busca errores relacionados con Discord o fetch

### Si hay errores de CORS:
- El archivo `netlify.toml` ya está configurado para manejar CORS
- Las APIs están optimizadas para funcionar en Netlify

### Si no se recopilan datos:
1. **Verifica la conexión** a internet
2. **Espera unos segundos** - las APIs pueden tardar
3. **Usa el botón "🔄 Probar Recopilación"** para probar manualmente
4. **Revisa la consola** para ver qué APIs están funcionando

## 📊 Ejemplo de Mensaje en Discord

```
📚 Nuevo Visitante - LibrosMágicos
Un usuario ha visitado la tienda de libros

🌐 IP Pública: 192.168.1.100
📍 Ubicación: Madrid, España
🗺️ Coordenadas: 40.4168, -3.7038
🔋 Batería: 85% (Cargando)
🖥️ Pantalla: 1920x1080
🌍 Idioma: es-ES
💻 User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...
⏰ Timestamp: 15/12/2024, 14:30:25
```

## 🛡️ Consideraciones de Seguridad

### ⚠️ Importante:
- **No compartas** la URL del webhook públicamente
- **Usa canales privados** para recibir las notificaciones
- **Considera las implicaciones legales** de recopilar datos de usuarios
- **Informa a los usuarios** sobre la recopilación de datos

### 🔒 Mejores Prácticas:
- **Usa un canal dedicado** solo para logs
- **Configura permisos** apropiados en Discord
- **Revisa regularmente** los logs recibidos
- **Mantén actualizada** la aplicación

## 🚀 Funcionalidades Avanzadas

### Personalizar el Mensaje:
Puedes modificar el mensaje en el archivo `script.js` en la función `sendToDiscord()`:

```javascript
const embed = {
    title: "📚 Tu Título Personalizado",
    description: "Tu descripción personalizada",
    color: 0x667eea, // Color del embed
    // ... resto de la configuración
};
```

### Agregar Más Información:
Puedes agregar más campos al embed modificando el array `fields`:

```javascript
fields: [
    // ... campos existentes
    {
        name: "🆕 Tu Campo",
        value: "Tu valor",
        inline: true
    }
]
```

---

**¡Tu webhook está listo para recibir notificaciones! 🎉**
