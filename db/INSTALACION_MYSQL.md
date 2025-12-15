# 🗄️ GUÍA DE INSTALACIÓN - MESSI STORE CON MYSQL

## 📋 Requisitos Previos

Antes de comenzar, necesitas tener instalado:

1. **Node.js** (v14 o superior)
   - Descarga: https://nodejs.org
   
2. **MySQL** (v8.0 o superior)
   - Descarga: https://dev.mysql.com/downloads/mysql/
   - O XAMPP: https://www.apachefriends.org/

3. **Git** (opcional)
   - Descarga: https://git-scm.com/

---

## 🚀 INSTALACIÓN PASO A PASO

### PASO 1: Crear la estructura del proyecto

```bash
# Crear carpeta principal
mkdir messi-store
cd messi-store

# Crear subcarpetas
mkdir css js img db
```

### PASO 2: Copiar todos los archivos

Copia los archivos en esta estructura:

```
messi-store/
├── db/
│   ├── schema.sql        ← Script para crear las tablas
│   ├── data.sql          ← Script con datos iniciales
│   └── config.js         ← Configuración de conexión
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── productos.js
│   └── checkout.js
├── img/
├── index.html
├── productos.html
├── quienes.html
├── politicas.html
├── login.html
├── registro.html
├── checkout.html
├── ticket.html
├── server.js
└── package.json
```

### PASO 3: Instalar MySQL

#### Opción A: MySQL Standalone

1. Descarga MySQL desde: https://dev.mysql.com/downloads/mysql/
2. Durante la instalación:
   - Usuario: `root`
   - Contraseña: Elige una (o déjala vacía)
   - Puerto: `3306` (por defecto)

#### Opción B: XAMPP (Más fácil)

1. Descarga XAMPP: https://www.apachefriends.org/
2. Instala XAMPP
3. Abre el Panel de Control de XAMPP
4. Inicia **Apache** y **MySQL**

### PASO 4: Crear la Base de Datos

#### Opción A: Usando phpMyAdmin (XAMPP)

1. Abre el navegador: `http://localhost/phpmyadmin`
2. Ve a la pestaña **SQL**
3. Copia todo el contenido de `db/schema.sql`
4. Haz clic en **Continuar**
5. Luego copia todo el contenido de `db/data.sql`
6. Haz clic en **Continuar**

#### Opción B: Usando MySQL Workbench

1. Abre MySQL Workbench
2. Conecta a tu servidor local
3. Abre el archivo `db/schema.sql`
4. Ejecuta el script (⚡ rayo)
5. Abre el archivo `db/data.sql`
6. Ejecuta el script

#### Opción C: Usando CMD/Terminal

```bash
# Conectar a MySQL
mysql -u root -p

# En la consola de MySQL, ejecuta:
source db/schema.sql
source db/data.sql
```

### PASO 5: Configurar la conexión

Edita el archivo `server.js` y actualiza estos datos según tu instalación:

```javascript
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',          // Tu usuario de MySQL
    password: '',          // Tu contraseña de MySQL (déjalo vacío si no tienes)
    database: 'messi_store'
});
```

### PASO 6: Instalar dependencias de Node.js

Abre CMD/Terminal en la carpeta del proyecto:

```bash
# Inicializar package.json
npm init -y

# Instalar dependencias
npm install express mysql2 bcrypt

# (Opcional) Instalar nodemon para desarrollo
npm install --save-dev nodemon
```

### PASO 7: Ejecutar el servidor

```bash
# Opción 1: Node normal
node server.js

# Opción 2: Con nodemon (reinicia automáticamente)
npx nodemon server.js
```

Deberías ver:

```
⚽ ========================================
   MESSI STORE - Servidor Iniciado
⚽ ========================================
✅ Conectado a MySQL exitosamente
🚀 Servidor corriendo en: http://localhost:3000
```

### PASO 8: Abrir en el navegador

Ve a: `http://localhost:3000`

---

## 🔧 CONFIGURACIÓN AVANZADA

### Variables de Entorno (.env)

