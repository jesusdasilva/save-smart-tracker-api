import { Request, Response } from 'express';

export const helloController = (req: Request, res: Response) => {
  res.json({ message: '¡Hola desde el controlador!' });
};