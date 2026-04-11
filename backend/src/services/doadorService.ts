import prisma from '../config/prisma';
import PDFDocument from 'pdfkit';
import { UnauthorizedError } from '../utils/errors';

export const getDoadorProfile = async (id: number) => {
  const doador = await prisma.doador.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      cpf: true,
      telefone: true,
      tipo_sanguineo: true,
      criado_em: true,
    },
  });

  if (!doador) {
    throw new UnauthorizedError('Usuário não encontrado.');
  }

  return doador;
};

export const generateDonationCertificate = async (doadorId: number): Promise<Buffer> => {
  const doador = await prisma.doador.findUnique({ where: { id: doadorId } });

  if (!doador) {
    throw new UnauthorizedError('Doador não encontrado.');
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    // --- Design do Certificado ---
    
    // Borda decorativa
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

    doc.moveDown(4);
    doc.fontSize(40).fillColor('#b22222').text('CERTIFICADO DE DOAÇÃO', { align: 'center' });
    
    doc.moveDown(2);
    doc.fontSize(20).fillColor('black').text('Certificamos para os devidos fins que,', { align: 'center' });
    
    doc.moveDown(1);
    doc.fontSize(30).font('Helvetica-Bold').text(doador.nome, { align: 'center' });
    
    doc.moveDown(1);
    doc.fontSize(18).font('Helvetica').text(
      `Realizou uma doação de sangue voluntária, contribuindo para salvar vidas através do projeto Doe+.`,
      { align: 'center' }
    );

    doc.moveDown(2);
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.fontSize(14).text(`Emitido em: ${dataAtual}`, { align: 'right' });

    doc.end();
  });
};