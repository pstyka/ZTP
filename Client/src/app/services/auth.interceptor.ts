import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const raw = localStorage.getItem('auth_token');

  if (!raw) {
    // Brak tokena – idź dalej bez modyfikacji
    return next(req);
  }

  let accessToken: string | undefined;
  let tokenType = 'Bearer';

  try {
    const tokenObj = JSON.parse(raw);
    accessToken = tokenObj?.access_token;
    if (tokenObj?.token_type) {
      tokenType = tokenObj.token_type;
    }
  } catch (e) {
    console.warn('auth_token parsing error', e);
    return next(req); // Nie parsuje poprawnie? Przechodzimy dalej bez tokena
  }

  if (!accessToken) {
    return next(req); // Brak access_token – nie ustawiamy nagłówka
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} ${accessToken}`
    }
  });

  return next(authReq);
};
