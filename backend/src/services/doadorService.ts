import prisma from '../config/prisma';
import PDFDocument from 'pdfkit';
import { UnauthorizedError, ConflictError } from '../utils/errors';
import { UpdateDoadorDto } from '../dtos/doador.dto';
import { DoadorResponse } from '../types/index';
import Logger from '../utils/logger';

const MODULE = 'DoadorService';

export const getDoadorProfile = async (id: number): Promise<DoadorResponse> => {
  Logger.debug(MODULE, `Buscando perfil do doador: ${id}`);

  const doador = await prisma.doador.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      cpf: true,
      telefone: true,
      cidade: true,
      cep: true,
      tipo_sanguineo: true,
      genero: true,
      data_nascimento: true,
      peso_kg: true,
      criado_em: true,
    },
  });

  if (!doador) {
    Logger.warn(MODULE, `Doador não encontrado: ${id}`);
    throw new UnauthorizedError('Usuário não encontrado.');
  }

  Logger.info(MODULE, `Perfil do doador ${id} recuperado com sucesso.`);
  return doador;
};

export const updateDoadorProfile = async (
  id: number,
  updateData: UpdateDoadorDto
): Promise<DoadorResponse> => {
  Logger.debug(MODULE, `Atualizando perfil do doador: ${id}`, updateData);

  // Verifica se o doador existe
  const doadorExists = await prisma.doador.findUnique({
    where: { id },
  });

  if (!doadorExists) {
    Logger.warn(MODULE, `Tentativa de atualizar doador inexistente: ${id}`);
    throw new UnauthorizedError('Usuário não encontrado.');
  }

  // Valida se o email já é usado por outro doador
  if (updateData.email && updateData.email !== doadorExists.email) {
    const emailExists = await prisma.doador.findUnique({
      where: { email: updateData.email },
    });

    if (emailExists) {
      Logger.warn(MODULE, `Tentativa de usar email já registrado: ${updateData.email}`);
      throw new ConflictError('Este email já está em uso por outro usuário.');
    }
  }

  // Construir objeto de atualização dinamicamente (apenas campos fornecidos)
  const updatePayload: Record<string, any> = {};

  if (updateData.nome !== undefined) updatePayload.nome = updateData.nome;
  if (updateData.email !== undefined) updatePayload.email = updateData.email;
  if (updateData.telefone !== undefined) updatePayload.telefone = updateData.telefone;
  if (updateData.cidade !== undefined) updatePayload.cidade = updateData.cidade;
  if (updateData.cep !== undefined) updatePayload.cep = updateData.cep;
  if (updateData.data_nascimento !== undefined)
    updatePayload.data_nascimento = updateData.data_nascimento;
  if (updateData.peso_kg !== undefined) updatePayload.peso_kg = updateData.peso_kg;
  if (updateData.genero !== undefined) updatePayload.genero = updateData.genero;
  if (updateData.tipo_sanguineo !== undefined)
    updatePayload.tipo_sanguineo = updateData.tipo_sanguineo;

  // Atualiza apenas os campos fornecidos
  const updatedDoador = await prisma.doador.update({
    where: { id },
    data: updatePayload,
    select: {
      id: true,
      nome: true,
      email: true,
      cpf: true,
      telefone: true,
      cidade: true,
      cep: true,
      tipo_sanguineo: true,
      genero: true,
      data_nascimento: true,
      peso_kg: true,
      criado_em: true,
    },
  });

  Logger.info(MODULE, `Perfil do doador ${id} atualizado com sucesso.`);
  return updatedDoador;
};


export const generateDonationCertificate = async (
  doadorId: number
): Promise<Buffer> => {
  Logger.debug(MODULE, `Gerando certificado de doação para doador: ${doadorId}`);

  const doador = await prisma.doador.findUnique({
    where: { id: doadorId },
  });

  if (!doador) {
    Logger.warn(MODULE, `Tentativa de gerar certificado para doador inexistente: ${doadorId}`);
    throw new UnauthorizedError('Doador não encontrado.');
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 50,
    });
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => {
      Logger.info(MODULE, `Certificado gerado com sucesso para doador: ${doadorId}`);
      resolve(Buffer.concat(buffers));
    });
    doc.on('error', (err) => {
      Logger.error(MODULE, `Erro ao gerar certificado para doador: ${doadorId}`, err);
      reject(err);
    });

    // Design do Certificado

    // Borda decorativa
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

    doc.moveDown(4);

    // Título
    doc
      .fontSize(28)
      .font('Helvetica-Bold')
      .text('CERTIFICADO DE DOAÇÃO', { align: 'center' });

    doc.moveDown();

    // Linha decorativa
    doc
      .strokeColor('#d32f2f')
      .lineWidth(2)
      .moveTo(100, doc.y)
      .lineTo(doc.page.width - 100, doc.y)
      .stroke();

    doc.moveDown(3);

    // Corpo do certificado
    doc.fontSize(12).font('Helvetica').fillColor('black');

    doc.text('Certificamos que', { align: 'center' });
    doc.moveDown(1);

    // Nome do doador em destaque
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#d32f2f');
    doc.text(doador.nome.toUpperCase(), { align: 'center' });
    doc.moveDown(1);

    // CPF e tipo sanguíneo
    doc.fontSize(11).font('Helvetica').fillColor('black');
    doc.text(`CPF: ${doador.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}`, {
      align: 'center',
    });
    if (doador.tipo_sanguineo) {
      doc.text(`Tipo Sanguíneo: ${doador.tipo_sanguineo}`, { align: 'center' });
    }

    doc.moveDown(2);

    // Mensagem
    doc.fontSize(12);
    doc.text(
      'realizou com êxito a doação de sangue, contribuindo para salvar vidas e promover a saúde pública.',
      { align: 'justify' }
    );

    doc.moveDown(3);

    // Data
    const data = new Date();
    const dataFormatada = data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.fontSize(11).text(`Em ${dataFormatada}.`, { align: 'center' });

    doc.moveDown(4);

    // Linha para assinatura
    doc.moveTo(100, doc.y).lineTo(doc.page.width - 100, doc.y).stroke();
    doc.moveDown(0.5);
    doc.fontSize(10).text('Hemocentro', { align: 'center' });

    doc.end();
  });
};