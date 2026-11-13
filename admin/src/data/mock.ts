// Dados fictícios para o protótipo navegável. Nada aqui vem da API.

export type Tone = 'green' | 'amber' | 'red' | 'blue' | 'gray';
export type Plan = 'mvp' | 'fase2';

export const BLOOD = ['A+', 'O+', 'B+', 'AB+', 'A-', 'O-', 'B-', 'AB-'] as const;

export type DonorStatus = 'Apto' | 'Inapto temporário' | 'Em triagem' | 'Bloqueada';

export interface Donor {
    id: number;
    name: string;
    cpf: string;
    email: string;
    phone: string;
    blood: string;
    city: string;
    age: number;
    gender: 'Masculino' | 'Feminino';
    weight: number;
    lastDonation: string | null;
    donations: number;
    status: DonorStatus;
    until?: string;
}

export const DONORS: Donor[] = [
    { id: 1, name: 'Paulo Henrique', cpf: '123.456.789-00', email: 'paulo.h@email.com', phone: '(81) 98888-0000', blood: 'A+', city: 'Recife', age: 26, gender: 'Masculino', weight: 72, lastDonation: '08 ago 2026', donations: 4, status: 'Apto' },
    { id: 2, name: 'Marina Souza', cpf: '221.034.557-10', email: 'marina.s@email.com', phone: '(81) 97777-1200', blood: 'O-', city: 'Olinda', age: 31, gender: 'Feminino', weight: 61, lastDonation: '02 nov 2026', donations: 7, status: 'Inapto temporário', until: '31 jan 2027' },
    { id: 3, name: 'Carlos Eduardo', cpf: '887.150.332-45', email: 'carlos.e@email.com', phone: '(81) 99912-3300', blood: 'B+', city: 'Jaboatão', age: 29, gender: 'Masculino', weight: 80, lastDonation: null, donations: 0, status: 'Em triagem' },
    { id: 4, name: 'Ana Beatriz', cpf: '540.312.908-77', email: 'ana.b@email.com', phone: '(81) 98123-4567', blood: 'AB+', city: 'Recife', age: 24, gender: 'Feminino', weight: 58, lastDonation: '21 set 2026', donations: 2, status: 'Apto' },
    { id: 5, name: 'João Pedro', cpf: '019.775.610-32', email: 'joao.p@email.com', phone: '(81) 99700-8899', blood: 'A-', city: 'Paulista', age: 35, gender: 'Masculino', weight: 84, lastDonation: '10 out 2026', donations: 3, status: 'Apto' },
    { id: 6, name: 'Larissa Gomes', cpf: '662.408.115-09', email: 'larissa.g@email.com', phone: '(81) 98555-4321', blood: 'O+', city: 'Recife', age: 27, gender: 'Feminino', weight: 55, lastDonation: null, donations: 0, status: 'Bloqueada' },
    { id: 7, name: 'Rafael Lima', cpf: '309.861.274-50', email: 'rafael.l@email.com', phone: '(81) 99650-1010', blood: 'B-', city: 'Camaragibe', age: 40, gender: 'Masculino', weight: 90, lastDonation: '15 ago 2026', donations: 5, status: 'Apto' },
    { id: 8, name: 'Camila Rocha', cpf: '774.290.663-18', email: 'camila.r@email.com', phone: '(81) 98800-7766', blood: 'A+', city: 'Recife', age: 22, gender: 'Feminino', weight: 54, lastDonation: '30 out 2026', donations: 1, status: 'Inapto temporário', until: '28 jan 2027' },
    { id: 9, name: 'Thiago Alves', cpf: '415.629.880-21', email: 'thiago.a@email.com', phone: '(81) 99211-4455', blood: 'B+', city: 'Olinda', age: 33, gender: 'Masculino', weight: 77, lastDonation: '04 jul 2026', donations: 6, status: 'Apto' },
    { id: 10, name: 'Beatriz Nunes', cpf: '298.117.446-63', email: 'bea.n@email.com', phone: '(81) 98977-2020', blood: 'O-', city: 'Recife', age: 28, gender: 'Feminino', weight: 63, lastDonation: '12 jun 2026', donations: 8, status: 'Apto' },
    { id: 11, name: 'Fernanda Costa', cpf: '832.005.119-74', email: 'fer.costa@email.com', phone: '(81) 99300-6677', blood: 'A+', city: 'Jaboatão', age: 37, gender: 'Feminino', weight: 66, lastDonation: '19 set 2026', donations: 9, status: 'Apto' },
    { id: 12, name: 'Lucas Martins', cpf: '176.340.285-92', email: 'lucas.m@email.com', phone: '(81) 98400-9988', blood: 'AB-', city: 'Recife', age: 30, gender: 'Masculino', weight: 74, lastDonation: null, donations: 0, status: 'Em triagem' },
    { id: 13, name: 'Juliana Ferraz', cpf: '563.904.221-37', email: 'ju.ferraz@email.com', phone: '(81) 99888-1212', blood: 'O+', city: 'Olinda', age: 25, gender: 'Feminino', weight: 59, lastDonation: '25 ago 2026', donations: 2, status: 'Apto' },
    { id: 14, name: 'Diego Barros', cpf: '047.552.318-86', email: 'diego.b@email.com', phone: '(81) 99105-3030', blood: 'B+', city: 'Recife', age: 45, gender: 'Masculino', weight: 92, lastDonation: '03 set 2026', donations: 12, status: 'Apto' },
    { id: 15, name: 'Patrícia Lemos', cpf: '690.173.402-55', email: 'pat.lemos@email.com', phone: '(81) 98222-7788', blood: 'A-', city: 'Paulista', age: 34, gender: 'Feminino', weight: 62, lastDonation: '14 out 2026', donations: 4, status: 'Inapto temporário', until: '12 jan 2027' },
    { id: 16, name: 'Henrique Dias', cpf: '321.678.945-01', email: 'henrique.d@email.com', phone: '(81) 99444-5656', blood: 'O+', city: 'Camaragibe', age: 52, gender: 'Masculino', weight: 88, lastDonation: '29 jul 2026', donations: 15, status: 'Apto' },
    { id: 17, name: 'Isabela Tavares', cpf: '754.210.093-44', email: 'isa.t@email.com', phone: '(81) 98666-1313', blood: 'AB+', city: 'Recife', age: 21, gender: 'Feminino', weight: 52, lastDonation: null, donations: 0, status: 'Em triagem' },
    { id: 18, name: 'Gustavo Pires', cpf: '208.439.771-28', email: 'gu.pires@email.com', phone: '(81) 99020-4040', blood: 'B-', city: 'Jaboatão', age: 38, gender: 'Masculino', weight: 79, lastDonation: '22 ago 2026', donations: 6, status: 'Apto' },
];

