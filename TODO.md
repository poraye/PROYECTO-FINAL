# TODO: Conectar Usuario Nuevo para Iniciar Sesión

## Tareas Completadas
- [x] Actualizar registro.html para conectar con la API de registro (/api/registro)
  - Cambiar la función handleRegister() de simulación a llamada real a la API
  - Agregar manejo de errores y loading state
  - Redirigir a login.html después de registro exitoso
- [x] Probar el registro de un nuevo usuario
- [x] Verificar que el login funcione con el usuario registrado
- [x] Asegurarse de que la base de datos esté configurada correctamente (MySQL corriendo)
- [x] Arreglar auto-relleno de datos del usuario en checkout
  - Agregar función autoRellenarDatosUsuario() en js/checkout.js
  - Pre-llenar nombre, email y teléfono del usuario logueado
- [x] Agregar funciones para editar y eliminar productos del carrito
  - Botones + y - para cambiar cantidad de productos
  - Botón eliminar (🗑️) para quitar productos del carrito
  - Actualización automática del contador del carrito y totales
  - Validación para evitar cantidades negativas
