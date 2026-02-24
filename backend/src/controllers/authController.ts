import { Request, Response, NextFunction } from 'express'; 
import { RegisterDoadorDto, LoginDoadorDto, RefreshTokenDto } from '../dtos/doador.dto';
import { registerDoador, loginDoador, refreshAccessToken, logout} from '../services/authService';

export const register = async (req: Request, res: Response, next: NextFunction) => { // Adicionar next
  try {
    const doadorData: RegisterDoadorDto = req.body;
    const doador = await registerDoador(doadorData);
    res.status(201).json({ message: 'Doador registrado com sucesso.', doador });

  } catch (error: any) {
    next(error); 
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => { // Adicionar next
  try {
    const loginData: LoginDoadorDto = req.body;
    const result = await loginDoador(loginData);
    res.status(200).json(result);

  } catch (error: any) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const tokenData: RefreshTokenDto = req.body;
    const result = await refreshAccessToken(tokenData);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const tokenData: RefreshTokenDto = req.body;
    const result = await logout(tokenData);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao fazer logout.' });
  }
};