export const donorById = (id: number) => DONORS.find((d) => d.id === id)!;
export const initials = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

// ---------- triagem ----------
export type TriageStatus = 'Aprovado' | 'Bloqueado' | 'Em revisão' | 'Pendente';

export const MODULES: { id: string; title: string; questions: string[] }[] = [
    { id: 'imp', title: 'Impedimentos definitivos', questions: ['Já foi diagnosticado com hepatite após os 11 anos?', 'Tem diagnóstico ou teste positivo para HIV, hepatites B ou C, Doença de Chagas ou HTLV?', 'Tem ou teve malária, câncer ou doença grave no pulmão, coração, rins ou fígado?', 'Já fez uso de drogas ilícitas injetáveis?', 'Recebeu enxerto de órgãos, medula ou dura-máter?'] },
    { id: 'gra', title: 'Gravidez', questions: ['Está grávida ou teve parto nos últimos 90 dias (normal) ou 180 dias (cesárea)?', 'Você está grávida ou suspeita de gravidez?', 'Você está em fase de amamentação?', 'Realizou aborto espontâneo ou provocado nos últimos 3 meses?'] },
    { id: 'gri', title: 'Sintomas gripais', questions: ['Apresentou sintomas de gripe ou resfriado nos últimos 7 dias?', 'Está em tratamento ou tomando medicamentos para gripe?', 'Ainda está com sintomas?', 'Teve contato direto com alguém com gripe nos últimos dias?', 'Recebeu a vacina contra a gripe recentemente?'] },
    { id: 'ris', title: 'Situações de risco', questions: ['Teve relação sexual sem preservativo nos últimos 12 meses?', 'Teve múltiplos parceiros(as) nos últimos 12 meses?', 'Teve relação com alguém com HIV, sífilis, hepatite ou outra IST?', 'Teve relação com alguém que usa drogas injetáveis?', 'Teve relação com parceiro(a) ocasional ou desconhecido(a)?'] },
    { id: 'tat', title: 'Tatuagem', questions: ['Fez tatuagem nos últimos 12 meses?', 'Alguma tatuagem foi feita em local sem regulamentação?', 'Alguma tatuagem apresentou infecção ou complicação?', 'Utilizaram materiais descartáveis e esterilizados?', 'Já fez tatuagem em casa ou com alguém não profissional?'] },
    { id: 'pie', title: 'Piercing', questions: ['Fez piercing nos últimos 6 meses?', 'Algum piercing foi feito em lábio, língua ou boca?', 'Algum piercing apresentou infecção ou complicação?', 'Já colocou piercing em casa ou com alguém não profissional?', 'Tem piercing recém-colocado que ainda não cicatrizou?'] },
    { id: 'mal', title: 'Estados com malária', questions: ['Esteve em AC, AM, AP, PA, RO, RR ou TO nos últimos 12 meses?', 'Permaneceu em área de risco para malária nesses estados?', 'Teve febre ou calafrios após retornar dessas regiões?', 'Já teve diagnóstico de malária?', 'Algum médico já suspeitou de malária?'] },
    { id: 'via', title: 'Viagem', questions: ['Viajou para fora do Brasil nos últimos 12 meses?', 'Permaneceu em áreas rurais, florestais ou de risco?', 'Permaneceu em áreas endêmicas de doenças tropicais?', 'Retornou de viagem internacional nos últimos 6 meses?', 'Teve febre, diarreia ou sintomas infecciosos após viagem?'] },
    { id: 'int', title: 'Intervalo desde a última doação', questions: ['Doou sangue nos últimos 60/90 dias?', 'Lembra qual foi o mês?', 'Este foi o mês exato da doação?'] },
];

