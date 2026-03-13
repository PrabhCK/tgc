import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthHTTPService } from './auth-http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken: any = 'user';

  // public fields
  currentUser$: Observable<any>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<any>;
  isLoadingSubject: BehaviorSubject<boolean>;


  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }


  set currentUserValue(user: any) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router,
    private http: HttpClient
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    if (this.getAuthFromLocalStorage()) {
      const auth = this.getAuthFromLocalStorage();
      this.currentUserSubject = new BehaviorSubject<any>(auth);
    } else {
      this.currentUserSubject = new BehaviorSubject<any>(undefined);
    }
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  // public methods
  login(username: string, password: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(username, password).pipe(
      map((auth: any) => {
        const result = this.setAuthFromLocalStorage(auth);
        return result;
      }),
      catchError((err) => {
        console.error('err', err);
        return of(err);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/home'], {
      queryParams: {},
    });
  }
  public validateBirthYear(data: any) {
    return this.http.post(environment.baseurl + '/validate_user', data)
  }
  public changePassword(data: any) {
    return this.http.put(environment.baseurl + '/users/' + data.id, data)
  }
  // getUserByToken(): Observable<any> {
  //   const auth = this.getAuthFromLocalStorage();
  //   if (!auth && !auth.accessToken) {
  //     return of(undefined);
  //   }
  //   this.isLoadingSubject.next(true);
  //   return this.authHttpService.getUserByToken(auth.accessToken).pipe(
  //     map((user: any) => {
  //       if (user) {
  //         this.currentUserSubject = new BehaviorSubject<any>(user.data);
  //       } else {
  //         this.logout();
  //       }
  //       return user;
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }

  // need create new user then login
  registration(user: any): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.username, user.password)),
      catchError((err) => {
        console.error('err', err);
        return of(err);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<string> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: any): boolean {
    // store auth accessToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.accesstoken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return auth;
    }
    return false;
  }

  public getAuthFromLocalStorage(): any {
    try {
      const authData = JSON.parse( localStorage.getItem(this.authLocalStorageToken)|| 'null' );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public loggedIn() {
    return localStorage.getItem('user');
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
