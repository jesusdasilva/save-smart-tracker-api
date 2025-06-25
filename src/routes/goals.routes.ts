import { Router } from 'express';
import * as goalsController from '../controllers/goals.controller';

const router = Router();

// Todas estas rutas ya están protegidas por verifyToken en el router principal
router.post('/', (req, res) => void goalsController.create(req, res));
router.get('/', (req, res) => void goalsController.getAll(req, res));
router.get('/:id', (req, res) => void goalsController.getById(req, res));
router.put('/:id', (req, res) => void goalsController.update(req, res));
router.delete('/:id', (req, res) => void goalsController.remove(req, res));

export default router;