export interface Triage {
    id: number;
    donorId: number;
    done: number;
    status: TriageStatus;
    updated: string;
    note?: string;
    blockedModule?: string;
    blockedQuestion?: number;
    answers: Record<string, ('Sim' | 'Não')[]>;
}

// Resposta "esperada" (sem bloqueio) por pergunta: quase tudo é "Não", exceto materiais esterilizados.
export const okAnswer = (moduleId: string, q: number): 'Sim' | 'Não' => (moduleId === 'tat' && q === 3 ? 'Sim' : 'Não');

const makeAnswers = (blocked?: { m: string; q: number }) => {
    const a: Record<string, ('Sim' | 'Não')[]> = {};
    MODULES.forEach((m) => {
        a[m.id] = m.questions.map((_, i) => {
            const ok = okAnswer(m.id, i);
            if (blocked && blocked.m === m.id && blocked.q === i) return ok === 'Sim' ? 'Não' : 'Sim';
            return ok;
        });
    });
    return a;
};

const T = (id: number, donorId: number, done: number, status: TriageStatus, updated: string, b?: { m: string; q: number }, note?: string): Triage => ({
    id, donorId, done, status, updated, note, blockedModule: b?.m, blockedQuestion: b?.q, answers: makeAnswers(b),
});

export const TRIAGES: Triage[] = [
    T(1, 1, 9, 'Aprovado', '12 nov, 09:40'),
    T(2, 2, 9, 'Aprovado', '12 nov, 09:12'),
    T(3, 3, 5, 'Bloqueado', '12 nov, 08:55', { m: 'tat', q: 0 }, 'Tatuagem recente (menos de 12 meses).'),
    T(4, 4, 9, 'Em revisão', '11 nov, 18:20', { m: 'via', q: 0 }, 'Correção solicitada pelo doador.'),
    T(5, 5, 3, 'Pendente', '11 nov, 16:03'),
    T(6, 6, 6, 'Bloqueado', '11 nov, 14:47', { m: 'via', q: 0 }, 'Viagem internacional recente.'),
    T(7, 7, 9, 'Aprovado', '11 nov, 11:30'),
    T(8, 8, 9, 'Aprovado', '10 nov, 17:08'),
    T(9, 9, 9, 'Aprovado', '10 nov, 15:21'),
    T(10, 10, 9, 'Aprovado', '10 nov, 10:02'),
    T(11, 11, 4, 'Pendente', '09 nov, 19:44'),
    T(12, 12, 2, 'Pendente', '09 nov, 12:10'),
    T(13, 13, 9, 'Aprovado', '09 nov, 08:35'),
    T(14, 14, 5, 'Bloqueado', '08 nov, 20:15', { m: 'gri', q: 0 }, 'Sintomas gripais nos últimos 7 dias.'),
    T(15, 15, 9, 'Em revisão', '08 nov, 16:48', { m: 'pie', q: 0 }, 'Correção solicitada pelo doador.'),
    T(16, 16, 9, 'Aprovado', '08 nov, 11:20'),
    T(17, 17, 7, 'Pendente', '07 nov, 18:02'),
    T(18, 18, 9, 'Aprovado', '07 nov, 09:50'),
    T(19, 3, 9, 'Aprovado', '03 nov, 14:00'),
    T(20, 9, 9, 'Aprovado', '28 out, 10:30'),
];

