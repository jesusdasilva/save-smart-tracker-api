# Sistema de Registro y Autenticación

## Endpoints Disponibles

### Registro Local
**POST** `/api/register`

**Body:**
```json
{
  "username": "usuario123",
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "username": "usuario123",
      "email": "usuario@example.com",
      "provider": "local",
      "avatar_url": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login Local
**POST** `/api/login`

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "username": "usuario123",
      "email": "usuario@example.com",
      "provider": "local",
      "avatar_url": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Google OAuth
**GET** `/api/auth/google`
- Inicia el flujo de autenticación con Google
- Debe ser abierto en navegador

**GET** `/api/auth/google/callback`
- Endpoint de callback de Google OAuth
- Redirecciona al frontend con el token

### Verificación de Disponibilidad

**GET** `/api/check-email/:email`
```json
{
  "success": true,
  "data": {
    "email": "test@example.com",
    "available": true,
    "provider": null
  }
}
```

**GET** `/api/check-username/:username`
```json
{
  "success": true,
  "data": {
    "username": "testuser",
    "available": false
  }
}
```

### Perfil de Usuario (Protegido)
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Flujos de Autenticación

### 1. Registro Local
1. El usuario envía datos de registro a `/api/register`
2. Se valida el formato del email y la longitud de la contraseña
3. Se verifica que el email y username no estén en uso
4. Se hashea la contraseña con bcrypt
5. Se crea el usuario en la base de datos con `provider: 'local'`
6. Se genera un JWT y se devuelve junto con los datos del usuario

### 2. Login Local
1. El usuario envía email y contraseña a `/api/login`
2. Se busca el usuario por email
3. Se verifica que sea un usuario local (no de Google)
4. Se compara la contraseña hasheada
5. Se verifica que la cuenta esté activa
6. Se genera un JWT y se devuelve junto con los datos del usuario

### 3. Google OAuth
1. El usuario accede a `/api/auth/google` desde el navegador
2. Google redirecciona a `/api/auth/google/callback`
3. Passport procesa la respuesta de Google:
   - Si el usuario existe (por google_id), se autentica
   - Si existe por email, se vincula la cuenta
   - Si no existe, se crea un nuevo usuario
4. Se genera un JWT y redirecciona al frontend

## Validaciones

### Registro Local:
- Username, email y password son requeridos
- Email debe tener formato válido
- Password debe tener al menos 6 caracteres
- Email y username deben ser únicos

### Login Local:
- Email y password son requeridos
- El usuario debe existir y ser de tipo 'local'
- La contraseña debe coincidir
- La cuenta debe estar activa

## Manejo de Errores

### Códigos de Estado:
- **400**: Datos inválidos o faltantes
- **401**: Credenciales inválidas o no autenticado
- **409**: Email o username ya en uso
- **500**: Error interno del servidor

### Mensajes de Error Comunes:
- "Username, email y password son requeridos"
- "Formato de email inválido"
- "La contraseña debe tener al menos 6 caracteres"
- "El email ya está registrado"
- "El username ya está en uso"
- "Credenciales inválidas"
- "Este email está registrado con Google. Usa 'Iniciar sesión con Google'"
- "Cuenta desactivada. Contacta al soporte"

## Seguridad

- Las contraseñas se hashean con bcrypt (salt rounds: 12)
- Los JWT se firman con la clave secreta de `JWT_SECRET`
- Las rutas protegidas requieren Bearer token en el header Authorization
- Los usuarios de Google no pueden hacer login local (y viceversa)
- Las cuentas pueden ser desactivadas (soft delete)

## Variables de Entorno Requeridas

```env
JWT_SECRET=tu_clave_secreta_jwt
SESSION_SECRET=tu_clave_secreta_session
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```
