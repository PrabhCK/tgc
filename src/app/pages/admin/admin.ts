import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(public http: HttpClient) { }

  //users api
  getAllUsers(data: any) {
    return this.http.post(environment.baseurl + '/userslist', data);
  }
  createUsers(data: any) {
    return this.http.post(environment.baseurl + '/users', data);
  }
  updateUsers(data: any) {
    return this.http.put(environment.baseurl + '/users', data);
  }
  deleteUser(id: any) {
    return this.http.delete(environment.baseurl + '/users/' + id);
  }

  //packages

  getAllPackages() {
    return this.http.get(environment.baseurl + '/packages').pipe(catchError(this.handleError));
  }
  createPackge(data: any) {
    return this.http.post(environment.baseurl + '/packages', data).pipe(catchError(this.handleError));
  }
  updatePackge(data: any) {
    return this.http.put(environment.baseurl + '/packages/'+data.id, data).pipe(catchError(this.handleError));
  }
  deletePackage(id: any) {
    return this.http.delete(environment.baseurl + '/packages/' + id).pipe(catchError(this.handleError));
  }

  getDashboardData() {
    return this.http.get(environment.baseurl + '/dashboard');
  }


  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      errorMessage;
    });
  }
}
