// ============================================
// CHECKOUT.JS - Lógica de compra y checkout
// ============================================

// Inicializar checkout cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    cargarCarritoEnCheckout();
    configurarEventosCheckout();
    autoRellenarDatosUsuario();
});

// Función para cargar el carrito en el checkout
function cargarCarritoEnCheckout() {
    const carrito = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (!cartItemsContainer) return;

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p>Tu carrito está vacío</p>
                <a href="productos.html" class="btn-primary" style="margin-top: 1rem;">Ver Productos</a>
            </div>
        `;
        return;
    }

    // Generar HTML de los items
    let html = '';
    let subtotal = 0;

    carrito.forEach((item, index) => {
        const itemTotal = item.precio * item.cantidad;
        subtotal += itemTotal;

        html += `
            <div class="cart-item" data-index="${index}">
                <div style="flex: 1;">
                    <strong>${item.nombre}</strong>
                    <p style="color: #666; font-size: 0.9rem;">
                        Talla: ${item.talla}
                    </p>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                        <button onclick="cambiarCantidad(${index}, -1)" class="btn-quantity" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;">-</button>
                        <span style="font-weight: bold;">Cant: ${item.cantidad}</span>
                        <button onclick="cambiarCantidad(${index}, 1)" class="btn-quantity" style="padding: 0.2rem 0.5rem; font-size: 0.8rem;">+</button>
                        <button onclick="eliminarDelCarrito(${index})" class="btn-delete" style="padding: 0.2rem 0.5rem; font-size: 0.8rem; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">🗑️</button>
                    </div>
                </div>
                <div style="text-align: right;">
                    <strong>$${itemTotal.toFixed(2)}</strong>
                    <p style="color: #666; font-size: 0.85rem;">
                        $${item.precio.toFixed(2)} c/u
                    </p>
                </div>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = html;

    // Calcular totales
    const envio = subtotal >= 999 ? 0 : 150;
    const total = subtotal + envio;

    // Actualizar totales en la página
    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('envio').textContent = envio === 0 ? 'GRATIS' : '$' + envio.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
}

// Configurar eventos del checkout
function configurarEventosCheckout() {
    // Formato automático para número de tarjeta
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Formato para fecha de expiración
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    // Permitir solo números en CVV
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Cambiar campos según método de pago
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            cambiarMetodoPago(this.value);
        });
    });
}

// Función para cambiar campos según método de pago
function cambiarMetodoPago(metodo) {
    const cardInfo = document.getElementById('card-info');
    
    if (metodo === 'tarjeta') {
        cardInfo.style.display = 'block';
    } else {
        cardInfo.style.display = 'none';
    }
}

// Función principal para procesar la compra
function procesarCompra() {
    // Validar campos del formulario
    if (!validarFormularioCheckout()) {
        return;
    }

    // Obtener usuario logueado (si existe)
    const usuarioActual = localStorage.getItem('usuario');
    const usuario = usuarioActual ? JSON.parse(usuarioActual) : null;

    // Obtener datos del formulario
    const datosCompra = {
        usuario_id: usuario ? usuario.id : null,
        nombre: document.getElementById('nombreCompleto').value,
        email: document.getElementById('emailCheckout').value,
        telefono: document.getElementById('telefonoCheckout').value,
        direccion: document.getElementById('direccion').value,
        ciudad: document.getElementById('ciudad').value,
        cp: document.getElementById('cp').value,
        metodoPago: document.querySelector('input[name="payment"]:checked').value
    };

    // Validar que haya productos en el carrito
    const carrito = JSON.parse(localStorage.getItem('cart') || '[]');
    if (carrito.length === 0) {
        alert('⚠️ Tu carrito está vacío');
        return;
    }

    // Mostrar mensaje de procesamiento
    const btnCompra = event.target;
    btnCompra.disabled = true;
    btnCompra.textContent = 'Procesando...';

    // Calcular totales
    const totales = calcularTotalCarrito();

    // Simular procesamiento de pago (2 segundos)
    setTimeout(() => {
        // Guardar datos de la orden
        const ordenCompleta = {
            ...datosCompra,
            productos: carrito,
            subtotal: totales.subtotal,
            envio: totales.envio,
            total: totales.total,
            fecha: new Date().toISOString()
        };

        localStorage.setItem('lastOrder', JSON.stringify(ordenCompleta));

        // Redirigir a la página del ticket
        window.location.href = 'ticket.html';
    }, 2000);
}

// Validar formulario de checkout
function validarFormularioCheckout() {
    const campos = [
        { id: 'nombreCompleto', nombre: 'Nombre completo' },
        { id: 'emailCheckout', nombre: 'Email' },
        { id: 'telefonoCheckout', nombre: 'Teléfono' },
        { id: 'direccion', nombre: 'Dirección' },
        { id: 'ciudad', nombre: 'Ciudad' },
        { id: 'cp', nombre: 'Código postal' }
    ];

    // Verificar campos básicos
    for (let campo of campos) {
        const input = document.getElementById(campo.id);
        if (!input || !input.value.trim()) {
            alert(`⚠️ Por favor completa el campo: ${campo.nombre}`);
            if (input) input.focus();
            return false;
        }
    }

    // Validar email
    const email = document.getElementById('emailCheckout').value;
    if (!validarEmail(email)) {
        alert('⚠️ Por favor ingresa un email válido');
        return false;
    }

    // Validar teléfono
    const telefono = document.getElementById('telefonoCheckout').value;
    if (!validarTelefono(telefono)) {
        alert('⚠️ Por favor ingresa un teléfono válido');
        return false;
    }

    // Validar código postal
    const cp = document.getElementById('cp').value;
    if (cp.length < 5) {
        alert('⚠️ El código postal debe tener al menos 5 dígitos');
        return false;
    }

    // Si el método de pago es tarjeta, validar datos de tarjeta
    const metodoPago = document.querySelector('input[name="payment"]:checked').value;
    if (metodoPago === 'tarjeta') {
        if (!validarDatosTarjeta()) {
            return false;
        }
    }

    return true;
}

