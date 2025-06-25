import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { 
  registerLocal, 
  loginLocal, 
  checkEmailAvailability, 
  checkUsernameAvailability 
} from '../controllers/register.controller';
import { verifyToken, generateToken } from '../middleware/auth';
import { UsersService } from '../services/users.service';

const router = Router();

// Rutas de registro y login local
router.post('/register', (req, res) => void registerLocal(req, res));
router.post('/login', (req, res) => void loginLocal(req, res));

// Rutas de verificación de disponibilidad
router.get('/check-email/:email', (req, res) => void checkEmailAvailability(req, res));
router.get('/check-username/:username', (req, res) => void checkUsernameAvailability(req, res));

// Rutas de autenticación con Google
router.get('/google', authController.googleAuth);
router.get('/google/callback', 
  authController.googleCallback, 
  authController.googleCallbackSuccess
);

// Rutas protegidas
router.get('/profile', verifyToken, (req, res) => void authController.getProfile(req, res));
router.post('/logout', (req, res) => void authController.logout(req, res));

// Endpoint de prueba para simular login Google (solo para testing)
router.post('/test-google', (req, res) => void (async () => {
  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email y name son requeridos para el test'
      });
    }

    // Simular datos de Google
    const fakeProfile = {
      id: `google_test_${Date.now()}`,
      displayName: name,
      emails: [{ value: email }],
      photos: [{ value: 'https://via.placeholder.com/150' }]
    };

    // Usar la misma lógica que el passport callback
    const usersService = new UsersService();
    
    // Buscar usuario existente por email
    let user = await usersService.findByEmail(email);
    
    if (!user) {
      // Crear nuevo usuario simulando Google OAuth
      const newUserData = {
        username: name.replace(/\s+/g, '_').toLowerCase(),
        email: email,
        google_id: fakeProfile.id,
        avatar_url: fakeProfile.photos[0].value,
        provider: 'google' as const,
        is_active: true
      };
      
      user = await usersService.createUser(newUserData);
    } else if (!user.google_id) {
      // Actualizar usuario existente con datos simulados de Google
      await usersService.update(user.id, {
        google_id: fakeProfile.id,
        avatar_url: fakeProfile.photos[0].value,
        provider: 'google'
      });
      user = await usersService.findById(user.id);
    }

    if (!user) {
      return res.status(500).json({
        success: false,
        message: 'Error al crear/actualizar usuario'
      });
    }

    // Generar JWT
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login simulado exitoso (solo para testing)',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          provider: user.provider,
          avatar_url: user.avatar_url
        },
        token
      }
    });
  } catch (error) {
    console.error('Error en test de Google:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
})());

export default router;
