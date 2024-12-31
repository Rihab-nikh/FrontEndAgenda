import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private helper: JwtHelperService = new JwtHelperService();
  private roles: string[] = [];
  private loggedUser: string | null = null;
  private isLoggedIn: boolean = false;
  private token: string | null = null;
  private apiUrl: string = 'http://localhost:8080/api/auth';

  constructor(private router: Router, private httpClient: HttpClient) {}

  login(user: UserModel): Observable<HttpResponse<{ token: string }>> {
    return this.httpClient.post<{ token: string }>(`${this.apiUrl}/login`, user, { observe: 'response' })
      .pipe(
        catchError(this.handleError)
      );
  }

  register(user: UserModel): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/register`, user, { observe: 'response' })
      .pipe(
        catchError(this.handleError)
      );
  }

  signIn(user: UserModel): Observable<HttpResponse<UserModel>> {
    return this.httpClient.post<UserModel>(`${this.apiUrl}/login`, user, { observe: 'response' });
  }

  signUp(user: UserModel): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/auth/register`, user, { observe: 'response' })
      .pipe(
        catchError(this.handleError)
      );
  }

  saveToken(jwt: string): void {
    localStorage.setItem('jwt', jwt);
    this.token = jwt;
    this.isLoggedIn = true;
    this.decodedJWT();
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  loadToken(): void {
    this.token = localStorage.getItem('jwt');
  }

  isTokenExpired(): boolean {
    if (!this.token) {
      return true;
    }
    return this.helper.isTokenExpired(this.token);
  }

  refreshToken(): Observable<HttpResponse<{ token: string }>> {
    return this.httpClient.post<{ token: string }>(`${this.apiUrl}/refresh-token`, {}, { observe: 'response' });
  }

  Logout() {
    this.isLoggedIn = false;
    this.loggedUser = '';
    this.roles = [];
    this.token = '';
    localStorage.removeItem('jwt');
  }

  private decodedJWT(): void {
    if (this.token != undefined) {
      const decodedToken = this.helper.decodeToken(this.token);
      this.roles = decodedToken.roles;
      this.loggedUser = decodedToken.sub;
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    console.error('HTTP Error:', error);
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      try {
        const parsedError = JSON.parse(error.error);
        errorMessage = parsedError.message || errorMessage;
      } catch (e) {
        errorMessage = error.error?.text || errorMessage;
      }
    }
    return throwError(errorMessage);
  }
}