// ============================================
// SERVER.JS - Servidor Node.js con Express y MySQL
// ============================================

const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require("cors");

// Crear la aplicación Express
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// ============================================
// CONFIGURACIÓN DE MYSQL
// ============================================
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',          // Cambia esto por tu usuario de MySQL
    password: '',          // Cambia esto por tu contraseña de MySQL
    database: 'messi_store',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promisify para usar async/await
const dbPromise = db.promise();

// Verificar conexión
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err.message);
    } else {
        console.log('✅ Conectado a MySQL exitosamente');
        connection.release();
    }
});

// ============================================
// MIDDLEWARES
// ============================================
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// ============================================
// RUTAS HTML
// ============================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/productos', (req, res) => {
    res.sendFile(path.join(__dirname, 'productos.html'));
});

app.get('/quienes', (req, res) => {
    res.sendFile(path.join(__dirname, 'quienes.html'));
});

app.get('/politicas', (req, res) => {
    res.sendFile(path.join(__dirname, 'politicas.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'registro.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'checkout.html'));
});

app.get('/ticket', (req, res) => {
    res.sendFile(path.join(__dirname, 'ticket.html'));
});

// ============================================
// API ENDPOINTS - PRODUCTOS
// ============================================

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const [productos] = await dbPromise.query(`
            SELECT 
                p.id, p.nombre, c.nombre as categoria, p.precio, 
                p.stock, p.imagen, p.descripcion, p.tallas, p.destacado
            FROM productos p
            JOIN categorias c ON p.categoria_id = c.id
            WHERE p.activo = TRUE
            ORDER BY p.destacado DESC, p.id ASC
        `);

        res.json({
            success: true,
            data: productos,
            total: productos.length
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener productos',
            error: error.message
        });
    }
});

// Obtener producto por ID
app.get('/api/productos/:id', async (req, res) => {
    try {
        const [productos] = await dbPromise.query(`
            SELECT 
                p.id, p.nombre, c.nombre as categoria, p.precio, 
                p.stock, p.imagen, p.descripcion, p.tallas, p.destacado
            FROM productos p
            JOIN categorias c ON p.categoria_id = c.id
            WHERE p.id = ? AND p.activo = TRUE
        `, [req.params.id]);

        if (productos.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            data: productos[0]
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener producto',
            error: error.message
        });
    }
});

// Obtener productos por categoría
app.get('/api/productos/categoria/:categoria', async (req, res) => {
    try {
        const [productos] = await dbPromise.query(`
            SELECT 
                p.id, p.nombre, c.nombre as categoria, p.precio, 
                p.stock, p.imagen, p.descripcion, p.tallas, p.destacado
            FROM productos p
            JOIN categorias c ON p.categoria_id = c.id
            WHERE c.nombre = ? AND p.activo = TRUE
            ORDER BY p.destacado DESC, p.id ASC
        `, [req.params.categoria]);

        res.json({
            success: true,
            data: productos,
            total: productos.length
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener productos por categoría',
            error: error.message
        });
    }
});

// ============================================
// API ENDPOINTS - USUARIOS
// ============================================

// Registrar nuevo usuario
app.post('/api/registro', async (req, res) => {
    try {
        const { nombre, email, password, telefono } = req.body;

        // Validación básica
        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                mensaje: 'Nombre, email y contraseña son obligatorios'
            });
        }

        // Verificar si el email ya existe
        const [usuarios] = await dbPromise.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (usuarios.length > 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'El email ya está registrado'
            });
        }

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Insertar usuario
        const [result] = await dbPromise.query(
            'INSERT INTO usuarios (nombre, email, password, telefono) VALUES (?, ?, ?, ?)',
            [nombre, email, passwordHash, telefono || null]
        );

        res.json({
            success: true,
            mensaje: 'Usuario registrado exitosamente',
            usuario: {
                id: result.insertId,
                nombre: nombre,
                email: email
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al registrar usuario',
            error: error.message
        });
    }
});

// Login de usuario
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                mensaje: 'Email y contraseña son obligatorios'
            });
        }

        // Buscar usuario
        const [usuarios] = await dbPromise.query(
            'SELECT id, nombre, email, password FROM usuarios WHERE email = ? AND activo = TRUE',
            [email]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                success: false,
                mensaje: 'Credenciales incorrectas'
            });
        }

        const usuario = usuarios[0];

        // Verificar contraseña
        const passwordValido = await bcrypt.compare(password, usuario.password);

        if (!passwordValido) {
            return res.status(401).json({
                success: false,
                mensaje: 'Credenciales incorrectas'
            });
        }

        res.json({
            success: true,
            mensaje: 'Login exitoso',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al iniciar sesión',
            error: error.message
        });
    }
});

