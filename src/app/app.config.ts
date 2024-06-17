import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { DatePipe } from '@angular/common';
import { corsInterceptor } from './interceptors/cors.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(HttpClientModule), provideHttpClient(withInterceptors([authInterceptor])), provideHttpClient(withInterceptors([corsInterceptor])), DatePipe,]
};
