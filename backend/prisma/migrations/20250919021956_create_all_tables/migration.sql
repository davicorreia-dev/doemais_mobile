-- CreateTable
CREATE TABLE "public"."Doador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "pesoKg" DOUBLE PRECISION,
    "genero" TEXT,
    "tipoSanguineo" TEXT,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Doador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Hemocentro" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT,
    "avaliacao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hemocentro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Agendamento" (
    "id" SERIAL NOT NULL,
    "doadorId" INTEGER NOT NULL,
    "hemocentroId" INTEGER NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Formulario_Elegibilidade" (
    "id" SERIAL NOT NULL,
    "doadorId" INTEGER NOT NULL,
    "dataPreenchimento" TIMESTAMP(3) NOT NULL,
    "teveResfriado" BOOLEAN NOT NULL DEFAULT false,
    "dataFimSintomasResfriado" TIMESTAMP(3),
    "estaGravida" BOOLEAN NOT NULL DEFAULT false,
    "dataParto" TIMESTAMP(3),
    "estaAmamentando" BOOLEAN NOT NULL DEFAULT false,
    "fezTatuagem" BOOLEAN NOT NULL DEFAULT false,
    "dataTatuagem" TIMESTAMP(3),
    "esteveAreaMalaria" BOOLEAN NOT NULL DEFAULT false,
    "dataRetornoAreaMalaria" TIMESTAMP(3),
    "teveHepatite" BOOLEAN NOT NULL DEFAULT false,
    "dataDiagnosticoHepatite" TIMESTAMP(3),
    "tipoHepatite" TEXT,
    "usouDrogasInjetaveis" BOOLEAN NOT NULL DEFAULT false,
    "teveMalaria" BOOLEAN NOT NULL DEFAULT false,
    "statusAprovacao" TEXT NOT NULL,

    CONSTRAINT "Formulario_Elegibilidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Historico_Clinico" (
    "id" SERIAL NOT NULL,
    "doadorId" INTEGER NOT NULL,
    "dataAvaliacao" TIMESTAMP(3) NOT NULL,
    "historicoHepatite" BOOLEAN NOT NULL DEFAULT false,
    "historicoDoencaChagas" BOOLEAN NOT NULL DEFAULT false,
    "historicoHivAids" BOOLEAN NOT NULL DEFAULT false,
    "historicoHtlvII" BOOLEAN NOT NULL DEFAULT false,
    "usoDrogasInjetaveis" BOOLEAN NOT NULL DEFAULT false,
    "detalhesAdicionais" TEXT,
    "aptoDoacao" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Historico_Clinico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doacao" (
    "id" SERIAL NOT NULL,
    "agendamentoId" INTEGER NOT NULL,
    "dataRealizacao" TIMESTAMP(3) NOT NULL,
    "quantidadeMl" INTEGER NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Doacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Estoque_Sangue" (
    "id" SERIAL NOT NULL,
    "doacaoId" INTEGER NOT NULL,
    "tipoSanguineo" TEXT NOT NULL,
    "dataValidade" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Estoque_Sangue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doador_email_key" ON "public"."Doador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Doador_cpf_key" ON "public"."Doador"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Doacao_agendamentoId_key" ON "public"."Doacao"("agendamentoId");

-- CreateIndex
CREATE UNIQUE INDEX "Estoque_Sangue_doacaoId_key" ON "public"."Estoque_Sangue"("doacaoId");

-- AddForeignKey
ALTER TABLE "public"."Agendamento" ADD CONSTRAINT "Agendamento_doadorId_fkey" FOREIGN KEY ("doadorId") REFERENCES "public"."Doador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Agendamento" ADD CONSTRAINT "Agendamento_hemocentroId_fkey" FOREIGN KEY ("hemocentroId") REFERENCES "public"."Hemocentro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Formulario_Elegibilidade" ADD CONSTRAINT "Formulario_Elegibilidade_doadorId_fkey" FOREIGN KEY ("doadorId") REFERENCES "public"."Doador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Historico_Clinico" ADD CONSTRAINT "Historico_Clinico_doadorId_fkey" FOREIGN KEY ("doadorId") REFERENCES "public"."Doador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Doacao" ADD CONSTRAINT "Doacao_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "public"."Agendamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Estoque_Sangue" ADD CONSTRAINT "Estoque_Sangue_doacaoId_fkey" FOREIGN KEY ("doacaoId") REFERENCES "public"."Doacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
