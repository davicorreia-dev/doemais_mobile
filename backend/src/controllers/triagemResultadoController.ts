import { NextFunction, Request, Response } from 'express';
import { CreateTriagemResultadoDto } from '../dtos/doador.dto';
import * as triagemService from '../services/triagemResultadoService';

export const createTriagem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await triagemService.createTriagemResultado(req.doadorId as number, req.body as CreateTriagemResultadoDto);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getLatestTriagens = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(await triagemService.getLatestTriagens(req.doadorId as number));
  } catch (error) {
    next(error);
  }
};

export const resetTriagens = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(await triagemService.resetTriagens(req.doadorId as number));
  } catch (error) {
    next(error);
  }
};
