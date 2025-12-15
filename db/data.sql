-- ============================================
-- MESSI STORE - DATOS INICIALES (5 PRODUCTOS)
-- ============================================

USE messi_store;
SET SQL_SAFE_UPDATES = 0;
-- Limpiar datos existentes
DELETE FROM resenas;
DELETE FROM orden_items;
DELETE FROM ordenes;
DELETE FROM direcciones;
DELETE FROM carrito;
DELETE FROM usuarios;
DELETE FROM productos;
DELETE FROM categorias;

-- Reiniciar IDs
ALTER TABLE categorias AUTO_INCREMENT = 1;
ALTER TABLE productos AUTO_INCREMENT = 1;
ALTER TABLE usuarios AUTO_INCREMENT = 1;
ALTER TABLE direcciones AUTO_INCREMENT = 1;
ALTER TABLE ordenes AUTO_INCREMENT = 1;
ALTER TABLE orden_items AUTO_INCREMENT = 1;
ALTER TABLE resenas AUTO_INCREMENT = 1;

-- INSERTAR CATEGORÍAS
INSERT INTO categorias (nombre, descripcion, icono) VALUES
('playeras', 'Playeras y jerseys oficiales', '👕'),
('balones', 'Balones edición especial', '⚽'),
('sudaderas', 'Sudaderas y chaquetas', '🧥'),
('accesorios', 'Accesorios y merchandise', '🎒');

-- INSERTAR PRODUCTOS
INSERT INTO productos (nombre, categoria_id, precio, stock, imagen, descripcion, tallas, destacado) VALUES
('Jersey Argentina Mundial 2022', 1, 544.80, 100, 'img/Jersey Argentina Mundial 2022.jpg', 'Jersey oficial del Mundial Qatar 2022', '["S", "M", "L", "XL", "XXL"]', TRUE),
('Playera Barcelona Messi 10', 1, 690.31, 50, 'img/Playera Barcelona Messi 10.png', 'Playera oficial estilo Barcelona', '["S", "M", "L", "XL"]', TRUE),
('Balón Al Rihla Messi Edition', 2, 600.00, 25, 'img/Balon Al Rihla Messi Edition.jpg', 'Balón oficial del Mundial', '["Único"]', TRUE),
('Sudadera Argentina Campeón', 3, 987.50, 40, 'img/Sudadera Argentina Campeon.jpg', 'Sudadera conmemorativa', '["S", "M", "L", "XL"]', TRUE),
('Gorra Messi Argentina', 4, 399.00, 100, 'img/Gorra Messi Argentina.jpg', 'Gorra ajustable', '["Ajustable"]', FALSE);

-- INSERTAR USUARIOS
INSERT INTO usuarios (nombre, email, password, telefono) VALUES
('Juan Pérez', 'juan@example.com', '$2b$10$rBV2Q8Z9/qVXXhGJYQJWS.8Fy4xHJKKxD9LmHoB8HGPxW5xHJKKKx', '+52 55 1234 5678'),
('María García', 'maria@example.com', '$2b$10$rBV2Q8Z9/qVXXhGJYQJWS.8Fy4xHJKKxD9LmHoB8HGPxW5xHJKKKx', '+52 55 8765 4321'),
('Carlos López', 'carlos@example.com', '$2b$10$rBV2Q8Z9/qVXXhGJYQJWS.8Fy4xHJKKxD9LmHoB8HGPxW5xHJKKKx', '+52 55 5555 5555');

-- INSERTAR DIRECCIONES
INSERT INTO direcciones (usuario_id, direccion, ciudad, estado, codigo_postal, es_principal) VALUES
(1, 'Av. Reforma 123, Col. Centro', 'Ciudad de México', 'CDMX', '06000', TRUE),
(2, 'Calle Juárez 456, Col. Roma', 'Ciudad de México', 'CDMX', '06700', TRUE),
(3, 'Av. Insurgentes 789, Col. Condesa', 'Ciudad de México', 'CDMX', '06140', TRUE);

-- INSERTAR ÓRDENES
INSERT INTO ordenes (numero_orden, usuario_id, nombre_cliente, email_cliente, telefono_cliente, direccion_envio, ciudad, codigo_postal, subtotal, envio, total, metodo_pago, estado) VALUES
('MS-2024-100001', 1, 'Juan Pérez', 'juan@example.com', '+52 55 1234 5678', 'Av. Reforma 123', 'Ciudad de México', '06000', 1235.11, 0, 1235.11, 'tarjeta', 'entregado'),
('MS-2024-100002', 2, 'María García', 'maria@example.com', '+52 55 8765 4321', 'Calle Juárez 456', 'Ciudad de México', '06700', 600.00, 0, 600.00, 'paypal', 'enviado'),
('MS-2024-100003', 3, 'Carlos López', 'carlos@example.com', '+52 55 5555 5555', 'Av. Insurgentes 789', 'Ciudad de México', '06140', 399.00, 150, 549.00, 'oxxo', 'pendiente');

-- INSERTAR ORDEN ITEMS
INSERT INTO orden_items (orden_id, producto_id, nombre_producto, precio_unitario, cantidad, talla, subtotal) VALUES
(1, 1, 'Jersey Argentina Mundial 2022', 544.80, 1, 'L', 544.80),
(1, 2, 'Playera Barcelona Messi 10', 690.31, 1, 'M', 690.31),
(2, 3, 'Balón Al Rihla Messi Edition', 600.00, 1, 'Único', 600.00),
(3, 5, 'Gorra Messi Argentina', 399.00, 1, 'Ajustable', 399.00);

-- INSERTAR RESEÑAS
INSERT INTO resenas (producto_id, usuario_id, calificacion, comentario) VALUES
(1, 1, 5, '¡Increíble! La jersey es idéntica a la original.'),
(2, 2, 5, 'La playera del Barcelona es hermosa.'),
(3, 3, 4, 'Excelente balón de colección.'),
(4, 1, 5, 'Sudadera calientita y con un diseño espectacular.');

-- VERIFICAR
SELECT 'Categorías:', COUNT(*) FROM categorias;
SELECT 'Productos:', COUNT(*) FROM productos;
SELECT 'Usuarios:', COUNT(*) FROM usuarios;
SELECT 'Órdenes:', COUNT(*) FROM ordenes;

SET SQL_SAFE_UPDATES = 1;