// ---------- correções ----------
export type CorrectionStatus = 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface Correction {
    id: number;
    donorId: number;
    module: string;
    reason: string;
    hoursAgo: number;
    status: CorrectionStatus;
    diff: { q: string; original: 'Sim' | 'Não'; corrected: 'Sim' | 'Não' }[];
    resultBefore: string;
    resultAfter: string;
    responsible?: string;
    note?: string;
    resolvedAt?: string;
}

export const CORRECTIONS: Correction[] = [
    { id: 1042, donorId: 1, module: 'Tatuagem', reason: 'Marquei “sim” para tatuagem nos últimos 12 meses por engano. A última foi em 2024.', hoursAgo: 52, status: 'PENDING_REVIEW', resultBefore: 'Bloqueado', resultAfter: 'Apto', diff: [{ q: 'Você fez tatuagem nos últimos 12 meses?', original: 'Sim', corrected: 'Não' }, { q: 'Alguma tatuagem foi realizada em local sem regulamentação?', original: 'Não', corrected: 'Não' }, { q: 'Alguma tatuagem apresentou infecção ou complicação?', original: 'Não', corrected: 'Não' }] },
    { id: 1041, donorId: 4, module: 'Viagem', reason: 'A viagem foi há mais de 12 meses, em agosto de 2025.', hoursAgo: 30, status: 'PENDING_REVIEW', resultBefore: 'Bloqueado', resultAfter: 'Apto', diff: [{ q: 'Você viajou para fora do Brasil nos últimos 12 meses?', original: 'Sim', corrected: 'Não' }, { q: 'Permaneceu em áreas rurais, florestais ou de risco?', original: 'Não', corrected: 'Não' }] },
    { id: 1040, donorId: 14, module: 'Sintomas gripais', reason: 'Já estou sem sintomas há mais de 10 dias.', hoursAgo: 18, status: 'PENDING_REVIEW', resultBefore: 'Bloqueado', resultAfter: 'Apto', diff: [{ q: 'Apresentou sintomas de gripe ou resfriado nos últimos 7 dias?', original: 'Sim', corrected: 'Não' }, { q: 'Ainda está com sintomas?', original: 'Sim', corrected: 'Não' }] },
    { id: 1039, donorId: 15, module: 'Piercing', reason: 'O piercing cicatrizou há 8 meses.', hoursAgo: 9, status: 'PENDING_REVIEW', resultBefore: 'Bloqueado', resultAfter: 'Apto', diff: [{ q: 'Fez piercing nos últimos 6 meses?', original: 'Sim', corrected: 'Não' }, { q: 'Tem piercing recém-colocado que ainda não cicatrizou?', original: 'Sim', corrected: 'Não' }] },
    { id: 1038, donorId: 7, module: 'Situações de risco', reason: 'Cliquei na opção errada.', hoursAgo: 3, status: 'PENDING_REVIEW', resultBefore: 'Bloqueado', resultAfter: 'Apto', diff: [{ q: 'Teve relação sexual sem preservativo nos últimos 12 meses?', original: 'Sim', corrected: 'Não' }] },
    { id: 1037, donorId: 9, module: 'Tatuagem', reason: 'Informei a data errada da tatuagem.', hoursAgo: 80, status: 'APPROVED', resultBefore: 'Bloqueado', resultAfter: 'Apto', responsible: 'Dra. Marina Lopes', note: 'Comprovante conferido no balcão.', resolvedAt: '10 nov, 11:02', diff: [{ q: 'Você fez tatuagem nos últimos 12 meses?', original: 'Sim', corrected: 'Não' }] },
    { id: 1036, donorId: 13, module: 'Viagem', reason: 'Quero refazer a resposta.', hoursAgo: 110, status: 'REJECTED', resultBefore: 'Bloqueado', resultAfter: 'Apto', responsible: 'Patrícia Alves', note: 'Sem comprovação da data da viagem.', resolvedAt: '09 nov, 15:40', diff: [{ q: 'Viajou para fora do Brasil nos últimos 12 meses?', original: 'Sim', corrected: 'Não' }] },
];

