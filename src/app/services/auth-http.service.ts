import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'

const API_USERS_URL = `${environment.baseurl}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
    }),
  };
  constructor(private http: HttpClient) { }

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${API_USERS_URL}/auth/login`, { username:email, password : password },this.httpOptions);
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: any): Observable<any> {
    return this.http.post(`${API_USERS_URL}/users`, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<any> {
    return this.http.post<string>(`${API_USERS_URL}/user/forgot_password`, {email:email});
  }

 // Your server should check email => If email exists change password to the user and return true | If email doesn't exist return false
  // resetPassword(params: any,token): Observable<boolean> {
  //   return this.http.put<boolean>(`${API_USERS_URL}/resetPassword`, params,{headers: {
  //     token: `${token}`}
  //   });
  // }

  getUserByToken(token:any): Observable<any> {
   
    return this.http.get<any>(`${API_USERS_URL}/userByToken`);
  }
}
  