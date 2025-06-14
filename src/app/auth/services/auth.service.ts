import { Injectable } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Simulate API call - replace with actual HTTP call
    if (
      credentials.email === 'user@example.com' &&
      credentials.password === 'password'
    ) {
      const mockResponse: AuthResponse = {
        user: {
          id: '1',
          email: credentials.email,
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      };

      return of(mockResponse).pipe(
        delay(1000), // Simulate network delay
        tap((response) => {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        })
      );
    } else {
      return throwError(() => new Error('Invalid email or password')).pipe(
        delay(1000)
      );
    }
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    // Simulate API call - replace with actual HTTP call
    if (
      userData.email &&
      userData.password &&
      userData.password === userData.confirmPassword
    ) {
      const mockResponse: AuthResponse = {
        user: {
          id: '2',
          email: userData.email,
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      };

      return of(mockResponse).pipe(
        delay(1000), // Simulate network delay
        tap((response) => {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response.user);
        })
      );
    } else {
      return throwError(
        () => new Error('Registration failed. Please check your information.')
      ).pipe(delay(1000));
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
