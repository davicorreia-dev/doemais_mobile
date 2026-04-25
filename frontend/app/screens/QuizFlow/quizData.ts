import type { ImageSourcePropType, KeyboardTypeOptions } from 'react-native';

export type FormGender = 'ALL' | 'M' | 'F';
export type AnswerType = 'boolean' | 'choice' | 'number';

export type QuizOption = {
    label: string;
    value: string;
};

export type BlockRule =
    | { kind: 'boolean'; blockWhen: boolean }
    | { kind: 'choice'; blockValues: string[] }
    | { kind: 'number'; min?: number; max?: number };

export type QuizQuestion = {
    id: string;
    questionText: string;
    answerType: AnswerType;
    presentation?: 'buttons' | 'select';
    options?: QuizOption[];
    blockRule?: BlockRule;
    blockMessage?: string;
    inputPlaceholder?: string;
    inputKeyboardType?: KeyboardTypeOptions;
};

export type QuizModule = {
    id: string;
    title: string;
    description: string;
    image: ImageSourcePropType;
    visibleFor: FormGender;
    blockTitle: string;
    blockMessage: string;
    successTitle: string;
    successMessage: string;
    questions: QuizQuestion[];
};

const yesNoOptions: QuizOption[] = [
    { label: 'Sim', value: 'SIM' },
    { label: 'Não', value: 'NAO' },
];

const monthOptions: QuizOption[] = [
    { label: 'Janeiro', value: 'JAN' },
    { label: 'Fevereiro', value: 'FEV' },
    { label: 'Março', value: 'MAR' },
    { label: 'Abril', value: 'ABR' },
    { label: 'Maio', value: 'MAI' },
    { label: 'Junho', value: 'JUN' },
    { label: 'Julho', value: 'JUL' },
    { label: 'Agosto', value: 'AGO' },
    { label: 'Setembro', value: 'SET' },
    { label: 'Outubro', value: 'OUT' },
    { label: 'Novembro', value: 'NOV' },
    { label: 'Dezembro', value: 'DEZ' },
];

const createYesNoQuestion = (
    id: string,
    questionText: string,
    blockWhen: boolean,
    blockMessage: string,
): QuizQuestion => ({
    id,
    questionText,
    answerType: 'boolean',
    options: yesNoOptions,
    blockRule: { kind: 'boolean', blockWhen },
    blockMessage,
});

const createChoiceQuestion = (
    id: string,
    questionText: string,
    options: QuizOption[],
    blockValues?: string[],
    blockMessage?: string,
    presentation?: QuizQuestion['presentation'],
): QuizQuestion => ({
    id,
    questionText,
    answerType: 'choice',
    presentation,
    options,
    blockRule: blockValues ? { kind: 'choice', blockValues } : undefined,
    blockMessage,
});

