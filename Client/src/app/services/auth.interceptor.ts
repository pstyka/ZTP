import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  if (typeof localStorage === 'undefined') {
    return next(req);
  }

  const raw = localStorage.getItem('auth_token');

  if (!raw) {
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
    return next(req);
  }

  if (!accessToken) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} ${accessToken}`
    }
  });

  return next(authReq);
};