// ============================================
// API ENDPOINTS - ÓRDENES
// ============================================

// Crear orden
app.post('/api/orden', async (req, res) => {
    try {
        const {
            usuario_id,
            nombre_cliente,
            email_cliente,
            telefono_cliente,
            direccion_envio,
            ciudad,
            codigo_postal,
            productos,
            subtotal,
            envio,
            total,
            metodo_pago
        } = req.body;

        // Validación básica
        if (!nombre_cliente || !email_cliente || !telefono_cliente || !productos || productos.length === 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'Faltan datos obligatorios'
            });
        }

        // Generar número de orden
        const numeroOrden = 'MS-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 900000 + 100000);

        // Insertar orden
        const [resultOrden] = await dbPromise.query(`
            INSERT INTO ordenes (
                numero_orden, usuario_id, nombre_cliente, email_cliente, telefono_cliente,
                direccion_envio, ciudad, codigo_postal, subtotal, envio, total, metodo_pago
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            numeroOrden, usuario_id || null, nombre_cliente, email_cliente, telefono_cliente,
            direccion_envio, ciudad, codigo_postal, subtotal, envio, total, metodo_pago
        ]);

        const ordenId = resultOrden.insertId;

        // Insertar items de la orden
        for (const item of productos) {
            await dbPromise.query(`
                INSERT INTO orden_items (
                    orden_id, producto_id, nombre_producto, precio_unitario, cantidad, talla, subtotal
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [
                ordenId, item.id, item.nombre, item.precio, item.cantidad,
                item.talla || null, item.precio * item.cantidad
            ]);

            // Actualizar stock
            await dbPromise.query(
                'UPDATE productos SET stock = stock - ? WHERE id = ?',
                [item.cantidad, item.id]
            );
        }

        res.json({
            success: true,
            mensaje: 'Orden procesada exitosamente',
            numeroOrden: numeroOrden,
            ordenId: ordenId,
            total: total
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al procesar orden',
            error: error.message
        });
    }
});

// Obtener orden por número
app.get('/api/orden/:numeroOrden', async (req, res) => {
    try {
        const [ordenes] = await dbPromise.query(`
            SELECT * FROM ordenes WHERE numero_orden = ?
        `, [req.params.numeroOrden]);

        if (ordenes.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'Orden no encontrada'
            });
        }

        const orden = ordenes[0];

        // Obtener items de la orden
        const [items] = await dbPromise.query(`
            SELECT * FROM orden_items WHERE orden_id = ?
        `, [orden.id]);

        res.json({
            success: true,
            data: {
                ...orden,
                items: items
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener orden',
            error: error.message
        });
    }
});

// ============================================
// API ENDPOINTS - CATEGORÍAS
// ============================================

// Obtener todas las categorías
app.get('/api/categorias', async (req, res) => {
    try {
        const [categorias] = await dbPromise.query(
            'SELECT * FROM categorias WHERE activo = TRUE'
        );

        res.json({
            success: true,
            data: categorias
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener categorías',
            error: error.message
        });
    }
});

// ============================================
// MANEJO DE ERRORES
// ============================================

// Ruta 404
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Página No Encontrada</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #6CACE4 0%, #4a8fc7 100%);
                    color: white;
                    text-align: center;
                }
                h1 { font-size: 6rem; margin: 0; }
                p { font-size: 1.5rem; }
                a { color: #F6B40E; text-decoration: none; font-weight: bold; }
            </style>
        </head>
        <body>
            <div>
                <h1>404</h1>
                <p>⚽ Página no encontrada</p>
                <a href="/">Volver al inicio</a>
            </div>
        </body>
        </html>
    `);
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        mensaje: 'Error interno del servidor',
        error: err.message
    });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
    console.log('⚽ ========================================');
    console.log('   MESSI STORE - Servidor Iniciado');
    console.log('⚽ ========================================');
    console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`🗄️  Base de datos: messi_store (MySQL)`);
    console.log(`📁 Sirviendo archivos desde: ${__dirname}`);
    console.log('');
    console.log('📄 Páginas disponibles:');
    console.log(`   - Inicio:      http://localhost:${PORT}/`);
    console.log(`   - Productos:   http://localhost:${PORT}/productos.html`);
    console.log('');
    console.log('🔌 API Endpoints:');
    console.log(`   - GET  /api/productos`);
    console.log(`   - GET  /api/productos/:id`);
    console.log(`   - POST /api/orden`);
    console.log(`   - POST /api/registro`);
    console.log(`   - POST /api/login`);
    console.log('');
    console.log('⌨️  Presiona Ctrl+C para detener el servidor');
    console.log('⚽ ========================================');
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    console.log('\n👋 Cerrando servidor...');
    db.end();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n👋 Cerrando servidor...');
    db.end();
    process.exit(0);
});