// ---------- agenda ----------
export type ApptStatus = 'Agendado' | 'Confirmado' | 'Compareceu' | 'Faltou' | 'Cancelado';
export interface Appt { id: number; donorId: number; day: number; hour: string; status: ApptStatus; first: boolean }
export const WEEK_DAYS = [
    { label: 'Seg', date: 9 }, { label: 'Ter', date: 10 }, { label: 'Qua', date: 11 }, { label: 'Qui', date: 12 }, { label: 'Sex', date: 13 }, { label: 'Sáb', date: 14 },
];
export const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
const A = (id: number, donorId: number, day: number, hour: string, status: ApptStatus, first = false): Appt => ({ id, donorId, day, hour, status, first });
export const APPOINTMENTS: Appt[] = [
    A(1, 2, 0, '08:00', 'Compareceu'), A(2, 9, 0, '09:00', 'Compareceu'), A(3, 4, 1, '08:00', 'Compareceu', true), A(4, 7, 1, '10:00', 'Compareceu'), A(5, 8, 2, '09:00', 'Compareceu', true),
    A(6, 2, 3, '08:00', 'Confirmado'), A(7, 9, 3, '09:00', 'Compareceu'), A(8, 4, 3, '10:00', 'Confirmado', true), A(9, 5, 3, '11:00', 'Agendado'), A(10, 6, 3, '12:00', 'Faltou'), A(11, 10, 3, '13:00', 'Confirmado'),
    A(12, 11, 4, '09:00', 'Confirmado'), A(13, 12, 4, '11:00', 'Agendado', true), A(14, 13, 5, '08:00', 'Confirmado'),
];

