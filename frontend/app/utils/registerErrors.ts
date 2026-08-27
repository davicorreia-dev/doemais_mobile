/**
 * O backend responde com uma única string de erro: as mensagens do
 * validationMiddleware vêm unidas por ", " e os conflitos de cadastro vêm
 * como uma frase só ("Este e-mail já está registrado.").
 *
 * Aqui essa string é quebrada de volta nos campos da RegisterScreen, para que
 * o erro apareça no campo certo em vez de num alerta genérico no fim do fluxo.
 */
export type RegisterField = 'name' | 'email' | 'cpf' | 'phone' | 'password';

export type RegisterFieldErrors = Partial<Record<RegisterField, string>>;

const FIELD_MATCHERS: { field: RegisterField; pattern: RegExp }[] = [
    { field: 'email', pattern: /e-?mail/i },
    { field: 'cpf', pattern: /cpf/i },
    { field: 'password', pattern: /senha/i },
    { field: 'phone', pattern: /telefone|celular/i },
    { field: 'name', pattern: /nome/i },
];

export function mapRegisterServerError(message: string): RegisterFieldErrors {
    const errors: RegisterFieldErrors = {};

    if (!message) return errors;

    // As mensagens do DTO começam com maiúscula ("O nome...", "Este e-mail..."), então
    // só quebramos numa vírgula seguida de maiúscula — vírgulas internas de uma
    // mesma mensagem (a regra de senha tem duas) são preservadas.
    for (const part of message.split(/,\s+(?=[A-ZÀ-Ú])/).map((item) => item.trim())) {
        if (!part) continue;

        const match = FIELD_MATCHERS.find(({ pattern }) => pattern.test(part));
        // Só o primeiro erro de cada campo é aproveitado
        if (match && !errors[match.field]) {
            errors[match.field] = part;
        }
    }

    return errors;
}
