import { Router } from 'express';
import { helloController } from '../controllers';
import * as avoidedExpensesController from '../controllers/avoidedExpenses.controller';

const router = Router();

router.get('/hello', helloController);

router.post('/avoided-expenses', avoidedExpensesController.create);
router.get('/avoided-expenses', avoidedExpensesController.getAll);
router.put('/avoided-expenses/:id', avoidedExpensesController.update);
router.delete('/avoided-expenses/:id', avoidedExpensesController.remove);
router.get('/avoided-expenses/export', avoidedExpensesController.exportCsv);

export default router;
