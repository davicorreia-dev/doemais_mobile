import { Router } from 'express';
import {
  createFormulario,
  getFormulario,
  getAllFormularios,
} from '../controllers/formularioElegibilidadeController';
import validationMiddleware from '../middlewares/validation.middleware';
import { CreateFormularioElegibilidadeDto } from '../dtos/doador.dto';

const router = Router();

// Rota POST para criar/enviar formulário de elegibilidade
router.post(
  '/elegibilidade',
  validationMiddleware(CreateFormularioElegibilidadeDto),
  createFormulario
);

// Rota GET para recuperar o formulário mais recente
router.get('/elegibilidade', getFormulario);

// Rota GET para recuperar todos os formulários do doador
router.get('/elegibilidade/historico', getAllFormularios);

export default router;
