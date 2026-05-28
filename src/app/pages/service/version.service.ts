// version.service.ts
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class VersionService {

  checkVersion(): Promise<void> {
    // Only check version in production
    if (!environment.production) {
      return Promise.resolve();
    }

    const CURRENT_VERSION = environment.version;

    return fetch('/assets/version.json?ts=' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (data.version !== CURRENT_VERSION) {
          console.log('🔄 New version detected → reloading');
          window.location.reload();
        }
      })
      .catch(() => Promise.resolve());
  }
}