import { Request, Response, NextFunction } from 'express';
import * as doadorService from '../services/doadorService';
import { UpdateDoadorDto } from '../dtos/doador.dto';

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

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.doadorId as number;
    const updateData: UpdateDoadorDto = req.body;

    const updatedProfile = await doadorService.updateDoadorProfile(id, updateData);

    res.status(200).json({
      message: 'Perfil atualizado com sucesso.',
      doador: updatedProfile,
    });
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