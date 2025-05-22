import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const raw = localStorage.getItem('auth_token');

  if (raw) {
    try {
      const tokenObj = JSON.parse(raw);
      const accessToken = tokenObj.access_token;
      const tokenType = tokenObj.token_type || 'Bearer';

      if (accessToken) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} ${accessToken}`
          }
        });
        return next(authReq);
      }
    } catch (e) {
      console.warn('auth_token parsing error', e);
    }
  }

  return next(req);
};