export const QUIZ_MODULES: Record<string, QuizModule> = {
    IMPEDIMENTOS_DEFINITIVOS: {
        id: 'IMPEDIMENTOS_DEFINITIVOS',
        title: 'Impedimentos Definitivos',
        description: 'Situações que impedem a doação permanentemente.',
        image: require('../../../assets/images/flow-start.png'),
        visibleFor: 'ALL',
        blockTitle: 'Impedimento Definitivo',
        blockMessage: 'Infelizmente, você não pode doar sangue. Mas pode ajudar como apoiador social.',
        successTitle: 'Triagem concluída',
        successMessage: 'Você passou por todo o questionário com sucesso.',
        questions: [
            createYesNoQuestion('d1', 'Já foi diagnosticado com hepatite após os 11 anos?', true, 'Esse histórico impede a doação no momento.'),
            createYesNoQuestion('d2', 'Tem diagnóstico ou teste positivo para HIV, hepatites B ou C, Doença de Chagas ou HTLV?', true, 'Esse resultado impede a doação no momento.'),
            createYesNoQuestion('d3', 'Tem ou teve malária, câncer (incluindo leucemia) ou doença grave no pulmão, coração, rins ou fígado?', true, 'Esse histórico impede a doação no momento.'),
            createYesNoQuestion('d4', 'Já fez uso de drogas ilícitas injetáveis?', true, 'Esse histórico impede a doação no momento.'),
            createYesNoQuestion('d5', 'Recebeu enxerto de órgãos, medula ou dura-máter?', true, 'Esse procedimento impede a doação no momento.'),
        ],
    },

    GRAVIDEZ: {
        id: 'GRAVIDEZ',
        title: 'Gravidez',
        description: '+90 dias após parto normal\n+180 dias após cesariana',
        image: require('../../../assets/images/pregnant.png'),
        visibleFor: 'F',
        blockTitle: 'Inaptidão temporária',
        blockMessage: 'Você não pode doar neste momento. Volte quando o período recomendado terminar.',
        successTitle: 'Triagem concluída',
        successMessage: 'Você passou por todo o questionário com sucesso.',
        questions: [
            createYesNoQuestion('g1', 'Está grávida, ou teve parto nos últimos 90 dias (normal) ou 180 dias (cesárea)?', true, 'É necessário aguardar o período recomendado após o parto.'),
            createYesNoQuestion('g2', 'Você está grávida ou suspeita de gravidez no momento?', true, 'A doação não pode seguir durante a gestação.'),
            createChoiceQuestion(
                'g3',
                'Se realizou parto, ele foi',
                [
                    { label: 'Normal', value: 'NORMAL' },
                    { label: 'Cesárea', value: 'CESAREA' },
                    { label: 'Não se aplica', value: 'NAO_APLICA' },
                ],
            ),
            createYesNoQuestion('g4', 'Você está em fase de amamentação?', true, 'É necessário aguardar o período recomendado para amamentação.'),
            createYesNoQuestion('g5', 'Você realizou um aborto espontâneo ou provocado nos últimos 3 meses?', true, 'É necessário aguardar o período recomendado para este caso.'),
        ],
    },

    AMAMENTACAO: {
        id: 'AMAMENTACAO',
        title: 'Amamentação',
        description: 'Se o parto ocorreu há menos de 12 meses',
        image: require('../../../assets/images/pregnant.png'),
        visibleFor: 'F',
        blockTitle: 'Inaptidão temporária',
        blockMessage: 'Aguarde até completar o período mínimo recomendado.',
        successTitle: 'Triagem concluída',
        successMessage: 'Você passou por todo o questionário com sucesso.',
        questions: [
            createYesNoQuestion('a1', 'Está amamentando e o parto foi há menos de 12 meses?', true, 'Aguarde até completar 12 meses após o parto.'),
            createYesNoQuestion('a2', 'O parto ocorreu há menos de 90 dias (parto normal) ou 180 dias (cesárea)?', true, 'É necessário aguardar o prazo mínimo recomendado.'),
            createYesNoQuestion('a3', 'Seu bebê tem menos de 12 meses de idade?', true, 'Por segurança, essa condição mantém a inaptidão temporária.'),
            createYesNoQuestion('a4', 'Você está amamentando (em até 12 meses após o parto)?', true, 'Aguarde até completar o período mínimo recomendado.'),
            createYesNoQuestion('a5', 'Você teve alguma infecção recente durante a amamentação?', true, 'A infecção recente interrompe a triagem.'),
        ],
    },

    GRIPE: {
        id: 'GRIPE',
        title: 'Sintomas Gripais',
        description: 'Aguardar 7 dias após o fim dos sintomas',
        image: require('../../../assets/images/sick.png'),
        visibleFor: 'ALL',
        blockTitle: 'Sintomas Gripais',
        blockMessage: 'Aguarde 7 dias após o desaparecimento dos sintomas para doar.',
        successTitle: 'Triagem concluída',
        successMessage: 'Você passou por todo o questionário com sucesso.',
        questions: [
            createYesNoQuestion('s1', 'Você apresentou sintomas de gripe ou resfriado nos últimos 7 dias?', true, 'Aguarde 7 dias após o desaparecimento dos sintomas.'),
            createYesNoQuestion('s2', 'Está atualmente em tratamento ou tomando medicamentos para gripe?', true, 'É necessário concluir o tratamento antes de prosseguir.'),
            createYesNoQuestion('s3', 'Você ainda está com sintomas?', true, 'A doação só pode seguir após a recuperação total.'),
            createYesNoQuestion('s4', 'Teve contato direto com alguém diagnosticado com gripe nos últimos dias?', true, 'É necessário aguardar conforme a avaliação de risco.'),
            createYesNoQuestion('s5', 'Você recebeu a vacina contra a gripe recentemente?', true, 'É necessário respeitar o período de segurança após a vacinação.'),
        ],
    },

    SITUACAO_DE_RISCO: {
        id: 'SITUACAO_DE_RISCO',
        title: 'Situações de risco',
        description: 'Nos últimos 12 meses',
        image: require('../../../assets/images/flow-start.png'),
        visibleFor: 'ALL',
        blockTitle: 'Inaptidão temporária',
        blockMessage: 'Você deve aguardar 12 meses para doar.',
        successTitle: 'Triagem concluída',
        successMessage: 'Você passou por todo o questionário com sucesso.',
        questions: [
            createYesNoQuestion('r1', 'Você teve relação sexual sem preservativo nos últimos 12 meses?', true, 'Essa situação interrompe a triagem.'),
            createYesNoQuestion('r2', 'Teve múltiplos(as) parceiros(as) sexuais nos últimos 12 meses?', true, 'Essa situação interrompe a triagem.'),
            createChoiceQuestion(
                'r3',
                'Teve relação sexual com alguém que você sabe ou desconfia ter HIV, sífilis, hepatite ou outra IST?',
                [
                    { label: 'Sim', value: 'SIM' },
                    { label: 'Não', value: 'NAO' },
                    { label: 'Não sei informar', value: 'NAO_SEI_INFORMAR' },
                ],
                ['SIM', 'NAO_SEI_INFORMAR'],
                'Dúvida ou confirmação de risco mantém a inaptidão temporária.',
            ),
            createYesNoQuestion('r4', 'Teve relação sexual com alguém que usa drogas injetáveis?', true, 'Essa situação interrompe a triagem.'),
            createYesNoQuestion('r5', 'Você teve relação sexual com um(a) parceiro(a) ocasional ou desconhecido(a) nos últimos 12 meses?', true, 'Essa situação interrompe a triagem.'),
        ],
    },

    TATUAGEM: {
        id: 'TATUAGEM',
        title: 'Tatuagem',
        description: 'Nos últimos 12 meses',
        image: require('../../../assets/images/tattoo.png'),
        visibleFor: 'ALL',
        blockTitle: 'Tatuagem Recente',
        blockMessage: 'É necessário aguardar 12 meses após realizar tatuagem ou maquiagem definitiva.',
        successTitle: 'Triagem concluída',
        successMessage: 'Você passou por todo o questionário com sucesso.',
        questions: [
            createYesNoQuestion('t1', 'Você fez tatuagem nos últimos 12 meses?', true, 'É necessário aguardar 12 meses após a tatuagem.'),
            createYesNoQuestion('t2', 'Alguma tatuagem foi realizada em local sem regulamentação?', true, 'O procedimento precisa atender às condições de segurança.'),
            createYesNoQuestion('t3', 'Alguma tatuagem apresentou infecção ou complicação após ser feita?', true, 'É necessário aguardar a resolução completa da complicação.'),
            createYesNoQuestion('t4', 'Utilizaram materiais descartáveis e esterilizados durante a realização da tatuagem?', false, 'O uso de materiais inadequados gera bloqueio.'),
            createYesNoQuestion('t5', 'Você já fez tatuagem em casa ou com alguém que não era profissional?', true, 'Esse cenário interrompe a triagem.'),
        ],
    },

    PIERCING: {
        id: 'PIERCING',
        title: 'Piercing',
        description: 'Nos últimos 6 meses\nBoca/Íntimas: nos últimos 12 meses',
        image: require('../../../assets/images/flow-start.png'),
        visibleFor: 'ALL',
        blockTitle: 'Inaptidão temporária',
        blockMessage: 'Você deve aguardar 12 meses para doar.',
        successTitle: 'Triagem concluída',
        successMessage: 'Você passou por todo o questionário com sucesso.',
        questions: [
            createYesNoQuestion('p1', 'Você fez piercing nos últimos 6 meses?', true, 'É necessário aguardar a janela de segurança para piercing.'),
            createYesNoQuestion('p2', 'Algum piercing foi realizado em lábio, língua ou boca?', true, 'Mucosas apresentam maior risco de contaminação.'),
            createYesNoQuestion('p3', 'Algum piercing apresentou infecção ou complicação após ser feito?', true, 'É necessário aguardar a resolução completa da complicação.'),
            createYesNoQuestion('p4', 'Já colocou piercing em casa ou com alguém que não era profissional?', true, 'Esse cenário interrompe a triagem.'),
            createYesNoQuestion('p5', 'Você está com algum piercing recém-colocado que ainda não cicatrizou completamente?', true, 'É necessário aguardar a cicatrização completa.'),
        ],
    },

    ESTADOS_COM_MALARIA: {
        id: 'ESTADOS_COM_MALARIA',
        title: 'Estados com malária',
        description: 'AC, AP, AM, RO, RR, MA, MT, PA e TO\nAguardar 12 meses',
        image: require('../../../assets/images/suitcase.png'),
        visibleFor: 'ALL',
        blockTitle: 'Inaptidão temporária',
        blockMessage: 'Você deve aguardar 12 meses para doar.',
        successTitle: 'Triagem concluída',
        successMessage: 'Você passou por todo o questionário com sucesso.',
        questions: [
            createYesNoQuestion('m1', 'Você esteve em Acre (AC), Amazonas (AM), Amapá (AP), Pará (PA), Rondônia (RO), Roraima (RR) ou Tocantins (TO) nos últimos 12 meses?', true, 'Exposição geográfica de risco interrompe a triagem.'),
            createYesNoQuestion('m2', 'Nos últimos 12 meses, você permaneceu em área considerada de risco para malária em algum desses estados?', true, 'Exposição geográfica de risco interrompe a triagem.'),
            createYesNoQuestion('m3', 'Apresentou febre, calafrios ou sintomas gripais fortes após retornar de viagem para essas regiões?', true, 'Sintomas pós-viagem interrompem a triagem.'),
            createYesNoQuestion('m4', 'Você já teve diagnóstico de malária alguma vez na vida?', true, 'Histórico de malária interrompe a triagem.'),
            createYesNoQuestion('m5', 'Algum médico já suspeitou que você pudesse ter malária, mesmo sem confirmação?', true, 'Suspeita clínica interrompe a triagem.'),
        ],
    },

    VIAGEM: {
        id: 'VIAGEM',
        title: 'Viagem',
        description: 'Algumas regiões podem exigir espera. Verifique os locais visitados.',
        image: require('../../../assets/images/suitcase.png'),
        visibleFor: 'ALL',
        blockTitle: 'Inaptidão temporária',
        blockMessage: 'Você deve aguardar 12 meses para doar.',
        successTitle: 'Triagem concluída',
        successMessage: 'Você passou por todo o questionário com sucesso.',
        questions: [
            createYesNoQuestion('v1', 'Você viajou para fora do Brasil nos últimos 12 meses?', true, 'Dependendo do destino, é necessário aguardar antes de doar.'),
            createYesNoQuestion('v2', 'Permaneceu em áreas rurais, florestais ou de risco durante suas viagens recentes?', true, 'Exposição a áreas de risco interrompe a triagem.'),
            createYesNoQuestion('v3', 'Você permaneceu em áreas endêmicas de doenças tropicais recentemente?', true, 'Exposição a áreas endêmicas interrompe a triagem.'),
            createYesNoQuestion('v4', 'Nos últimos 6 meses, você retornou de viagem internacional?', true, 'Viagem recente pode bloquear a triagem.'),
            createYesNoQuestion('v5', 'Após alguma viagem, apresentou febre, diarreia ou outros sintomas de doença infecciosa?', true, 'Sintomas pós-viagem interrompem a triagem.'),
        ],
    },

    TRIAGEM_HOMEM: {
        id: 'TRIAGEM_HOMEM',
        title: 'Triagem homem',
        description: 'Fluxo de intervalo mínimo para doadores do gênero masculino.',
        image: require('../../../assets/images/flow-start.png'),
        visibleFor: 'M',
        blockTitle: 'Modal de Reprovação',
        blockMessage: 'Você não respeitou o intervalo mínimo para doação.',
        successTitle: 'Modal de Sucesso',
        successMessage: 'Triagem aprovada. Redirecionando para a próxima etapa.',
        questions: [
            createYesNoQuestion('h1', 'Doou sangue nos últimos 60 dias?', true, 'Você não respeitou o intervalo mínimo de 60 dias.'),
            createYesNoQuestion('h2', 'Lembra qual foi o mês?', false, 'Selecione uma resposta para continuar.'),
            createChoiceQuestion('h3', 'Selecione o mês em que você realizou a doação.', monthOptions, undefined, undefined, 'select'),
            createChoiceQuestion('h4', '4. Este foi o mês exato da sua doação? ({{month}})', [
                { label: 'Sim', value: 'SIM' },
                { label: 'Não tenho certeza', value: 'NAO_TENHO_CERTEZA' },
            ], undefined, undefined, 'buttons'),
        ],
    },

    TRIAGEM_MULHER: {
        id: 'TRIAGEM_MULHER',
        title: 'Triagem mulher',
        description: 'Fluxo de intervalo mínimo para doadoras do gênero feminino.',
        image: require('../../../assets/images/flow-start.png'),
        visibleFor: 'F',
        blockTitle: 'Modal de Reprovação',
        blockMessage: 'Você não respeitou o intervalo mínimo para doação.',
        successTitle: 'Modal de Sucesso',
        successMessage: 'Triagem aprovada. Redirecionando para a próxima etapa.',
        questions: [
            createYesNoQuestion('w1', 'Doou sangue nos últimos 90 dias?', true, 'Você não respeitou o intervalo mínimo de 90 dias.'),
            createYesNoQuestion('w2', 'Lembra qual foi o mês?', false, 'Selecione uma resposta para continuar.'),
            createChoiceQuestion('w3', 'Selecione o mês em que você realizou a doação.', monthOptions, undefined, undefined, 'select'),
            createChoiceQuestion('w4', '4. Este foi o mês exato da sua doação? ({{month}})', [
                { label: 'Sim', value: 'SIM' },
                { label: 'Não tenho certeza', value: 'NAO_TENHO_CERTEZA' },
            ], undefined, undefined, 'buttons'),
        ],
    },
};
