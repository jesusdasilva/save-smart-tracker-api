import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth';
import { UsersService } from '../services/users.service';

const usersService = new UsersService();

// Registro con email y contraseña (local)
export const registerLocal = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validaciones básicas
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email y password son requeridos'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Validar contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe por email
    const existingEmail = await usersService.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Verificar si el username ya existe
    const existingUsername = await usersService.findByUsername(username);
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'El username ya está en uso'
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const newUser = await usersService.createUser({
      username,
      email,
      password: hashedPassword,
      provider: 'local',
      is_active: true
    });

    // Generar JWT
    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          provider: newUser.provider,
          avatar_url: newUser.avatar_url
        },
        token
      }
    });
  } catch (error) {
    console.error('Error en registro local:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Login con email y contraseña (local)
export const loginLocal = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y password son requeridos'
      });
    }

    // Buscar usuario por email
    const user = await usersService.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar que sea un usuario local (no de Google)
    if (user.provider !== 'local' || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Este email está registrado con Google. Usa "Iniciar sesión con Google"'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar que el usuario esté activo
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada. Contacta al soporte'
      });
    }

    // Generar JWT
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login exitoso',
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
    console.error('Error en login local:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Verificar disponibilidad de email
export const checkEmailAvailability = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido'
      });
    }

    const user = await usersService.findByEmail(email);
    const isAvailable = !user;

    res.json({
      success: true,
      data: {
        email,
        available: isAvailable,
        provider: user?.provider || null
      }
    });
  } catch (error) {
    console.error('Error al verificar email:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Verificar disponibilidad de username
export const checkUsernameAvailability = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username es requerido'
      });
    }

    const user = await usersService.findByUsername(username);
    const isAvailable = !user;

    res.json({
      success: true,
      data: {
        username,
        available: isAvailable
      }
    });
  } catch (error) {
    console.error('Error al verificar username:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
