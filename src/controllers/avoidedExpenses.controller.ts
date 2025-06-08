import { Request, Response } from 'express';
import * as avoidedExpensesService from '../services/avoidedExpenses.service';

export const create = async (req: Request, res: Response) => {
  try {
    // user_id debería venir del token o sesión, aquí se asume en el body
    const { user_id, ...data } = req.body;
    const expense = await avoidedExpensesService.createAvoidedExpense({ user_id, ...data });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear gasto evitado', details: error });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const user_id = Number(req.query.user_id); // debería venir del token/sesión
    const expenses = await avoidedExpensesService.getAllAvoidedExpenses(user_id);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener gastos evitados', details: error });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const updated = await avoidedExpensesService.updateAvoidedExpense(id, data);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar gasto evitado', details: error });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await avoidedExpensesService.deleteAvoidedExpense(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar gasto evitado', details: error });
  }
};

export const exportCsv = async (req: Request, res: Response) => {
  try {
    const user_id = Number(req.query.user_id);
    const expenses = await avoidedExpensesService.exportAvoidedExpenses(user_id);
    const csv = [
      'id,user_id,name,amount,category,date,description,created_at,updated_at',
      ...expenses.map(e => `${e.id},${e.user_id},"${e.name}",${e.amount},${e.category},${e.date},"${e.description || ''}",${e.created_at},${e.updated_at}`)
    ].join('\n');
    res.header('Content-Type', 'text/csv');
    res.attachment('avoided_expenses.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Error al exportar gastos evitados', details: error });
  }
};
