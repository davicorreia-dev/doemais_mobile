// Valida Email, sendo o formato padrão: texto@texto.texto
export const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Valida Nome, sendo pelo menos 2 nomes, sem números
export const isValidName = (name: string): boolean => {
    // Por enquanto aceita letras, acentos e espaços. Exige pelo menos um espaço (nome + sobrenome)
    const regex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
    return regex.test(name) && name.trim().split(' ').length >= 2;
};

// Valida Telefone, atualemte aceita formato com ou sem máscara, 10 ou 11 dígitos
export const isValidPhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

// Valida CPF: 11 dígitos + dígitos verificadores.
// Espelha o @IsCPF do backend (backend/src/utils/validators.ts) para que um CPF
// recusado pelo servidor já seja recusado aqui, no campo, e não no fim do cadastro.
export const isValidCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');

    if (cleanCPF.length !== 11) return false;
    // Elimina CPFs conhecidos inválidos (111.111.111-11, etc.)
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

    // Primeiro dígito verificador
    let sum = 0;
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cleanCPF.substring(i - 1, i), 10) * (11 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(9, 10), 10)) return false;

    // Segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cleanCPF.substring(i - 1, i), 10) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(10, 11), 10)) return false;

    return true;
};

// Valida Idade com a regra de doação: 16 a 69 anos
export const isValidAge = (date: Date): boolean => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
        age--;
    }

    return age >= 16 && age <= 69;
};

// Valida Peso de acordo com a regra de doação: Entre 50kg e 150kg
export const isValidWeight = (weight: string | number): boolean => {
    const numWeight = Number(weight);
    return !isNaN(numWeight) && numWeight >= 50 && numWeight <= 150;
};