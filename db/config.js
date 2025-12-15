// ============================================
// CONFIG.JS - Configuración de Base de Datos
// ============================================

const mysql = require('mysql2');

// Configuración de la conexión
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'messi_store',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Convertir a promesas
const promisePool = pool.promise();

// Función para verificar la conexión
async function verificarConexion() {
    try {
        const [rows] = await promisePool.query('SELECT 1 + 1 AS resultado');
        console.log('✅ Conexión a MySQL exitosa');
        return true;
    } catch (error) {
        console.error('❌ Error en conexión a MySQL:', error.message);
        return false;
    }
}

// Función para cerrar conexiones
function cerrarPool() {
    return new Promise((resolve, reject) => {
        pool.end((err) => {
            if (err) {
                console.error('Error cerrando pool:', err);
                reject(err);
            } else {
                console.log('Pool de conexiones cerrado');
                resolve();
            }
        });
    });
}

// Exportar
module.exports = {
    pool,
    promisePool,
    verificarConexion,
    cerrarPool,
    dbConfig
};