import { Component, inject } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { CommonModule } from '@angular/common'
import { AuthService } from '../../services/auth.service'
import { LoginRequest } from '../../models/user.model'
import {
  CardComponent,
  InputComponent,
  ButtonComponent,
  AlertComponent,
} from '../../../shared/components'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    CardComponent,
    InputComponent,
    ButtonComponent,
    AlertComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup
  loading = false
  errorMessage = ''

  fb = inject(FormBuilder)
  authService = inject(AuthService)
  router = inject(Router)
  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  get email() {
    return this.loginForm.get('email')
  }

  get password() {
    return this.loginForm.get('password')
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true
      this.errorMessage = ''

      const loginData: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      }

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.loading = false
          console.log('Login successful:', response)
          this.router.navigate(['/dashboard']) // Navigate to dashboard or home
        },
        error: (error) => {
          this.loading = false
          this.errorMessage =
            error.message ||
            'Fallo al iniciar sesión. Por favor, inténtelo de nuevo.'
          console.error('Login error:', error)
        },
      })
    } else {
      this.markFormGroupTouched()
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key)
      control?.markAsTouched()
    })
  }

  getEmailErrorMessage(): string {
    const emailControl = this.email
    if (emailControl?.errors?.['required']) {
      return 'El correo electrónico es obligatorio'
    }
    if (emailControl?.errors?.['email']) {
      return 'Por favor ingresa una dirección de correo electrónico válida'
    }
    return ''
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.password
    if (passwordControl?.errors?.['required']) {
      return 'La contraseña es obligatoria'
    }
    if (passwordControl?.errors?.['minlength']) {
      return 'La contraseña debe tener al menos 8 caracteres'
    }
    return ''
  }
}
