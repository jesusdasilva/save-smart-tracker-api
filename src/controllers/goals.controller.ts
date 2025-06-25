import { Request, Response } from 'express';
import * as goalsService from '../services/goals.service';

export const create = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const goal = await goalsService.createGoal(data);
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear meta', details: error });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const user_id = Number(req.query.user_id);
    if (!user_id || isNaN(user_id)) {
      return res.status(400).json({ error: 'user_id es requerido y debe ser un número' });
    }
    const goals = await goalsService.getAllGoals(user_id);
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener metas', details: error });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const goal = await goalsService.getGoalById(id);
    if (goal.length === 0) {
      return res.status(404).json({ error: 'Meta no encontrada' });
    }
    res.json(goal[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener meta', details: error });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const updated = await goalsService.updateGoal(id, data);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar meta', details: error });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await goalsService.deleteGoal(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar meta', details: error });
  }
};
