import { Request, Response, NextFunction } from 'express';
import * as doadorService from '../services/doadorService';
import { UpdateDoadorDto } from '../dtos/doador.dto';
import ApiResponseHandler from '../utils/response';

/**
 * Busca o perfil do doador autenticado
 * 
 * GET /api/doadores/me
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.doadorId as number;
    const profile = await doadorService.getDoadorProfile(id);

    ApiResponseHandler.success(
      res,
      'Perfil carregado com sucesso.',
      profile,
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Atualiza o perfil do doador autenticado
 * 
 * PUT /api/doadores/me
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.doadorId as number;
    const updateData: UpdateDoadorDto = req.body;

    const updatedProfile = await doadorService.updateDoadorProfile(
      id,
      updateData
    );

    ApiResponseHandler.success(
      res,
      'Perfil atualizado com sucesso.',
      { doador: updatedProfile },
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Gera e faz download do certificado de doação
 * 
 * GET /api/doadores/certificate
 */
export const downloadCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.doadorId as number;
    const pdfBuffer = await doadorService.generateDonationCertificate(id);

    // Headers para download do arquivo
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=certificado-doacao.pdf'
    );

    res.status(200).send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};