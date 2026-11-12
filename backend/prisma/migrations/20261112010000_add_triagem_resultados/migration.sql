CREATE TABLE "public"."Triagem_Resultado" (
    "id" SERIAL NOT NULL,
    "doadorId" INTEGER NOT NULL,
    "modulo" TEXT NOT NULL,
    "respostas" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "dataPreenchimento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Triagem_Resultado_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Triagem_Resultado_doadorId_modulo_dataPreenchimento_idx"
ON "public"."Triagem_Resultado"("doadorId", "modulo", "dataPreenchimento");

ALTER TABLE "public"."Triagem_Resultado"
ADD CONSTRAINT "Triagem_Resultado_doadorId_fkey"
FOREIGN KEY ("doadorId") REFERENCES "public"."Doador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
