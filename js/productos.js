// ============================================
// PRODUCTOS.JS - Base de datos de productos (5 PRODUCTOS)
// ============================================

const productos = [
    // Producto 1: Jersey Argentina Mundial 2022 (MÁS POPULAR)
    {
        id: 1,
        nombre: "Jersey Argentina Mundial 2022",
        categoria: "playeras",
        precio: 544.80,
        imagen: "img/Jersey Argentina Mundial 2022.jpg",
        descripcion: "Jersey oficial del Mundial Qatar 2022 - Campeón. La playera con la que Messi levantó la Copa del Mundo"
    },

    // Producto 2: Playera Barcelona Messi 10
    {
        id: 2,
        nombre: "Playera Barcelona Messi 10",
        categoria: "playeras",
        precio: 690.31,
        imagen: "img/Playera Barcelona Messi 10.png",
        descripcion: "Playera oficial estilo Barcelona con el legendario número 10 de la época dorada del Barça"
    },

    // Producto 3: Balón Al Rihla Messi Edition
    {
        id: 3,
        nombre: "Balón Al Rihla Messi Edition",
        categoria: "balones",
        precio: 600.00,
        imagen: "img/Balon Al Rihla Messi Edition.jpg",
        descripcion: "Balón oficial del Mundial Qatar 2022 con firma de Messi. Edición limitada de colección"
    },

    // Producto 4: Sudadera Argentina Campeón
    {
        id: 4,
        nombre: "Sudadera Argentina Campeón",
        categoria: "sudaderas",
        precio: 987.50,
        imagen: "img/Sudadera Argentina Campeon.jpg",
        descripcion: "Sudadera conmemorativa del Mundial 2022. Diseño exclusivo con 3 estrellas"
    },

    // Producto 5: Gorra Messi Argentina
    {
        id: 5,
        nombre: "Gorra Messi Argentina",
        categoria: "accesorios",
        precio: 399,
        imagen: "img/Gorra Messi Argentina.jpg",
        descripcion: "Gorra ajustable con bordado de calidad. Logo de la AFA y número 10 de Messi"
    }
];

// Función para crear una tarjeta de producto
function crearProductoHTML(producto) {
    // Determinar las tallas disponibles según la categoría
    let tallasHTML = '';
    if (producto.categoria === 'playeras' || producto.categoria === 'sudaderas') {
        tallasHTML = `
            <select class="product-size" id="talla-${producto.id}">
                <option value="">Selecciona talla</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
            </select>
        `;
    } else if (producto.categoria === 'accesorios') {
        tallasHTML = `
            <select class="product-size" id="talla-${producto.id}">
                <option value="Único">Talla Única</option>
            </select>
        `;
    } else if (producto.categoria === 'balones') {
        tallasHTML = `
            <select class="product-size" id="talla-${producto.id}">
                <option value="Único">Tamaño Único</option>
            </select>
        `;
    }

    return `
        <div class="product-card">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
            <div class="product-info">
                <div class="product-category">${producto.categoria}</div>
                <h3 class="product-name">${producto.nombre}</h3>
                <p class="product-price">${producto.precio.toFixed(2)} MXN</p>
                
                <div class="product-options">
                    <div class="form-group">
                        <label>Talla:</label>
                        ${tallasHTML}
                    </div>
                    <div class="form-group">
                        <label>Cantidad:</label>
                        <input type="number" class="product-quantity" id="cantidad-${producto.id}" min="1" max="10" value="1">
                    </div>
                </div>

                <div class="product-actions">
                    <button class="btn-add-cart" onclick="agregarAlCarrito(${producto.id})">
                        🛒 Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Función para mostrar productos destacados (primeros 4)
function mostrarProductosDestacados() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const destacados = productos.slice(0, 4); // Mostrar los primeros 4
    container.innerHTML = destacados.map(crearProductoHTML).join('');
}

// Función para mostrar todos los productos
function mostrarTodosLosProductos() {
    const container = document.getElementById('all-products');
    if (!container) return;

    container.innerHTML = productos.map(crearProductoHTML).join('');
}

// Función para filtrar productos por categoría
function filtrarProductos(categoria) {
    const container = document.getElementById('all-products');
    if (!container) return;

    const productosFiltrados = categoria === 'todos' 
        ? productos 
        : productos.filter(p => p.categoria === categoria);

    if (productosFiltrados.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <h3>No hay productos en esta categoría</h3>
                <p>Prueba con otra categoría</p>
            </div>
        `;
        return;
    }

    container.innerHTML = productosFiltrados.map(crearProductoHTML).join('');

    // Actualizar botones activos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === categoria) {
            btn.classList.add('active');
        }
    });
}

