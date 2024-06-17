import { HttpInterceptorFn } from '@angular/common/http';

export const corsInterceptor: HttpInterceptorFn = (req, next) => {
  const corsReq = req.clone({
    headers: req.headers.set('Access-Control-Allow-Origin', '*')
  });
  return next(req);
};
