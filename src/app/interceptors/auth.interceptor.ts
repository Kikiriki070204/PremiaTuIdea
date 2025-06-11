import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../servicios/auth.service';
import { environment } from '../../enviroment/enviroment';
import { HttpInterceptorFn } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {  /*
  const authToken : string = inject(AuthService).getToken();

  const authReq = req.clone({
    headers: req.headers.set('Authorization', 'Bearer ' + authToken)
  });
  const authReq1 = authReq.clone({
    headers: authReq.headers.set('Accept', 'application/json')
  });

  return next(authReq1);
  */


  const token = localStorage.getItem('access_token');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};

