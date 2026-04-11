import { Request, Response, NextFunction } from 'express';
import * as doadorService from '../services/doadorService';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // O doadorId foi injetado pelo authMiddleware global!
    const id = req.doadorId as number;
    
    const profile = await doadorService.getDoadorProfile(id);
    
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};