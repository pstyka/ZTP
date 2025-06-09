export function decodeJwt(token: string): any {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (e) {
    console.warn('Nie udało się zdekodować tokena:', e);
    return null;
  }
}
