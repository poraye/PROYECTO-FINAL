# ⚽ MESSI STORE - Tienda Online

Tienda en línea completa inspirada en Lionel Messi, con productos de Barcelona, Selección Argentina y accesorios.

## 🎨 Características

- ✅ Diseño moderno y responsive
- ✅ Colores de la Selección Argentina (celeste, blanco, dorado)
- ✅ Catálogo completo de productos
- ✅ Sistema de carrito de compras
- ✅ Proceso de checkout funcional
- ✅ Generación de tickets de compra
- ✅ Sistema de autenticación (login/registro)
- ✅ Servidor Node.js con Express

## 📁 Estructura del Proyecto

```
messi-store/
├── css/
│   └── style.css          # Estilos principales
├── js/
│   ├── main.js           # Funciones generales
│   ├── productos.js      # Catálogo de productos
│   └── checkout.js       # Lógica de compra
├── img/
│   ├── producto1.jpg     # (placeholder - agregar imágenes)
│   ├── producto2.jpg
│   └── producto3.jpg
├── index.html            # Página principal
├── productos.html        # Catálogo de productos
├── quienes.html          # Quiénes somos
├── politicas.html        # Políticas de la tienda
├── login.html            # Inicio de sesión
├── registro.html         # Registro de usuarios
├── checkout.html         # Proceso de compra
├── ticket.html           # Ticket de compra
└── server.js             # Servidor Node.js
```

## 🚀 Instalación y Uso

### 1. Requisitos Previos

- Node.js instalado (versión 14 o superior)
- npm (viene con Node.js)

### 2. Instalación

```bash
# 1. Crear carpeta del proyecto
mkdir messi-store
cd messi-store

# 2. Crear las carpetas necesarias
mkdir css js img

# 3. Copiar todos los archivos en sus respectivas carpetas

# 4. Instalar Express
npm init -y
npm install express

# (Opcional) Instalar nodemon para desarrollo
npm install --save-dev nodemon
```

### 3. Ejecutar el Servidor

```bash
# Forma 1: Con Node.js normal
node server.js

# Forma 2: Con nodemon (reinicia automáticamente)
npx nodemon server.js
```

### 4. Abrir en el Navegador

Abre tu navegador y ve a:
```
http://localhost:3000
```

## 📦 Productos Incluidos

### Playeras
- Playera Barcelona Messi 10 - $899
- Jersey Argentina Mundial 2022 - $1,499
- Jersey Alternativa Argentina - $899

### Balones
- Balón Al Rihla Messi Edition - $1,899
- Balón Barcelona Firmado - $1,599
- Balón Entrenamiento Messi - $699

### Sudaderas
- Sudadera Argentina Campeón - $1,199
- Hoodie Barcelona Messi Legacy - $1,399
- Chamarra Messi 10 - $1,699

### Accesorios
- Gorra Messi Argentina - $399
- Mochila Deportiva Messi - $899
- Taza Cerámica Messi GOAT - $249
- Llavero Messi 10 - $149

## 🎯 Funcionalidades

### Carrito de Compras
- Agregar productos
- Ver resumen del carrito
- Persistencia en localStorage
- Contador de items

### Checkout
- Formulario de datos personales
- Selección de método de pago
- Validación de campos
- Cálculo de envío (gratis en compras >$999)

### Ticket de Compra
- Número de orden único
- Resumen completo de la compra
- Información del cliente
- Detalles de envío
- Opción de imprimir

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `css/style.css`:

```css
:root {
    --primary: #6CACE4;    /* Celeste Argentina */
    --secondary: #F6B40E;  /* Dorado */
    --dark: #1a1a2e;       /* Oscuro */
}
```

### Agregar Productos

Edita el array en `js/productos.js`:

```javascript
const productos = [
    {
        id: 19,
        nombre: "Nuevo Producto",
        categoria: "playeras",
        precio: 999,
        imagen: "url-imagen",
        descripcion: "Descripción"
    }
];
```

## 🔧 API Endpoints

El servidor incluye varios endpoints REST:

```
GET  /api/productos       - Obtener todos los productos
GET  /api/productos/:id   - Obtener producto por ID
POST /api/orden           - Procesar orden de compra
POST /api/registro        - Registrar nuevo usuario
POST /api/login           - Iniciar sesión
```

## 🖼️ Imágenes

Las imágenes actuales son placeholders de Unsplash. Para usar imágenes propias:

1. Guarda las imágenes en la carpeta `img/`
2. Actualiza las rutas en `js/productos.js`

```javascript
imagen: "img/producto1.jpg"
```

## 📱 Responsive Design

El sitio es completamente responsive y se adapta a:
- 📱 Móviles (320px - 767px)
- 📲 Tablets (768px - 1023px)
- 💻 Desktop (1024px+)

## ⚙️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **Almacenamiento**: localStorage (lado cliente)
- **Diseño**: CSS Grid, Flexbox, Gradientes

## 🔒 Seguridad

**Nota**: Este es un proyecto de demostración. Para producción:

- ❌ No guardes contraseñas en texto plano
- ❌ No uses localStorage para información sensible
- ✅ Implementa autenticación real (JWT, OAuth)
- ✅ Usa una base de datos real
- ✅ Implementa validación del lado del servidor
- ✅ Agrega HTTPS

## 📝 Notas Adicionales

- Los datos del carrito se guardan en `localStorage`
- El servidor sirve archivos estáticos
- No hay base de datos (demo)
- Los pagos son simulados

## 🎓 Aprendizaje

Este proyecto es ideal para aprender:
- Estructura de un e-commerce
- Manejo de carrito de compras
- Proceso de checkout
- Servidor Node.js con Express
- localStorage y persistencia de datos

## 📄 Licencia

Proyecto educativo - Uso libre para aprendizaje

## 👨‍💻 Soporte

Para dudas o mejoras, modifica el código según tus necesidades.

---

**⚽ ¡Disfruta tu Messi Store!**

**Ponerlo en el cmd**

node server.js

Verás algo así:
```
⚽ ========================================
   MESSI STORE - Servidor Iniciado
⚽ ========================================
🚀 Servidor corriendo en: http://localhost:3000
```

### 7️⃣ **Abrir en el navegador**
Abre Chrome, Edge, o tu navegador y ve a:
http://localhost:3000