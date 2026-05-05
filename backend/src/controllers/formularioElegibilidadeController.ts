import { Request, Response, NextFunction } from 'express';
import * as formularioService from '../services/formularioElegibilidadeService';
import { CreateFormularioElegibilidadeDto } from '../dtos/doador.dto';

export const createFormulario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doadorId = req.doadorId as number;
    const formularioData: CreateFormularioElegibilidadeDto = req.body;

    const result = await formularioService.createFormularioElegibilidade(doadorId, formularioData);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getFormulario = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doadorId = req.doadorId as number;

    const formulario = await formularioService.getFormularioElegibilidade(doadorId);

    res.status(200).json(formulario);
  } catch (error) {
    next(error);
  }
};

export const getAllFormularios = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doadorId = req.doadorId as number;

    const formularios = await formularioService.getAllFormulariosElegibilidade(doadorId);

    res.status(200).json(formularios);
  } catch (error) {
    next(error);
  }
};