// Validar datos de tarjeta
function validarDatosTarjeta() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    if (!cardNumber || cardNumber.length < 15) {
        alert('⚠️ Por favor ingresa un número de tarjeta válido');
        return false;
    }

    if (!expiry || expiry.length < 5) {
        alert('⚠️ Por favor ingresa una fecha de vencimiento válida (MM/AA)');
        return false;
    }

    if (!cvv || cvv.length < 3) {
        alert('⚠️ Por favor ingresa un CVV válido');
        return false;
    }

    // Validar que la tarjeta no esté vencida
    const [mes, anio] = expiry.split('/');
    const fechaVencimiento = new Date(2000 + parseInt(anio), parseInt(mes) - 1);
    const fechaActual = new Date();

    if (fechaVencimiento < fechaActual) {
        alert('⚠️ La tarjeta está vencida');
        return false;
    }

    return true;
}

// Validar formato de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar formato de teléfono
function validarTelefono(telefono) {
    const regex = /^[\d\s\+\-\(\)]{10,}$/;
    return regex.test(telefono);
}

// Función para calcular el total del carrito
function calcularTotalCarrito() {
    const carrito = JSON.parse(localStorage.getItem('cart') || '[]');
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const envio = subtotal >= 999 ? 0 : 150;
    return {
        subtotal: subtotal,
        envio: envio,
        total: subtotal + envio
    };
}

// Función para auto-rellenar datos del usuario logueado
function autoRellenarDatosUsuario() {
    const usuarioActual = localStorage.getItem('usuario');
    if (!usuarioActual) return;

    const usuario = JSON.parse(usuarioActual);

    // Rellenar campos con datos del usuario
    const nombreInput = document.getElementById('nombreCompleto');
    const emailInput = document.getElementById('emailCheckout');
    const telefonoInput = document.getElementById('telefonoCheckout');

    if (nombreInput && usuario.nombre) {
        nombreInput.value = usuario.nombre;
    }

    if (emailInput && usuario.email) {
        emailInput.value = usuario.email;
    }

    if (telefonoInput && usuario.telefono) {
        telefonoInput.value = usuario.telefono;
    }

    console.log('👤 Datos del usuario auto-rellenados en checkout');
}

// Función para limpiar formulario
function limpiarFormularioCheckout() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    inputs.forEach(input => input.value = '');
}

// Función para aplicar cupón de descuento (opcional)
function aplicarCupon(codigo) {
    const cupones = {
        'MESSI10': 0.10,
        'ARGENTINA': 0.15,
        'CAMPEON': 0.20
    };

    const descuento = cupones[codigo.toUpperCase()];
    
    if (descuento) {
        alert(`✅ ¡Cupón aplicado! ${descuento * 100}% de descuento`);
        return descuento;
    } else {
        alert('❌ Cupón no válido');
        return 0;
    }
}

// Función para cambiar la cantidad de un producto en el carrito
function cambiarCantidad(index, cambio) {
    const carrito = JSON.parse(localStorage.getItem('cart') || '[]');

    if (index < 0 || index >= carrito.length) return;

    // Calcular nueva cantidad
    const nuevaCantidad = carrito[index].cantidad + cambio;

    // No permitir cantidades menores a 1
    if (nuevaCantidad < 1) {
        if (confirm('¿Quieres eliminar este producto del carrito?')) {
            eliminarDelCarrito(index);
        }
        return;
    }

    // Actualizar cantidad
    carrito[index].cantidad = nuevaCantidad;

    // Guardar cambios
    localStorage.setItem('cart', JSON.stringify(carrito));

    // Recargar carrito
    cargarCarritoEnCheckout();

    // Actualizar contador del carrito en el header
    actualizarContadorCarrito();

    console.log(`📦 Cantidad actualizada: ${carrito[index].nombre} - Cantidad: ${nuevaCantidad}`);
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(index) {
    const carrito = JSON.parse(localStorage.getItem('cart') || '[]');

    if (index < 0 || index >= carrito.length) return;

    const productoEliminado = carrito[index].nombre;

    // Eliminar producto
    carrito.splice(index, 1);

    // Guardar cambios
    localStorage.setItem('cart', JSON.stringify(carrito));

    // Recargar carrito
    cargarCarritoEnCheckout();

    // Actualizar contador del carrito en el header
    actualizarContadorCarrito();

    alert(`🗑️ ${productoEliminado} eliminado del carrito`);
    console.log(`🗑️ Producto eliminado: ${productoEliminado}`);
}

// Función para actualizar el contador del carrito en el header
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const cartCountElement = document.getElementById('cart-count');

    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Exportar función principal
window.procesarCompra = procesarCompra;
window.cambiarCantidad = cambiarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;

// Log de inicialización
console.log('💳 Módulo de checkout cargado correctamente');
