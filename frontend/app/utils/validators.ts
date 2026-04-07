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

// Valida CPF Regex de formato simples - Aqui ainda falta bastante coisa...
export const isValidCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    // Elimina CPFs conhecidos inválidos (111.111.111-11, etc.)
    if (/^(\d)\1+$/.test(cleanCPF)) return false;

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

// Valida Peso de acordo com a regra de doação: Mínimo 50kg
export const isValidWeight = (weight: string | number): boolean => {
    const numWeight = Number(weight);
    return !isNaN(numWeight) && numWeight >= 50;
};