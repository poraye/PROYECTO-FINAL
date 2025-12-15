# 👥 GUÍA DE USUARIOS Y PERMISOS - MESSI STORE

## 📚 CONCEPTOS DCL (Data Control Language)

### ¿Qué es DCL?
DCL son los comandos SQL para **controlar el acceso** a los datos:
- `CREATE USER` - Crear usuarios
- `GRANT` - Otorgar permisos
- `REVOKE` - Quitar permisos
- `DROP USER` - Eliminar usuarios

---

## 🎯 USUARIOS PREDEFINIDOS DEL SISTEMA

### 1. **admin_messi** (Administrador Total)
- **Usuario**: `admin_messi`
- **Password**: `admin123`
- **Permisos**: TODOS (ALL PRIVILEGES)
- **Puede**: Hacer cualquier cosa en la base de datos

### 2. **vendedor** (Personal de Ventas)
- **Usuario**: `vendedor`
- **Password**: `vendedor123`
- **Permisos**: 
  - Ver productos, categorías, usuarios
  - Crear y ver órdenes
- **NO puede**: Modificar productos, eliminar datos

### 3. **cliente** (Usuario Final)
- **Usuario**: `cliente`
- **Password**: `cliente123`
- **Permisos**: Solo ver productos, categorías y sus órdenes
- **NO puede**: Modificar nada, solo consultar

### 4. **almacen** (Gestión de Inventario)
- **Usuario**: `almacen`
- **Password**: `almacen123`
- **Permisos**: 
  - Ver, agregar y actualizar productos
  - Ver órdenes
- **NO puede**: Eliminar productos, modificar usuarios

### 5. **contador** (Reportes y Finanzas)
- **Usuario**: `contador`
- **Password**: `contador123`
- **Permisos**: Solo ver órdenes, productos y usuarios
- **NO puede**: Modificar nada

---

## 🔧 COMANDOS PRINCIPALES

### Crear Usuario
```sql
CREATE USER 'nombre_usuario'@'localhost' IDENTIFIED BY 'contraseña';
```

### Dar Todos los Permisos
```sql
GRANT ALL PRIVILEGES ON messi_store.* TO 'usuario'@'localhost';
FLUSH PRIVILEGES;
```

### Dar Permisos Específicos
```sql
-- Solo SELECT (ver)
GRANT SELECT ON messi_store.productos TO 'usuario'@'localhost';

-- SELECT e INSERT (ver y agregar)
GRANT SELECT, INSERT ON messi_store.ordenes TO 'usuario'@'localhost';

-- SELECT, INSERT y UPDATE (ver, agregar y modificar)
GRANT SELECT, INSERT, UPDATE ON messi_store.productos TO 'usuario'@'localhost';
```

### Quitar Permisos
```sql
REVOKE INSERT ON messi_store.ordenes FROM 'usuario'@'localhost';
REVOKE ALL PRIVILEGES ON messi_store.* FROM 'usuario'@'localhost';
```

### Ver Permisos de un Usuario
```sql
SHOW GRANTS FOR 'usuario'@'localhost';
```

### Ver Todos los Usuarios
```sql
SELECT user, host FROM mysql.user;
```

### Eliminar Usuario
```sql
DROP USER 'usuario'@'localhost';
```

### Actualizar Privilegios (OBLIGATORIO)
```sql
FLUSH PRIVILEGES;
```

---

## 🧪 CÓMO PROBAR LOS USUARIOS

### 1. Conectarse como VENDEDOR

**En CMD/Terminal:**
```bash
mysql -u vendedor -p
# Escribe: vendedor123
```

**Probar permisos:**
```sql
USE messi_store;

-- Esto DEBE funcionar ✅
SELECT * FROM productos;

-- Esto NO debe funcionar ❌
DELETE FROM productos WHERE id = 1;
```

### 2. Conectarse como CLIENTE

```bash
mysql -u cliente -p
# Escribe: cliente123
```

```sql
USE messi_store;

-- Debe funcionar ✅
SELECT * FROM productos;

-- NO debe funcionar ❌
UPDATE productos SET precio = 100 WHERE id = 1;
```

### 3. Conectarse como ALMACEN

```bash
mysql -u almacen -p
# Escribe: almacen123
```

```sql
USE messi_store;

-- Debe funcionar ✅
UPDATE productos SET stock = 100 WHERE id = 1;

-- NO debe funcionar ❌
DELETE FROM productos WHERE id = 1;
```

---

## 📊 MATRIZ DE PERMISOS

| Usuario | SELECT | INSERT | UPDATE | DELETE | Tablas |
|---------|--------|--------|--------|--------|---------|
| **admin_messi** | ✅ | ✅ | ✅ | ✅ | Todas |
| **vendedor** | ✅ | ✅ (órdenes) | ❌ | ❌ | productos, categorías, usuarios, órdenes |
| **cliente** | ✅ | ❌ | ❌ | ❌ | productos, categorías, órdenes |
| **almacen** | ✅ | ✅ | ✅ | ❌ | productos, categorías, órdenes |
| **contador** | ✅ | ❌ | ❌ | ❌ | órdenes, productos, usuarios |

