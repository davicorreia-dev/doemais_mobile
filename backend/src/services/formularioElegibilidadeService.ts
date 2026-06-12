import prisma from '../config/prisma';
import { CreateFormularioElegibilidadeDto } from '../dtos/doador.dto';
import { UnauthorizedError, BadRequestError } from '../utils/errors';

export const createFormularioElegibilidade = async (
  doadorId: number,
  formularioData: CreateFormularioElegibilidadeDto
) => {
  // Verifica se o doador existe
  const doadorExists = await prisma.doador.findUnique({
    where: { id: doadorId },
  });

  if (!doadorExists) {
    throw new UnauthorizedError('Usuário não encontrado.');
  }

  // Busca o formulário mais recente para herdar os outros campos
  const lastForm = await prisma.formulario_Elegibilidade.findFirst({
    where: { doador_id: doadorId },
    orderBy: { data_preenchimento: 'desc' },
  });

  // Cria o formulário de elegibilidade herdando os valores anteriores
  const formulario = await prisma.formulario_Elegibilidade.create({
    data: {
      doador_id: doadorId,
      data_preenchimento: new Date(),
      teve_resfriado: formularioData.teve_resfriado !== undefined ? formularioData.teve_resfriado : (lastForm?.teve_resfriado ?? false),
      data_fim_sintomas_resfriado: formularioData.data_fim_sintomas_resfriado !== undefined ? formularioData.data_fim_sintomas_resfriado : lastForm?.data_fim_sintomas_resfriado,
      esta_gravida: formularioData.esta_gravida !== undefined ? formularioData.esta_gravida : (lastForm?.esta_gravida ?? false),
      data_parto: formularioData.data_parto !== undefined ? formularioData.data_parto : lastForm?.data_parto,
      esta_amamentando: formularioData.esta_amamentando !== undefined ? formularioData.esta_amamentando : (lastForm?.esta_amamentando ?? false),
      fez_tatuagem: formularioData.fez_tatuagem !== undefined ? formularioData.fez_tatuagem : (lastForm?.fez_tatuagem ?? false),
      data_tatuagem: formularioData.data_tatuagem !== undefined ? formularioData.data_tatuagem : lastForm?.data_tatuagem,
      fez_piercing: formularioData.fez_piercing !== undefined ? formularioData.fez_piercing : (lastForm?.fez_piercing ?? false),
      data_piercing: formularioData.data_piercing !== undefined ? formularioData.data_piercing : lastForm?.data_piercing,
      esteve_area_malaria: formularioData.esteve_area_malaria !== undefined ? formularioData.esteve_area_malaria : (lastForm?.esteve_area_malaria ?? false),
      data_retorno_area_malaria: formularioData.data_retorno_area_malaria !== undefined ? formularioData.data_retorno_area_malaria : lastForm?.data_retorno_area_malaria,
      teve_hepatite: formularioData.teve_hepatite !== undefined ? formularioData.teve_hepatite : (lastForm?.teve_hepatite ?? false),
      data_diagnostico_hepatite: formularioData.data_diagnostico_hepatite !== undefined ? formularioData.data_diagnostico_hepatite : lastForm?.data_diagnostico_hepatite,
      tipo_hepatite: formularioData.tipo_hepatite !== undefined ? formularioData.tipo_hepatite : lastForm?.tipo_hepatite,
      usou_drogas_injetaveis: formularioData.usou_drogas_injetaveis !== undefined ? formularioData.usou_drogas_injetaveis : (lastForm?.usou_drogas_injetaveis ?? false),
      teve_malaria: formularioData.teve_malaria !== undefined ? formularioData.teve_malaria : (lastForm?.teve_malaria ?? false),
      status_aprovacao: 'PENDENTE', // Será analisado por um profissional
    },
  });

  return {
    id: formulario.id,
    status_aprovacao: formulario.status_aprovacao,
    data_preenchimento: formulario.data_preenchimento,
    message: 'Formulário de elegibilidade enviado com sucesso. Aguarde análise dos profissionais.',
  };
};

export const getFormularioElegibilidade = async (doadorId: number) => {
  // Verifica se o doador existe
  const doadorExists = await prisma.doador.findUnique({
    where: { id: doadorId },
  });

  if (!doadorExists) {
    throw new UnauthorizedError('Usuário não encontrado.');
  }

  // Busca o formulário mais recente
  const formulario = await prisma.formulario_Elegibilidade.findFirst({
    where: { doador_id: doadorId },
    orderBy: { data_preenchimento: 'desc' },
  });

  if (!formulario) {
    throw new BadRequestError('Nenhum formulário de elegibilidade encontrado.');
  }

  return formulario;
};

export const getAllFormulariosElegibilidade = async (doadorId: number) => {
  // Verifica se o doador existe
  const doadorExists = await prisma.doador.findUnique({
    where: { id: doadorId },
  });

  if (!doadorExists) {
    throw new UnauthorizedError('Usuário não encontrado.');
  }

  // Busca todos os formulários do doador
  const formularios = await prisma.formulario_Elegibilidade.findMany({
    where: { doador_id: doadorId },
    orderBy: { data_preenchimento: 'desc' },
  });

  return formularios;
};
