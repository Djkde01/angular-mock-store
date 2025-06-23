import { inject, Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Country,
} from '../models/user.model';
import { HttpClient } from '@angular/common/http';

// FakeStore API interfaces
interface FakeStoreLoginRequest {
  username: string;
  password: string;
}

interface FakeStoreLoginResponse {
  token: string;
}

interface FakeStoreRegisterRequest {
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
}

interface FakeStoreRegisterResponse {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://fakestoreapi.com';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'current_user';
  private readonly registeredUsersKey = 'registered_users';

  http: HttpClient = inject(HttpClient);
  constructor() {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem(this.userKey);
    const storedToken = localStorage.getItem(this.tokenKey);
    if (storedUser && storedToken) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }

    // Initialize registered users if not exists
    this.initializeRegisteredUsers();
  }

  private initializeRegisteredUsers(): void {
    const existingUsers = localStorage.getItem(this.registeredUsersKey);
    if (!existingUsers) {
      localStorage.setItem(this.registeredUsersKey, JSON.stringify([]));
    }
  }

  private getRegisteredUsers(): User[] {
    const users = localStorage.getItem(this.registeredUsersKey);
    return users ? JSON.parse(users) : [];
  }

  private saveRegisteredUser(user: User): void {
    const users = this.getRegisteredUsers();
    users.push(user);
    localStorage.setItem(this.registeredUsersKey, JSON.stringify(users));
  }

  private findUserByEmail(email: string): User | null {
    const users = this.getRegisteredUsers();
    return (
      users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ||
      null
    );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    if (!credentials.email || !credentials.password) {
      return throwError(() => new Error('Email y contraseña son obligatorios'));
    }

    // Check if user exists in local storage
    const storedUser = this.findUserByEmail(credentials.email);
    if (!storedUser) {
      return throwError(
        () =>
          new Error(
            'No se encontró ninguna cuenta con este correo electrónico. Por favor, regístrate primero.'
          )
      );
    }

    // Validate password
    if (storedUser.password !== credentials.password) {
      return throwError(
        () => new Error('Contraseña inválida. Por favor, inténtelo de nuevo.')
      );
    }

    // User is valid, now get token from FakeStore API using test credentials
    const fakeStoreLoginRequest: FakeStoreLoginRequest = {
      username: 'mor_2314',
      password: '83r5^_',
    };

    return this.http
      .post<FakeStoreLoginResponse>(
        `${this.apiUrl}/auth/login`,
        fakeStoreLoginRequest
      )
      .pipe(
        map((response) => {
          // Create user object for session (without password for security)
          const sessionUser: User = {
            id: storedUser.id,
            email: storedUser.email,
            username: storedUser.username,
            firstName: storedUser.firstName,
            lastName: storedUser.lastName,
            createdAt: storedUser.createdAt,
            updatedAt: new Date(),
          };

          const authResponse: AuthResponse = {
            user: sessionUser,
            token: response.token,
            refreshToken: response.token, // FakeStore doesn't provide refresh token
          };

          // Store user and token in session
          localStorage.setItem(this.userKey, JSON.stringify(sessionUser));
          localStorage.setItem(this.tokenKey, response.token);
          this.currentUserSubject.next(sessionUser);

          return authResponse;
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(
            () =>
              new Error(
                'Fallo de autenticación. Por favor, inténtelo de nuevo.'
              )
          );
        })
      );
  }

  register(
    userData: RegisterRequest
  ): Observable<{ success: boolean; message: string }> {
    // Validate required fields
    if (!userData.email || !userData.password) {
      return throwError(() => new Error('Email y contraseña son obligatorios'));
    }

    // Check if user already exists
    const existingUser = this.findUserByEmail(userData.email);
    if (existingUser) {
      return throwError(
        () =>
          new Error(
            'Ya existe una cuenta con esta dirección de correo electrónico. Usa un correo diferente o intenta iniciar sesión.'
          )
      );
    }

    // Create new user object
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      username:
        userData.username || this.extractUsernameFromEmail(userData.email),
      firstName: userData.firstName || 'User',
      lastName: userData.lastName || 'User',
      password: userData.password, // Store password for local validation
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save user to local storage
    this.saveRegisteredUser(newUser);

    // Simulate API call to FakeStore for consistency (this would normally create user on server)
    const fakeStoreRegisterRequest: FakeStoreRegisterRequest = {
      email: userData.email,
      username: newUser.username || 'user',
      password: userData.password,
      name: {
        firstname: newUser.firstName || 'User',
        lastname: newUser.lastName || 'User',
      },
      address: {
        city: 'Unknown',
        street: 'Main St',
        number: 123,
        zipcode: '12345',
        geolocation: {
          lat: '0',
          long: '0',
        },
      },
      phone: '555-0123',
    };

    return this.http
      .post<FakeStoreRegisterResponse>(
        `${this.apiUrl}/users`,
        fakeStoreRegisterRequest
      )
      .pipe(
        map((response) => {
          console.log('Registration successful (FakeStore):', response);
          console.log('User saved locally:', {
            ...newUser,
            password: '[HIDDEN]',
          });
          return {
            success: true,
            message:
              '¡Cuenta creada con éxito! Ahora puedes iniciar sesión con tus credenciales.',
          };
        }),
        catchError((error) => {
          console.error('Registration error:', error);
          // Remove user from local storage if API call fails
          const users = this.getRegisteredUsers();
          const filteredUsers = users.filter(
            (user) => user.email !== userData.email
          );
          localStorage.setItem(
            this.registeredUsersKey,
            JSON.stringify(filteredUsers)
          );
          return throwError(
            () =>
              new Error(
                'Fallo al crear la cuenta. Por favor, inténtelo de nuevo.'
              )
          );
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  // Debug method to view registered users (remove passwords for security)
  getRegisteredUsersForDebug(): User[] {
    const users = this.getRegisteredUsers();
    return users.map((user) => ({
      ...user,
      password: '[HIDDEN]',
    }));
  }

  // Method to clear all registered users (for testing/development)
  clearAllRegisteredUsers(): void {
    localStorage.setItem(this.registeredUsersKey, JSON.stringify([]));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = localStorage.getItem(this.userKey);
    return !!(token && user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Helper methods
  private extractUsernameFromEmail(email: string): string {
    // Generate a unique username from email
    const emailUsername = email.split('@')[0].toLowerCase();
    // Remove special characters and add random suffix for uniqueness
    const cleanUsername = emailUsername.replace(/[^a-z0-9]/g, '');
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${cleanUsername}_${randomSuffix}`;
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  loadCountries(fields: string[]): Observable<Country[]> {
    // Example of fields to fetch: ['name', 'region', 'translations', 'flags', 'alpha2Code']
    if (!fields || fields.length === 0) {
      return throwError(() => new Error('Fields parameter is required'));
    }
    // Construct the URL with the specified fields
    const fieldsParam = fields.join(',');
    // Fetch countries from an external API
    return this.http.get<Country[]>(
      `https://restcountries.com/v3.1/all?fields=${fieldsParam}`
    );
  }
}
