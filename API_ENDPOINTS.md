# 🚀 API SaveSmartTracker - Documentación de Endpoints

## 📋 Información General

- **Base URL**: `http://localhost:3000/api`
- **Versión**: 1.0.0
- **Formato de Respuesta**: JSON
- **Autenticación**: Pendiente de implementar

## 🔧 Estructura de Respuestas

### Respuesta Exitosa
```json
{
  "success": true,
  "data": {...},
  "message": "Operación exitosa"
}
```

### Respuesta con Paginación
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error"
}
```

---

## 👥 USUARIOS (`/api/users`)

### Crear Usuario
- **POST** `/api/users`
- **Body**:
```json
{
  "username": "usuario123",
  "password": "password123",
  "email": "usuario@email.com"
}
```

### Obtener Todos los Usuarios
- **GET** `/api/users?page=1&limit=10&search=usuario`
- **Query Params**:
  - `page` (opcional): Número de página (default: 1)
  - `limit` (opcional): Elementos por página (default: 10)
  - `search` (opcional): Búsqueda por username

### Obtener Usuario por ID
- **GET** `/api/users/:id`

### Actualizar Usuario
- **PUT** `/api/users/:id`
- **Body**: Campos a actualizar

### Eliminar Usuario (Soft Delete)
- **DELETE** `/api/users/:id`

### Activar Usuario
- **POST** `/api/users/:id/activate`

### Estadísticas de Usuarios
- **GET** `/api/users/stats`

---

## 📂 CATEGORÍAS (`/api/categories`)

### Crear Categoría
- **POST** `/api/categories`
- **Body**:
```json
{
  "name": "Entretenimiento",
  "description": "Gastos de ocio",
  "image_link": "https://example.com/image.jpg"
}
```

### Obtener Todas las Categorías
- **GET** `/api/categories?page=1&limit=10&search=entretenimiento`

### Obtener Categorías Activas
- **GET** `/api/categories/active`

### Obtener Categoría por ID
- **GET** `/api/categories/:id`

### Actualizar Categoría
- **PUT** `/api/categories/:id`

### Eliminar Categoría (Soft Delete)
- **DELETE** `/api/categories/:id`

### Activar Categoría
- **POST** `/api/categories/:id/activate`

### Estadísticas de Categorías
- **GET** `/api/categories/stats`

---

## 🏷️ TIPOS (`/api/types`)

### Crear Tipo
- **POST** `/api/types`
- **Body**:
```json
{
  "name": "Eliminado",
  "description": "Gasto completamente eliminado",
  "image_link": "https://example.com/image.jpg"
}
```

### Obtener Todos los Tipos
- **GET** `/api/types?page=1&limit=10&search=eliminado`

### Obtener Tipos Activos
- **GET** `/api/types/active`

### Obtener Tipo por ID
- **GET** `/api/types/:id`

### Actualizar Tipo
- **PUT** `/api/types/:id`

### Eliminar Tipo (Soft Delete)
- **DELETE** `/api/types/:id`

### Activar Tipo
- **POST** `/api/types/:id/activate`

### Estadísticas de Tipos
- **GET** `/api/types/stats`

---

## 💰 GASTOS EVITADOS (`/api/avoided-expenses`)

### Crear Gasto Evitado
- **POST** `/api/avoided-expenses`
- **Body**:
```json
{
  "user_id": 1,
  "name": "Café diario",
  "amount": 5.50,
  "category_id": 1,
  "type_id": 1,
  "expense_date": "2024-01-15",
  "description": "Evité comprar café en la cafetería"
}
```

### Obtener Todos los Gastos Evitados
- **GET** `/api/avoided-expenses?page=1&limit=10&userId=1&categoryId=1&typeId=1&startDate=2024-01-01&endDate=2024-01-31&search=café`
- **Query Params**:
  - `userId` (opcional): Filtrar por usuario
  - `categoryId` (opcional): Filtrar por categoría
  - `typeId` (opcional): Filtrar por tipo
  - `startDate` (opcional): Fecha de inicio
  - `endDate` (opcional): Fecha de fin
  - `search` (opcional): Búsqueda por nombre

### Obtener Gasto Evitado por ID
- **GET** `/api/avoided-expenses/:id`

### Obtener Gasto Evitado con Relaciones
- **GET** `/api/avoided-expenses/:id/with-relations`

### Obtener Gastos Evitados por Usuario
- **GET** `/api/avoided-expenses/user/:userId?page=1&limit=10`

### Actualizar Gasto Evitado
- **PUT** `/api/avoided-expenses/:id`

### Eliminar Gasto Evitado
- **DELETE** `/api/avoided-expenses/:id`

### Estadísticas de Ahorros del Usuario
- **GET** `/api/avoided-expenses/user/:userId/stats`

### Ahorros Mensuales del Usuario
- **GET** `/api/avoided-expenses/user/:userId/monthly-savings?year=2024&month=1`

### Ahorros por Categoría
- **GET** `/api/avoided-expenses/user/:userId/savings-by-category`

### Ahorros por Tipo
- **GET** `/api/avoided-expenses/user/:userId/savings-by-type`

---

## 📊 DÉFICITS (`/api/deficits`)

### Crear Déficit
- **POST** `/api/deficits`
- **Body**:
```json
{
  "user_id": 1,
  "name": "Vacaciones de verano",
  "amount": 1500.00,
  "start_date": "2024-06-01",
  "end_date": "2024-08-31",
  "description": "Ahorro para vacaciones"
}
```

### Obtener Todos los Déficits
- **GET** `/api/deficits?page=1&limit=10&userId=1&startDate=2024-01-01&endDate=2024-12-31&search=vacaciones`

### Obtener Déficit por ID
- **GET** `/api/deficits/:id`

### Obtener Déficits por Usuario
- **GET** `/api/deficits/user/:userId?page=1&limit=10`

### Obtener Déficits Activos del Usuario
- **GET** `/api/deficits/user/:userId/active?date=2024-01-15`

### Actualizar Déficit
- **PUT** `/api/deficits/:id`

### Eliminar Déficit
- **DELETE** `/api/deficits/:id`

### Estadísticas de Déficits del Usuario
- **GET** `/api/deficits/user/:userId/stats`

### Déficits por Rango de Fechas
- **GET** `/api/deficits/user/:userId/by-date-range?startDate=2024-01-01&endDate=2024-12-31`

---

## 🏥 SALUD DE LA API

### Verificar Estado de la API
- **GET** `/api/health`
- **Respuesta**:
```json
{
  "success": true,
  "message": "API SaveSmartTracker funcionando correctamente",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

---

## 📝 CÓDIGOS DE ESTADO HTTP

- **200**: OK - Operación exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Datos inválidos
- **404**: Not Found - Recurso no encontrado
- **409**: Conflict - Conflicto (ej: nombre duplicado)
- **500**: Internal Server Error - Error interno del servidor

---

## 🔍 EJEMPLOS DE USO

### Crear un Usuario y sus Gastos Evitados

1. **Crear Usuario**:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan123",
    "password": "password123",
    "email": "juan@email.com"
  }'
```

2. **Crear Categoría**:
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alimentación",
    "description": "Gastos en comida"
  }'
```

3. **Crear Tipo**:
```bash
curl -X POST http://localhost:3000/api/types \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Eliminado",
    "description": "Gasto completamente eliminado"
  }'
```

4. **Crear Gasto Evitado**:
```bash
curl -X POST http://localhost:3000/api/avoided-expenses \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "name": "Almuerzo en restaurante",
    "amount": 25.00,
    "category_id": 1,
    "type_id": 1,
    "expense_date": "2024-01-15",
    "description": "Evité comer fuera y comí en casa"
  }'
```

5. **Obtener Estadísticas**:
```bash
curl http://localhost:3000/api/avoided-expenses/user/1/stats
```

---

## 🚀 Próximas Funcionalidades

- [ ] Autenticación JWT
- [ ] Validación de datos con Joi/Zod
- [ ] Rate limiting
- [ ] Logging avanzado
- [ ] Documentación con Swagger
- [ ] Tests automatizados
- [ ] Exportación a CSV/Excel
- [ ] Notificaciones push
- [ ] Dashboard de métricas 