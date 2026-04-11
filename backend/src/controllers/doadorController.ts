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

export const downloadCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.doadorId as number;
    const pdfBuffer = await doadorService.generateDonationCertificate(id);

    // Headers para download do arquivo
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=certificado-doacao.pdf');
    
    res.status(200).send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};