// ---------- estoque ----------
export type BagStatus = 'Disponível' | 'Reservada' | 'Vencendo' | 'Descartada';
export interface Bag { lot: string; blood: string; collected: string; expires: string; origin: string; status: BagStatus }
export const STOCK_BASE: Record<string, number> = { 'A+': 148, 'O+': 162, 'B+': 71, 'AB+': 34, 'A-': 52, 'O-': 12, 'B-': 28, 'AB-': 9 };
export const BAGS: Bag[] = [
    { lot: 'L-1112-0087', blood: 'A+', collected: '12 nov', expires: '24 dez', origin: 'Hemocentro Recife', status: 'Disponível' },
    { lot: 'L-1110-0052', blood: 'O-', collected: '10 nov', expires: '22 dez', origin: 'Posto Olinda', status: 'Reservada' },
    { lot: 'L-1018-0031', blood: 'B+', collected: '18 out', expires: '18 nov', origin: 'Hemocentro Recife', status: 'Vencendo' },
    { lot: 'L-1005-0019', blood: 'A+', collected: '05 out', expires: '16 nov', origin: 'Posto Jaboatão', status: 'Vencendo' },
    { lot: 'L-1109-0071', blood: 'O+', collected: '09 nov', expires: '21 dez', origin: 'Hemocentro Recife', status: 'Disponível' },
    { lot: 'L-1108-0064', blood: 'AB-', collected: '08 nov', expires: '20 dez', origin: 'Hemocentro Recife', status: 'Disponível' },
    { lot: 'L-0928-0011', blood: 'B-', collected: '28 set', expires: '09 nov', origin: 'Posto Olinda', status: 'Descartada' },
];

// ---------- pedidos de sangue ----------
export type RequestStatus = 'Pendente' | 'Verificado' | 'Atendido' | 'Recusado';
export interface BloodRequest { id: number; blood: string; title: string; hospital: string; city: string; bags: number; requester: string; when: string; status: RequestStatus; desc: string; contact: string; doc: string; reason?: string }
export const REQUESTS: BloodRequest[] = [
    { id: 3087, blood: 'O-', title: 'Emergência O- Sangue Urgente', hospital: 'Hospital da Restauração', city: 'Recife', bags: 3, requester: 'Paulo H. (filho)', when: 'há 2h', status: 'Pendente', desc: 'Meu pai precisa de sangue para um procedimento médico urgente. Sua doação pode salvar a vida dele.', contact: '(81) 98888-0000', doc: 'Laudo anexado (PDF)' },
    { id: 3086, blood: 'A+', title: 'Emergência A+ Sangue Urgente', hospital: 'Hospital Esperança', city: 'Recife', bags: 2, requester: 'Marina S. (esposa)', when: 'há 5h', status: 'Verificado', desc: 'Cirurgia marcada para amanhã cedo. Precisamos repor duas bolsas.', contact: '(81) 97777-1200', doc: 'Pedido médico anexado' },
    { id: 3085, blood: 'B-', title: 'Cirurgia cardíaca B-', hospital: 'Real Hospital Português', city: 'Recife', bags: 4, requester: 'Carlos E.', when: 'há 1 dia', status: 'Verificado', desc: 'Paciente aguarda cirurgia cardíaca; tipo raro, ajuda é muito bem-vinda.', contact: '(81) 99912-3300', doc: 'Laudo anexado (PDF)' },
    { id: 3084, blood: 'AB+', title: 'Tratamento oncológico AB+', hospital: 'HCP', city: 'Recife', bags: 1, requester: 'Ana B. (irmã)', when: 'há 1 dia', status: 'Pendente', desc: 'Minha irmã faz quimioterapia e precisa de reposição semanal.', contact: '(81) 98123-4567', doc: 'Sem documento anexado' },
    { id: 3083, blood: 'O+', title: 'Reposição pós-parto O+', hospital: 'Maternidade Barros Lima', city: 'Recife', bags: 2, requester: 'Larissa G.', when: 'há 2 dias', status: 'Verificado', desc: 'Após o parto precisei de transfusão e a família quer repor o estoque.', contact: '(81) 98555-4321', doc: 'Pedido médico anexado' },
    { id: 3082, blood: 'A-', title: 'Acidente de trânsito A-', hospital: 'Hospital da Restauração', city: 'Recife', bags: 5, requester: 'João P.', when: 'há 3 dias', status: 'Atendido', desc: 'Vítima de acidente, estável após as doações. Obrigado a todos.', contact: '(81) 99700-8899', doc: 'Laudo anexado (PDF)' },
    { id: 3081, blood: 'B+', title: 'Pedido sem comprovação B+', hospital: 'Não informado', city: 'Olinda', bags: 6, requester: 'Conta nova', when: 'há 4 dias', status: 'Recusado', desc: 'Preciso de sangue com urgência.', contact: '(81) 90000-0000', doc: 'Sem documento anexado', reason: 'Sem comprovação e hospital não informado.' },
];

