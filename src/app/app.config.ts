import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'

import { providePrimeNG } from 'primeng/config'
import { MessageService } from 'primeng/api'

import { routes } from './app.routes'
import { AlocaProfs } from './themes/alocaprofs.theme'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({
      eventCoalescing: true,
    }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: AlocaProfs,
        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
    MessageService,
  ],
}
