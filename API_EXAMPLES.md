# Ejemplos de Uso - API de Registro SaveSmartTracker

## 1. Registro de Usuario Local

### Ejemplo con cURL:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan_perez",
    "email": "juan.perez@example.com",
    "password": "miPassword123"
  }'
```

### Ejemplo con Postman:
- **Método**: POST
- **URL**: `http://localhost:5000/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "username": "maria_garcia",
  "email": "maria.garcia@example.com",
  "password": "password456"
}
```

## 2. Login Local

### Ejemplo con cURL:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@example.com",
    "password": "miPassword123"
  }'
```

### Ejemplo con Postman:
- **Método**: POST
- **URL**: `http://localhost:5000/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "email": "maria.garcia@example.com",
  "password": "password456"
}
```

## 3. Verificar Disponibilidad de Email

### Ejemplo con cURL:
```bash
curl -X GET http://localhost:5000/api/auth/check-email/test@example.com
```

### Ejemplo con Postman:
- **Método**: GET
- **URL**: `http://localhost:5000/api/auth/check-email/test@example.com`

## 4. Verificar Disponibilidad de Username

### Ejemplo con cURL:
```bash
curl -X GET http://localhost:5000/api/auth/check-username/testuser
```

### Ejemplo con Postman:
- **Método**: GET
- **URL**: `http://localhost:5000/api/auth/check-username/testuser`

## 5. Google OAuth (Solo desde Navegador)

### Iniciar autenticación:
Abrir en navegador: `http://localhost:5000/api/auth/google`

### Callback:
Google redireccionará automáticamente a: `http://localhost:5000/api/auth/google/callback`

## 6. Simulación de Google OAuth (Para Testing)

### Ejemplo con cURL:
```bash
curl -X POST http://localhost:5000/api/auth/test-google \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.google@gmail.com",
    "name": "Test Google User"
  }'
```

### Ejemplo con Postman:
- **Método**: POST
- **URL**: `http://localhost:5000/api/auth/test-google`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "email": "google.test@gmail.com",
  "name": "Google Test User"
}
```

## 7. Obtener Perfil (Requiere JWT)

### Ejemplo con cURL:
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer tu_jwt_token_aqui"
```

### Ejemplo con Postman:
- **Método**: GET
- **URL**: `http://localhost:5000/api/auth/profile`
- **Headers**: `Authorization: Bearer tu_jwt_token_aqui`

## 8. Logout

### Ejemplo con cURL:
```bash
curl -X POST http://localhost:5000/api/auth/logout
```

### Ejemplo con Postman:
- **Método**: POST
- **URL**: `http://localhost:5000/api/auth/logout`

## Respuestas de Ejemplo

### Registro Exitoso:
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "username": "juan_perez",
      "email": "juan.perez@example.com",
      "provider": "local",
      "avatar_url": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYzOTQ4MjA0MywiZXhwIjoxNjM5NTY4NDQzfQ.example_token"
  }
}
```

### Error de Validación:
```json
{
  "success": false,
  "message": "El email ya está registrado"
}
```

### Error de Credenciales:
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

## Notas Importantes

1. **JWT Token**: Guarda el token recibido al registrarte o hacer login, lo necesitarás para acceder a las rutas protegidas.

2. **Headers de Autorización**: Para rutas protegidas, incluye el header:
   ```
   Authorization: Bearer tu_jwt_token
   ```

3. **Google OAuth**: Solo funciona desde navegador, no desde Postman (a menos que uses el endpoint de testing).

4. **Testing**: Usa el endpoint `/api/auth/test-google` para simular Google OAuth durante desarrollo.

5. **Variables de Entorno**: Asegúrate de tener configuradas todas las variables en tu archivo `.env`.

## Flujo Completo de Testing

1. **Registro**: POST `/api/auth/register`
2. **Guarda el token** de la respuesta
3. **Accede a rutas protegidas** usando el token
4. **O haz login**: POST `/api/auth/login` con credenciales
5. **Prueba Google OAuth**: POST `/api/auth/test-google` para simular