// ---------- campanhas ----------
export interface Campaign { id: number; title: string; sent: string; reach: number; opened: number; booked: number; status: 'Concluída' | 'Programada' | 'Rascunho'; types: string[] }
export const CAMPAIGNS: Campaign[] = [
    { id: 3, title: 'Semana do O-', sent: '04 nov 2026', reach: 640, opened: 412, booked: 32, status: 'Concluída', types: ['O-', 'O+'] },
    { id: 2, title: 'Volta às aulas', sent: '19 ago 2026', reach: 980, opened: 287, booked: 18, status: 'Concluída', types: ['A+', 'B+'] },
    { id: 1, title: 'Dia Mundial do Doador', sent: '14 jun 2026', reach: 1800, opened: 901, booked: 54, status: 'Concluída', types: ['Todos'] },
];

// ---------- equipe ----------
export type Role = 'Gestor' | 'Agente' | 'Leitura';
export interface Member { id: number; name: string; email: string; title: string; role: Role; twofa: boolean; lastAccess: string; status: 'Ativo' | 'Convite pendente' | 'Inativo'; unit: string }
export const MEMBERS: Member[] = [
    { id: 1, name: 'Dra. Marina Lopes', email: 'marina.lopes@hemocentro.pe.gov.br', title: 'Médica hematologista', role: 'Gestor', twofa: true, lastAccess: 'hoje 08:02', status: 'Ativo', unit: 'Recife (sede)' },
    { id: 2, name: 'Rodrigo Cunha', email: 'rodrigo.cunha@hemocentro.pe.gov.br', title: 'Enfermeiro', role: 'Agente', twofa: true, lastAccess: 'hoje 07:48', status: 'Ativo', unit: 'Recife (sede)' },
    { id: 3, name: 'Patrícia Alves', email: 'patricia.alves@hemocentro.pe.gov.br', title: 'Técnica de enfermagem', role: 'Agente', twofa: true, lastAccess: 'ontem 17:31', status: 'Ativo', unit: 'Recife (sede)' },
    { id: 4, name: 'Dr. João Martins', email: 'joao.martins@hemocentro.pe.gov.br', title: 'Médico clínico', role: 'Agente', twofa: true, lastAccess: '11 nov 09:12', status: 'Ativo', unit: 'Olinda' },
    { id: 5, name: 'Tânia Silva', email: 'tania.silva@hemocentro.pe.gov.br', title: 'Recepção', role: 'Leitura', twofa: true, lastAccess: '10 nov 13:20', status: 'Ativo', unit: 'Recife (sede)' },
    { id: 6, name: 'Felipe Barros', email: 'felipe.barros@hemocentro.pe.gov.br', title: 'Enfermeiro (posto Olinda)', role: 'Agente', twofa: false, lastAccess: '—', status: 'Convite pendente', unit: 'Olinda' },
];

