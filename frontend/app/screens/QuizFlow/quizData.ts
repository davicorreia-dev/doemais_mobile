export type QuizOption = {
    label: string;
    value: string;
    isBlocker: boolean;
};

export type Question = {
    id: string;
    text: string;
    options?: QuizOption[];
    safeAnswer?: 'SIM' | 'NAO';
    rejectionTitle?: string;
    rejectionMessage?: string;
};

export type QuizModule = {
    id: string;
    title: string;
    icon: any;
    description: string;
    defaultRejectionTitle: string;
    defaultRejectionMessage: string;
    questions: Question[];
};

// BANCO DE DADOS DOS QUIZZES

export const QUIZ_MODULES: Record<string, QuizModule> = {
    IMPEDIMENTOS_DEFINITIVOS: {
        id: 'definitivos',
        title: 'Impedimentos Definitivos',
        icon: require('../../../assets/images/flow-start.png'), 
        description: 'Situações que impedem a doação permanentemente.',
        defaultRejectionTitle: 'Impedimento Definitivo',
        defaultRejectionMessage: 'Infelizmente, histórico de certas condições impede a doação permanentemente. Mas você pode ser nosso apoiador social!',
        questions: [
            { id: 'd1', text: 'Já foi diagnosticado com hepatite após os 11 anos?', safeAnswer: 'NAO' },
            { id: 'd2', text: 'Tem diagnóstico ou teste positivo para HIV, hepatites B ou C, Doença de Chagas ou HTLV?', safeAnswer: 'NAO' },
            { id: 'd3', text: 'Tem ou teve malária, câncer (incluindo leucemia) ou doença grave no pulmão, coração, rins ou fígado?', safeAnswer: 'NAO' },
            { id: 'd4', text: 'Já fez uso de drogas ilícitas injetáveis?', safeAnswer: 'NAO' },
            { id: 'd5', text: 'Recebeu enxerto de órgãos, medula ou dura-máter?', safeAnswer: 'NAO' },
        ]
    },

    GRAVIDEZ: {
        id: 'gravidez',
        title: 'Gravidez',
        icon: require('../../../assets/images/pregnant.png'), 
        description: 'Informações sobre gestação e parto.',
        defaultRejectionTitle: 'Em gestação',
        defaultRejectionMessage: 'Doação só pode ser feita após período estipulado por recomendação médica.',
        questions: [
            { id: 'p1', text: 'Está grávida, ou teve parto nos últimos 90 dias (normal) ou 180 dias (cesárea)?', safeAnswer: 'NAO' },
            { id: 'p2', text: 'Você está grávida ou suspeita de gravidez no momento?', safeAnswer: 'NAO' },
            
            // Pergunta personalizada
            { id: 'p3', text: 'Se realizou parto, ele foi:',
                options: [
                    { label: 'Normal', value: 'NORMAL', isBlocker: true },
                    { label: 'Cesárea', value: 'CESAREA', isBlocker: true },
                    { label: 'Não se aplica', value: 'NAO_APLICA', isBlocker: false }
                ]
            },
            { id: 'p4', text: 'Você está em fase de amamentação?', safeAnswer: 'NAO' },
            { id: 'p5', text: 'Você realizou um aborto espontâneo ou provocado nos últimos 3 meses?', safeAnswer: 'NAO' },
        ]
    },

    GRIPE: {
        id: 'gripe',
        title: 'Sintomas Gripais',
        icon: require('../../../assets/images/sick.png'), 
        description: 'Sintomas de gripe ou resfriado recentes.',
        defaultRejectionTitle: 'Sintomas Gripais',
        defaultRejectionMessage: 'Aguarde 7 dias após o desaparecimento dos sintomas para doar.',
        questions: [
            { id: 'g1', text: 'Você apresentou sintomas de gripe ou resfriado nos últimos 7 dias?', safeAnswer: 'NAO' },
            { id: 'g2', text: 'Está atualmente em tratamento ou tomando medicamentos para gripe?', safeAnswer: 'NAO' },
            { id: 'g3', text: 'Já se recuperou totalmente da gripe ou ainda está com sintomas?', safeAnswer: 'NAO' },
            { id: 'g4', text: 'Teve contato direto com alguém diagnosticado com gripe nos últimos dias?', safeAnswer: 'NAO' },
            { id: 'g5', text: 'Você recebeu a vacina contra a gripe recentemente?', safeAnswer: 'NAO' },
        ]
    },

    TATUAGEM: {
        id: 'tatuagem',
        title: 'Tatuagem',
        icon: require('../../../assets/images/tattoo.png'), 
        description: 'Procedimentos estéticos recentes.',
        defaultRejectionTitle: 'Tatuagem Recente',
        defaultRejectionMessage: 'É necessário aguardar 12 meses após realizar tatuagem ou maquiagem definitiva.',
        questions: [
            { id: 't1', text: 'Você fez tatuagem nos últimos 12 meses?', safeAnswer: 'NAO' },
            { id: 't2', text: 'Alguma tatuagem foi realizada em local sem regulamentação?', safeAnswer: 'NAO' },
            { id: 't3', text: 'Alguma tatuagem apresentou infecção ou complicação?', safeAnswer: 'NAO' },
        ]
    },

    VIAGEM: {
        id: 'viagem',
        title: 'Viagem',
        icon: require('../../../assets/images/suitcase.png'),
        description: 'Viagens recentes para áreas endêmicas.',
        defaultRejectionTitle: 'Viagem Recente',
        defaultRejectionMessage: 'Dependendo do local da viagem, é necessário aguardar um período de quarentena.',
        questions: [
            { id: 'v1', text: 'Você viajou para fora do Brasil nos últimos 12 meses?', safeAnswer: 'NAO' },
            { id: 'v2', text: 'Permaneceu em áreas rurais ou de risco?', safeAnswer: 'NAO' },
        ]
    }
};