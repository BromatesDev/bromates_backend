import { Request, Response } from 'express';

export const testApi = (req: Request, res: Response): void => {
  const currentTime = new Date().toLocaleString();
  res.send(`API Connected to test API Bromates_v1.at: ${currentTime}`);
};
