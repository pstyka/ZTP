import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { rootReducer } from './store';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './auth/store';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    provideStore(rootReducer),
    provideEffects([AuthEffects]),
  ]
};
