import { Router } from 'express';
import usersRoutes from './users.routes';
import categoriesRoutes from './categories.routes';
import typesRoutes from './types.routes';
import avoidedExpensesRoutes from './avoidedExpenses.routes';
import deficitsRoutes from './deficits.routes';
import goalsRoutes from './goals.routes';
import authRoutes from './auth.routes';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Rutas de autenticación (públicas y protegidas)
router.use('/auth', authRoutes);

// Rutas protegidas (requieren JWT) - Todos los datos del usuario
router.use('/users', verifyToken, usersRoutes);
router.use('/categories', verifyToken, categoriesRoutes);
router.use('/types', verifyToken, typesRoutes);
router.use('/avoided-expenses', verifyToken, avoidedExpensesRoutes);
router.use('/deficits', verifyToken, deficitsRoutes);
router.use('/goals', verifyToken, goalsRoutes);

// Ruta de salud de la API
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API SaveSmartTracker funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;
