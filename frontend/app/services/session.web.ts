let accessToken: string | null = null;
let user: string | null = null;

export const getAccessToken = async () => accessToken;
export const getRefreshToken = async () => null;
export const getUser = async () => user;
export const setAccessToken = async (token: string) => { accessToken = token; };
export const setUser = async (value: unknown) => { user = JSON.stringify(value); };
export async function setSession(token: string, value: unknown) { accessToken = token; user = JSON.stringify(value); }
export async function clearSession() { accessToken = null; user = null; }
