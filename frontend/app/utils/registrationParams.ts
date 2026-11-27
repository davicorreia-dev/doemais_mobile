export type RegistrationData = Record<string, string | undefined>;

export function encodeRegistrationData(data: RegistrationData) {
    return JSON.stringify(data);
}

export function decodeRegistrationData<T extends RegistrationData>(value: unknown): T | undefined {
    if (!value) return undefined;
    if (typeof value === 'object') return value as T;
    if (typeof value !== 'string') return undefined;

    try {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === 'object' ? parsed as T : undefined;
    } catch {
        return undefined;
    }
}