Crea un archivo `.env` en la raíz:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=messi_store
PORT=3000
```

Instala dotenv:
```bash
npm install dotenv
```

Y en `server.js` agrega al inicio:
```javascript
require('dotenv').config();
```

---

## 🗄️ ESTRUCTURA DE LA BASE DE DATOS

### Tablas principales:

1. **usuarios** - Usuarios registrados
2. **categorias** - Categorías de productos (playeras, balones, etc.)
3. **productos** - Catálogo de productos
4. **direcciones** - Direcciones de envío de usuarios
5. **ordenes** - Órdenes de compra
6. **orden_items** - Items de cada orden
7. **carrito** - Carrito de compras (persistente)
8. **resenas** - Reseñas de productos

### Vistas:

1. **productos_con_categoria** - Productos con nombre de categoría
2. **ordenes_completas** - Órdenes con sus items

---

## 🧪 VERIFICAR LA INSTALACIÓN

### 1. Verificar Base de Datos

En MySQL:

```sql
USE messi_store;

-- Ver productos
SELECT * FROM productos LIMIT 5;

-- Ver categorías
SELECT * FROM categorias;

-- Ver órdenes de ejemplo
SELECT * FROM ordenes;
```

### 2. Probar API Endpoints

En el navegador o con Postman:

```
GET  http://localhost:3000/api/productos
GET  http://localhost:3000/api/categorias
GET  http://localhost:3000/api/productos/1
```

### 3. Probar Registro

```javascript
// POST http://localhost:3000/api/registro
{
  "nombre": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "telefono": "+52 55 1234 5678"
}
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot find module 'mysql2'"

```bash
npm install mysql2
```

### Error: "Access denied for user 'root'@'localhost'"

- Verifica tu usuario y contraseña en `server.js`
- Si usas XAMPP, la contraseña por defecto está vacía: `password: ''`

### Error: "ER_BAD_DB_ERROR: Unknown database 'messi_store'"

- La base de datos no se creó correctamente
- Vuelve a ejecutar `db/schema.sql`

### Error: "ECONNREFUSED"

- MySQL no está corriendo
- Si usas XAMPP, asegúrate de iniciar el servicio MySQL

### Puerto 3000 ocupado

Cambia el puerto en `server.js`:
```javascript
const PORT = 3001; // O cualquier otro puerto
```

---

## 📊 DATOS DE PRUEBA

### Usuarios de prueba (password: password123)

- **juan@example.com**
- **maria@example.com**
- **carlos@example.com**

### Productos incluidos

- ✅ 6 Playeras (Barcelona y Argentina)
- ✅ 3 Balones
- ✅ 3 Sudaderas
- ✅ 6 Accesorios

**Total: 18 productos** con imágenes y precios reales

---

## 🔒 SEGURIDAD (IMPORTANTE)

⚠️ **Este proyecto es para desarrollo/aprendizaje**

Para producción debes:

1. ✅ Cambiar las contraseñas de MySQL
2. ✅ Usar variables de entorno (`.env`)
3. ✅ Implementar JWT para autenticación
4. ✅ Validar todos los inputs
5. ✅ Usar HTTPS
6. ✅ Implementar rate limiting
7. ✅ Sanitizar consultas SQL (ya se usa con mysql2)

---

## 📚 COMANDOS ÚTILES

```bash
# Ver proceso de Node
ps aux | grep node

# Matar proceso en puerto 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill

# Matar proceso en puerto 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ver logs de MySQL (XAMPP)
tail -f /Applications/XAMPP/xamppfiles/logs/mysql_error.log
```

---

## 🎓 PRÓXIMOS PASOS

1. ✅ Agregar imágenes propias en `/img`
2. ✅ Implementar JWT para sesiones
3. ✅ Agregar panel de administración
4. ✅ Implementar pasarela de pago real
5. ✅ Agregar sistema de búsqueda
6. ✅ Implementar wishlist
7. ✅ Sistema de cupones de descuento

---

## 📞 SOPORTE

Si tienes problemas:

1. Verifica que MySQL esté corriendo
2. Revisa los logs del servidor en la terminal
3. Verifica las credenciales de MySQL
4. Asegúrate de que todas las dependencias estén instaladas

---

**⚽ ¡Listo! Tu Messi Store con MySQL está funcionando** 🎉