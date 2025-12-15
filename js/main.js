// ============================================
// MAIN.JS - Funcionalidades generales del sitio
// ============================================

// Inicializar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Función principal de inicialización
function initializeApp() {
    // Verificar sesión y actualizar UI
    actualizarUIUsuario();

    // Actualizar contador del carrito
    if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
    }

    // Event listener para el icono del carrito
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            mostrarResumenCarrito();
        });
    }

    // Smooth scroll para enlaces internos
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

    // Animación de entrada para elementos
    addScrollAnimations();

    // Validación de formularios
    setupFormValidation();
}

// Función para mostrar resumen rápido del carrito
function mostrarResumenCarrito() {
    const carrito = JSON.parse(localStorage.getItem('cart') || '[]');
    
    if (carrito.length === 0) {
        alert('🛒 Tu carrito está vacío\n\n¡Explora nuestros productos y encuentra tu favorito!');
        return;
    }

    let mensaje = '🛒 TU CARRITO:\n\n';
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `${item.nombre}\n`;
        mensaje += `Cantidad: ${item.cantidad} x $${item.precio.toFixed(2)}\n`;
        mensaje += `Subtotal: $${subtotal.toFixed(2)}\n\n`;
    });

    mensaje += `TOTAL: $${total.toFixed(2)} MXN\n\n`;
    mensaje += '¿Deseas proceder al checkout?';

    if (confirm(mensaje)) {
        window.location.href = 'checkout.html';
    }
}

// Función para animaciones al hacer scroll
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Seleccionar elementos para animar
    const elementsToAnimate = document.querySelectorAll('.product-card, .category-card, .value-card');
    
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Función para validación básica de formularios
function setupFormValidation() {
    const forms = document.querySelectorAll('form, .auth-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
        });
    });
}

// Validar un input específico
function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;

    let isValid = true;
    let message = '';

    if (value === '') {
        isValid = false;
        message = 'Este campo es obligatorio';
    } else if (type === 'email' && !isValidEmail(value)) {
        isValid = false;
        message = 'Ingresa un email válido';
    } else if (type === 'tel' && !isValidPhone(value)) {
        isValid = false;
        message = 'Ingresa un teléfono válido';
    } else if (type === 'password' && value.length < 8) {
        isValid = false;
        message = 'La contraseña debe tener al menos 8 caracteres';
    }

    // Aplicar estilos de validación
    if (!isValid) {
        input.style.borderColor = '#dc3545';
        showValidationMessage(input, message);
    } else {
        input.style.borderColor = '#28a745';
        removeValidationMessage(input);
    }

    return isValid;
}

// Validar formato de email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar formato de teléfono
function isValidPhone(phone) {
    const regex = /^[\d\s\+\-\(\)]+$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// Mostrar mensaje de validación
function showValidationMessage(input, message) {
    removeValidationMessage(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

// Remover mensaje de validación
function removeValidationMessage(input) {
    const existingError = input.parentNode.querySelector('.validation-error');
    if (existingError) {
        existingError.remove();
    }
}

// Función para formatear números como moneda
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(precio);
}

// Función para obtener fecha actual formateada
function obtenerFechaActual() {
    const fecha = new Date();
    return fecha.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para generar número de orden aleatorio
function generarNumeroOrden() {
    const fecha = new Date();
    const random = Math.floor(Math.random() * 900000) + 100000;
    return `MS-${fecha.getFullYear()}-${random}`;
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = mensaje;
    
    // Estilos
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 2rem';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '10000';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    if (tipo === 'success') {
        notification.style.background = '#28a745';
        notification.style.color = 'white';
    } else if (tipo === 'error') {
        notification.style.background = '#dc3545';
        notification.style.color = 'white';
    }
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Función para verificar si hay usuario logueado
function verificarSesion() {
    const usuario = localStorage.getItem('usuario');
    return usuario !== null;
}

// Función para obtener usuario actual
function obtenerUsuarioActual() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
}

// Función para actualizar UI según sesión
function actualizarUIUsuario() {
    const usuario = obtenerUsuarioActual();
    const nav = document.querySelector('.main-nav');
    
    if (!nav) return;

    // Buscar o crear el contenedor de usuario
    let userContainer = document.querySelector('.user-info');
    
    if (usuario) {
        // Usuario logueado
        if (!userContainer) {
            userContainer = document.createElement('div');
            userContainer.className = 'user-info';
            userContainer.style.cssText = 'display: flex; align-items: center; gap: 1rem; color: white;';
            nav.parentElement.insertBefore(userContainer, nav.nextSibling);
        }
        
        userContainer.innerHTML = `
            <span>👤 ${usuario.nombre}</span>
            <button onclick="cerrarSesion()" style="
                background: transparent;
                color: white;
                border: 1px solid white;
                padding: 0.3rem 0.8rem;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.9rem;
            ">Cerrar Sesión</button>
        `;

        // Cambiar el link de Login
        const loginLink = nav.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.textContent = 'Mi Cuenta';
            loginLink.href = '#';
            loginLink.onclick = (e) => {
                e.preventDefault();
                alert(`Bienvenido ${usuario.nombre}\n\nEmail: ${usuario.email}\n\n(Funcionalidad de perfil en desarrollo)`);
            };
        }
    } else {
        // No hay sesión
        if (userContainer) {
            userContainer.remove();
        }
        
        // Restaurar link de Login
        const loginLink = nav.querySelector('a[href="#"]');
        if (loginLink && loginLink.textContent === 'Mi Cuenta') {
            loginLink.textContent = 'Login';
            loginLink.href = 'login.html';
            loginLink.onclick = null;
        }
    }
}

// Función para guardar usuario
function guardarUsuario(datos) {
    localStorage.setItem('usuario', JSON.stringify(datos));
    actualizarUIUsuario();
}

// Función para cerrar sesión
function cerrarSesion() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        localStorage.removeItem('usuario');
        localStorage.removeItem('remember');
        alert('Sesión cerrada exitosamente');
        window.location.href = 'index.html';
    }
}

// Función para scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Agregar botón de scroll to top
window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

// Función para animación de números (contador)
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.floor(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Función para debugging (mostrar info del carrito en consola)
function debugCarrito() {
    const carrito = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('🛒 Contenido del carrito:', carrito);
    console.log('📦 Total de items:', carrito.reduce((sum, item) => sum + item.cantidad, 0));
    console.log('💰 Total:', carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0));
}

// Exportar funciones para uso global
window.mostrarNotificacion = mostrarNotificacion;
window.formatearPrecio = formatearPrecio;
window.generarNumeroOrden = generarNumeroOrden;
window.debugCarrito = debugCarrito;
window.scrollToTop = scrollToTop;

// Log de inicialización
console.log('⚽ Messi Store inicializado correctamente');