// Función para agregar producto al carrito
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    // Obtener talla seleccionada
    const tallaSelect = document.getElementById(`talla-${id}`);
    const talla = tallaSelect ? tallaSelect.value : 'Único';

    // Validar que se haya seleccionado una talla (para playeras y sudaderas)
    if (!talla || talla === '') {
        alert('⚠️ Por favor selecciona una talla');
        tallaSelect.focus();
        return;
    }

    // Obtener cantidad
    const cantidadInput = document.getElementById(`cantidad-${id}`);
    const cantidad = cantidadInput ? parseInt(cantidadInput.value) : 1;

    // Validar cantidad
    if (cantidad < 1 || cantidad > 10) {
        alert('⚠️ La cantidad debe ser entre 1 y 10');
        return;
    }

    let carrito = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Buscar si ya existe el producto con la misma talla
    const itemExistente = carrito.find(item => item.id === id && item.talla === talla);
    
    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            talla: talla,
            cantidad: cantidad
        });
    }

    localStorage.setItem('cart', JSON.stringify(carrito));
    actualizarContadorCarrito();
    
    // Resetear formulario
    if (cantidadInput) cantidadInput.value = 1;
    if (tallaSelect && producto.categoria !== 'accesorios' && producto.categoria !== 'balones') {
        tallaSelect.value = '';
    }
    
    // Mensaje de confirmación
    alert(`✅ ${producto.nombre}\nTalla: ${talla}\nCantidad: ${cantidad}\n\n¡Agregado al carrito exitosamente!`);
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    const contador = document.getElementById('cart-count');
    if (contador) {
        contador.textContent = total;
    }
}

// Función para obtener el carrito
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

// Función para limpiar el carrito
function limpiarCarrito() {
    localStorage.removeItem('cart');
    actualizarContadorCarrito();
}

// Función para buscar productos
function buscarProductos(termino) {
    termino = termino.toLowerCase();
    return productos.filter(p => 
        p.nombre.toLowerCase().includes(termino) ||
        p.descripcion.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino)
    );
}

// Función para obtener producto por ID
function obtenerProductoPorId(id) {
    return productos.find(p => p.id === id);
}

// Función para obtener estadísticas de productos
function obtenerEstadisticas() {
    return {
        total: productos.length,
        porCategoria: {
            playeras: productos.filter(p => p.categoria === 'playeras').length,
            balones: productos.filter(p => p.categoria === 'balones').length,
            sudaderas: productos.filter(p => p.categoria === 'sudaderas').length,
            accesorios: productos.filter(p => p.categoria === 'accesorios').length
        },
        precioPromedio: (productos.reduce((sum, p) => sum + p.precio, 0) / productos.length).toFixed(2),
        precioMinimo: Math.min(...productos.map(p => p.precio)),
        precioMaximo: Math.max(...productos.map(p => p.precio))
    };
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar productos destacados en la página principal
    mostrarProductosDestacados();
    
    // Mostrar todos los productos en la página de productos
    mostrarTodosLosProductos();
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();

    // Event listeners para filtros
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filtrarProductos(this.dataset.category);
        });
    });

    // Mostrar estadísticas en consola (para debugging)
    console.log('📊 Estadísticas de productos:', obtenerEstadisticas());
    console.log('⚽ Total de productos cargados:', productos.length);
});

// Log de inicialización
console.log('✅ Base de datos de productos cargada:', productos.length, 'productos');