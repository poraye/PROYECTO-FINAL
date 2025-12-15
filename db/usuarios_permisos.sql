USE messi_store;

CREATE USER 'admin_messi'@'localhost' IDENTIFIED BY 'admin123';
CREATE USER 'vendedor'@'localhost' IDENTIFIED BY 'vendedor123';
CREATE USER 'cliente'@'localhost' IDENTIFIED BY 'cliente123';
CREATE USER 'almacen'@'localhost' IDENTIFIED BY 'almacen123';
CREATE USER 'contador'@'localhost' IDENTIFIED BY 'contador123';

SELECT user, host FROM mysql.user WHERE user LIKE '%messi%' OR user IN ('vendedor','cliente','almacen','contador');

GRANT ALL PRIVILEGES ON messi_store.* TO 'admin_messi'@'localhost';

FLUSH PRIVILEGES;

GRANT SELECT ON messi_store.productos TO 'vendedor'@'localhost';
GRANT SELECT ON messi_store.categorias TO 'vendedor'@'localhost';
GRANT SELECT ON messi_store.usuarios TO 'vendedor'@'localhost';
GRANT SELECT, INSERT ON messi_store.ordenes TO 'vendedor'@'localhost';
GRANT SELECT, INSERT ON messi_store.orden_items TO 'vendedor'@'localhost';

GRANT SELECT ON messi_store.productos TO 'cliente'@'localhost';
GRANT SELECT ON messi_store.categorias TO 'cliente'@'localhost';
GRANT SELECT ON messi_store.ordenes TO 'cliente'@'localhost';
GRANT SELECT ON messi_store.orden_items TO 'cliente'@'localhost';

GRANT SELECT, INSERT, UPDATE ON messi_store.productos TO 'almacen'@'localhost';
GRANT SELECT ON messi_store.categorias TO 'almacen'@'localhost';
GRANT SELECT ON messi_store.ordenes TO 'almacen'@'localhost';
GRANT SELECT ON messi_store.orden_items TO 'almacen'@'localhost';

GRANT SELECT ON messi_store.ordenes TO 'contador'@'localhost';
GRANT SELECT ON messi_store.orden_items TO 'contador'@'localhost';
GRANT SELECT ON messi_store.productos TO 'contador'@'localhost';
GRANT SELECT ON messi_store.usuarios TO 'contador'@'localhost';

FLUSH PRIVILEGES;

REVOKE INSERT ON messi_store.ordenes FROM 'vendedor'@'localhost';
REVOKE SELECT ON messi_store.orden_items FROM 'contador'@'localhost';
REVOKE SELECT ON messi_store.productos FROM 'contador'@'localhost';
REVOKE SELECT ON messi_store.usuarios FROM 'contador'@'localhost';


GRANT SELECT ON messi_store.ordenes TO 'contador'@'localhost';
GRANT SELECT ON messi_store.productos TO 'contador'@'localhost';

FLUSH PRIVILEGES;

SHOW GRANTS FOR 'vendedor'@'localhost';
SHOW GRANTS FOR 'cliente'@'localhost';
SHOW GRANTS FOR 'almacen'@'localhost';
SHOW GRANTS FOR 'admin_messi'@'localhost';

SELECT * FROM mysql.db WHERE Db = 'messi_store';
SELECT * FROM mysql.tables_priv WHERE Db = 'messi_store';

DROP USER 'contador'@'localhost';

SELECT user, host FROM mysql.user WHERE user = 'contador';

SELECT user, host FROM mysql.user;

SELECT DISTINCT User 
FROM mysql.db 
WHERE Db = 'messi_store';

SELECT user, host, Select_priv, Insert_priv, Update_priv, Delete_priv 
FROM mysql.user 
WHERE user IN ('admin_messi', 'vendedor', 'cliente', 'almacen');

CREATE USER 'nuevo_usuario'@'localhost' IDENTIFIED BY 'contraseña_segura';
ALTER USER 'vendedor'@'localhost' IDENTIFIED BY 'nueva_contraseña_123';
ALTER USER 'cliente'@'localhost' IDENTIFIED BY 'nueva_pass_456';

FLUSH PRIVILEGES;

CREATE USER 'gerente'@'localhost' IDENTIFIED BY 'gerente2024';
GRANT SELECT, INSERT, UPDATE ON messi_store.* TO 'gerente'@'localhost';
GRANT DELETE ON messi_store.carrito TO 'gerente'@'localhost';
FLUSH PRIVILEGES;
SHOW GRANTS FOR 'gerente'@'localhost';
