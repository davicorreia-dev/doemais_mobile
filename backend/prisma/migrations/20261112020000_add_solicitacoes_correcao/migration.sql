CREATE TABLE "public"."Solicitacao_Correcao" (
  "id" SERIAL NOT NULL,
  "doadorId" INTEGER NOT NULL,
  "modulo" TEXT NOT NULL,
  "motivo" TEXT NOT NULL,
  "comentario" VARCHAR(500),
  "respostasOriginais" JSONB NOT NULL,
  "respostasCorrigidas" JSONB,
  "perguntasAlteradas" JSONB,
  "status" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
  "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvidoEm" TIMESTAMP(3),
  "responsavel" TEXT,
  "observacaoResolucao" VARCHAR(500),
  CONSTRAINT "Solicitacao_Correcao_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Solicitacao_Correcao_doadorId_modulo_status_idx" ON "public"."Solicitacao_Correcao"("doadorId", "modulo", "status");
CREATE INDEX "Solicitacao_Correcao_status_criadoEm_idx" ON "public"."Solicitacao_Correcao"("status", "criadoEm");
ALTER TABLE "public"."Solicitacao_Correcao" ADD CONSTRAINT "Solicitacao_Correcao_doadorId_fkey" FOREIGN KEY ("doadorId") REFERENCES "public"."Doador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