---

## 🔐 SEGURIDAD: BUENAS PRÁCTICAS

### ✅ SÍ hacer:
1. **Usar contraseñas fuertes**
   ```sql
   CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'P@ssw0rd_Segur0!';
   ```

2. **Dar solo los permisos necesarios**
   ```sql
   -- Mal: Dar todos los permisos
   GRANT ALL PRIVILEGES ON *.* TO 'usuario'@'localhost';
   
   -- Bien: Dar permisos específicos
   GRANT SELECT ON messi_store.productos TO 'usuario'@'localhost';
   ```

3. **Siempre hacer FLUSH PRIVILEGES**
   ```sql
   FLUSH PRIVILEGES;
   ```

4. **Limitar por host**
   ```sql
   -- Solo desde localhost
   CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'pass';
   
   -- Desde cualquier lugar (menos seguro)
   CREATE USER 'usuario'@'%' IDENTIFIED BY 'pass';
   ```

### ❌ NO hacer:
1. Usar contraseñas débiles: `123`, `admin`, `password`
2. Dar permisos de `root` a todos
3. Usar `@'%'` en producción (permite acceso desde cualquier IP)
4. Olvidar `FLUSH PRIVILEGES`

---

## 🛠️ SCRIPTS DE INSTALACIÓN

### Instalación Completa
```bash
# 1. Ejecutar schema.sql (crear tablas)
mysql -u root -p < db/schema.sql

# 2. Ejecutar data.sql (insertar datos)
mysql -u root -p < db/data.sql

# 3. Ejecutar usuarios_permisos.sql (crear usuarios)
mysql -u root -p < db/usuarios_permisos.sql
```

### Verificación
```sql
-- Como root
SELECT user, host FROM mysql.user 
WHERE user IN ('admin_messi', 'vendedor', 'cliente', 'almacen', 'contador');

-- Ver permisos
SHOW GRANTS FOR 'vendedor'@'localhost';
```

---

## 📝 RESPUESTAS A LAS 10 PREGUNTAS DE LA TAREA

### 1. ¿Qué es DCL?
**R:** Data Control Language (Lenguaje de Control de Datos). Son comandos SQL para administrar permisos y acceso a la base de datos.

### 2. ¿Cómo se crea un usuario?
**R:** 
```sql
CREATE USER 'nombre'@'localhost' IDENTIFIED BY 'contraseña';
```

### 3. ¿Qué significa GRANT ALL?
**R:** Otorga TODOS los privilegios (SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, INDEX, etc.) a un usuario.

### 4. ¿Qué significa FLUSH PRIVILEGES?
**R:** Recarga las tablas de privilegios de MySQL para que los cambios de permisos surtan efecto inmediatamente.

### 5. ¿Cómo otorgamos permisos a usuarios diferentes?
**R:** 
```sql
GRANT tipo_permiso ON base_datos.tabla TO 'usuario'@'host';
-- Ejemplo:
GRANT SELECT, INSERT ON messi_store.productos TO 'vendedor'@'localhost';
```

### 6. ¿Cómo eliminamos permisos?
**R:** 
```sql
REVOKE tipo_permiso ON base_datos.tabla FROM 'usuario'@'host';
-- Ejemplo:
REVOKE DELETE ON messi_store.productos FROM 'vendedor'@'localhost';
```

### 7. ¿Cómo se ven los permisos de usuarios?
**R:** 
```sql
SHOW GRANTS FOR 'usuario'@'localhost';
```

### 8. ¿Cómo se borra el usuario?
**R:** 
```sql
DROP USER 'usuario'@'localhost';
```

### 9. ¿Cómo se ven los usuarios?
**R:** 
```sql
SELECT user, host FROM mysql.user;
```

### 10. ¿Qué significa IDENTIFIED BY?
**R:** Establece la contraseña del usuario al momento de crearlo o al modificarla.

---

## 🎯 EJERCICIO PRÁCTICO

Crea un usuario llamado `marketing` que:
- Pueda ver productos y categorías
- Pueda ver las órdenes
- NO pueda modificar nada

**Solución:**
```sql
CREATE USER 'marketing'@'localhost' IDENTIFIED BY 'marketing123';
GRANT SELECT ON messi_store.productos TO 'marketing'@'localhost';
GRANT SELECT ON messi_store.categorias TO 'marketing'@'localhost';
GRANT SELECT ON messi_store.ordenes TO 'marketing'@'localhost';
FLUSH PRIVILEGES;

-- Verificar
SHOW GRANTS FOR 'marketing'@'localhost';
```

---

**⚽ ¡Listo para administrar usuarios en Messi Store!**
