import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorhandlerService {
  constructor(private router: Router) {}

  handleError(err:any) {
    if (err.status == 401) {
      localStorage.clear();
      this.router.navigate(['/']);
      var error = '';
      return (error = 'Session Expired. Login to Continue');
    } else {
      var error = '';
      return (error = err.error.message);
    }
  }
}
