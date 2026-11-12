import { Router } from 'express';
import {
  createFormulario,
  getFormulario,
  getAllFormularios,
} from '../controllers/formularioElegibilidadeController';
import validationMiddleware from '../middlewares/validation.middleware';
import { CreateFormularioElegibilidadeDto } from '../dtos/doador.dto';
import { createTriagem, getLatestTriagens, resetTriagens } from '../controllers/triagemResultadoController';
import { CreateTriagemResultadoDto } from '../dtos/doador.dto';
import { CreateSolicitacaoCorrecaoDto, FinalizarSolicitacaoCorrecaoDto, ResolverSolicitacaoCorrecaoDto } from '../dtos/doador.dto';
import * as correcao from '../controllers/solicitacaoCorrecaoController';
import { integrationAuth } from '../middlewares/integration.middleware';

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

router.post('/triagens', validationMiddleware(CreateTriagemResultadoDto), createTriagem);
router.get('/triagens/atual', getLatestTriagens);
router.delete('/triagens', resetTriagens);
router.post('/correcoes', validationMiddleware(CreateSolicitacaoCorrecaoDto), correcao.create);
router.get('/correcoes', correcao.mine);
router.patch('/correcoes/:id/finalizar', validationMiddleware(FinalizarSolicitacaoCorrecaoDto), correcao.finish);

router.get('/integracoes/hemocentros/correcoes', integrationAuth, correcao.pending);
router.patch('/integracoes/hemocentros/correcoes/:id', integrationAuth, validationMiddleware(ResolverSolicitacaoCorrecaoDto), correcao.resolve);

export default router;
