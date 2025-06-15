export interface User {
  id?: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  password?: string; // For local storage validation
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface Country {
  name: {
    common: string;
    official: string;
  };
  region: string;
  translations: {
    spa: {
      common: string;
      official: string;
    };
  };
  flag: string;
  alpha2Code: string;
}