export const UNITS = [
    { id: 'rec', name: 'Hemocentro Recife (sede)', short: 'Recife (sede)', address: 'Av. Joaquim Nabuco, 171 · Graças', role: 'Gestor' as Role, hours: 'Plantão aberto até 19h', open: true },
    { id: 'oli', name: 'Posto de coleta Olinda', short: 'Olinda', address: 'Rua do Sol, 45 · Carmo', role: 'Agente' as Role, hours: 'Aberto até 17h', open: true },
    { id: 'jab', name: 'Posto de coleta Jaboatão', short: 'Jaboatão', address: 'Av. Barreto de Menezes, 900', role: 'Agente' as Role, hours: 'Fechado · abre às 7h', open: false },
];

export interface AuditEntry { id: number; at: string; agent: string; action: string; target: string; origin: string; kind: 'Decisões' | 'Dados pessoais' | 'Acessos' | 'Exportações' }
export const AUDIT_SEED: AuditEntry[] = [
    { id: 8, at: '12 nov 09:52', agent: 'Dra. Marina Lopes', action: 'Aprovou correção #1037', target: 'Thiago Alves · Tatuagem', origin: '200.12.xx.xx', kind: 'Decisões' },
    { id: 7, at: '12 nov 09:44', agent: 'Rodrigo Cunha', action: 'Registrou doação (450 mL)', target: 'Marina Souza · L-1112-0087', origin: '200.12.xx.xx', kind: 'Decisões' },
    { id: 6, at: '12 nov 09:31', agent: 'Rodrigo Cunha', action: 'Visualizou dados pessoais', target: 'Carlos Eduardo', origin: '200.12.xx.xx', kind: 'Dados pessoais' },
    { id: 5, at: '12 nov 08:57', agent: 'Patrícia Alves', action: 'Recusou correção #1036', target: 'Juliana Ferraz · Viagem', origin: '200.12.xx.xx', kind: 'Decisões' },
    { id: 4, at: '12 nov 08:02', agent: 'Dra. Marina Lopes', action: 'Login com 2FA', target: 'Painel do agente', origin: '187.34.xx.xx', kind: 'Acessos' },
    { id: 3, at: '11 nov 17:20', agent: 'Dra. Marina Lopes', action: 'Exportou relatório mensal', target: 'Relatórios · outubro', origin: '187.34.xx.xx', kind: 'Exportações' },
    { id: 2, at: '11 nov 16:05', agent: 'Dra. Marina Lopes', action: 'Alterou papel de usuário', target: 'Tânia Silva → Leitura', origin: '187.34.xx.xx', kind: 'Decisões' },
    { id: 1, at: '11 nov 14:40', agent: 'Dr. João Martins', action: 'Marcou doador como inapto (30d)', target: 'Larissa Gomes', origin: '200.12.xx.xx', kind: 'Decisões' },
];

export const NOTIFICATIONS = [
    { id: 1, tone: 'red' as Tone, text: 'Estoque crítico de O- e AB-', to: '/estoque' },
    { id: 2, tone: 'amber' as Tone, text: '2 correções acima de 48h', to: '/correcoes' },
    { id: 3, tone: 'blue' as Tone, text: 'Novo pedido de sangue aguardando verificação', to: '/pedidos' },
];

export const MONTHS = [['Nov', 412], ['Dez', 388], ['Jan', 430], ['Fev', 402], ['Mar', 451], ['Abr', 470], ['Mai', 498], ['Jun', 485], ['Jul', 520], ['Ago', 548], ['Set', 567], ['Out', 612]] as [string, number][];
export const BLOCK_REASONS: [string, number][] = [['Tatuagem recente', 31], ['Viagem / áreas de risco', 18], ['Sintomas gripais', 16], ['Situações de risco', 14], ['Gravidez / amamentação', 12], ['Piercing recente', 9]];
