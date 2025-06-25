import { Request, Response } from 'express';
import passport from '../config/passport';
import { generateToken } from '../middleware/auth';

export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

export const googleCallback = passport.authenticate('google', {
  failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`
});

export const googleCallbackSuccess = (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }

    const token = generateToken((req.user as any).id);
    
    // Redireccionar al frontend con el token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

export const getProfile = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  
  const user = req.user as any;
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.json({ message: 'Sesión cerrada exitosamente' });
  });
};
