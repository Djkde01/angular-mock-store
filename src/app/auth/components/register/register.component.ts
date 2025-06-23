import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest, Country } from '../../models/user.model';
import {
  CardComponent,
  InputComponent,
  ButtonComponent,
  AlertComponent,
  DateInputComponent,
  SelectComponent,
  RadioGroupComponent,
  CheckboxGroupComponent,
  SelectOptionGroup,
  RadioOption,
  CheckboxOption,
} from '../../../shared/components';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    CardComponent,
    InputComponent,
    ButtonComponent,
    AlertComponent,
    DateInputComponent,
    SelectComponent,
    RadioGroupComponent,
    CheckboxGroupComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  countries: Country[] = [];
  americasCountries: Country[] = [];
  otherCountries: Country[] = [];
  loadingCountries = true;

  genreOptions: RadioOption[] = [
    { value: 'male', label: 'Masculino', icon: '👨' },
    { value: 'female', label: 'Femenino', icon: '👩' },
    { value: 'other', label: 'Otro', icon: '🌈' },
    { value: 'prefer-not-to-say', label: 'Prefiero no decir', icon: '👥' },
  ];

  interestOptions: CheckboxOption[] = [
    { value: 'tecnologia', label: 'Tecnología' },
    { value: 'deportes', label: 'Deportes' },
    { value: 'musica', label: 'Música' },
    { value: 'arte', label: 'Arte' },
    { value: 'cocina', label: 'Cocina' },
    { value: 'viajes', label: 'Viajes' },
    { value: 'lectura', label: 'Lectura' },
    { value: 'cine', label: 'Cine' },
    { value: 'fotografia', label: 'Fotografía' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'naturaleza', label: 'Naturaleza' },
    { value: 'ciencia', label: 'Ciencia' },
    { value: 'historia', label: 'Historia' },
    { value: 'moda', label: 'Moda' },
    { value: 'negocios', label: 'Negocios' },
  ];

  countryOptions: SelectOptionGroup[] = [];

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  constructor() {
    this.registerForm = this.fb.group(
      {
        fullName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            this.noSpecialCharactersValidator,
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordStrengthValidator,
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        dateOfBirth: ['', [Validators.required, this.ageValidator]],
        genre: ['', [Validators.required]],
        interests: ['', [Validators.required]],
        residenceCountry: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    const countries = this.authService.loadCountries([
      'name',
      'region',
      'translations',
      'flag',
      'alpha2Code',
    ]);
    countries.subscribe({
      next: (data: Country[]) => {
        this.countries = data;
        this.loadingCountries = false;

        // Filter countries by region
        this.countries = this.sortCountriesByName(this.countries);
        this.americasCountries = this.countries.filter(
          (country) => country.region === 'Americas'
        );
        this.otherCountries = this.countries.filter(
          (country) => country.region !== 'Americas'
        );

        // Create country options for SelectComponent
        this.countryOptions = [
          {
            label: 'Americas',
            options: this.americasCountries.map((country) => ({
              value: country.alpha2Code || country.name.common,
              label: `${country.flag} ${
                country.translations?.spa?.common || country.name.common
              }`,
            })),
          },
          {
            label: 'Other Countries',
            options: this.otherCountries.map((country) => ({
              value: country.alpha2Code || country.name.common,
              label: `${country.flag} ${
                country.translations?.spa?.common || country.name.common
              }`,
            })),
          },
        ];
      },
      error: (error) => {
        this.loadingCountries = false;
        this.errorMessage =
          'No se pudieron cargar los países. Por favor, inténtelo de nuevo más tarde.';
        console.error('Error loading countries:', error);
      },
    });
  }

  sortCountriesByName(countries: Country[]): Country[] {
    return countries.sort((a, b) => {
      const nameA = a.name.common.toLowerCase();
      const nameB = b.name.common.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }

  // Custom validator for no special characters in full name
  noSpecialCharactersValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasSpecialChars = /[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/.test(value);
    if (hasSpecialChars) {
      return { noSpecialCharacters: true };
    }
    return null;
  }

  // Custom validator for age (must be at least 13 years old)
  ageValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age < 13 ? { minimumAge: true } : null;
    }

    return age < 13 ? { minimumAge: true } : null;
  }

  // Custom validator for password strength
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[#?!@$%^&*-]/.test(value);

    const valid = hasNumber && hasUpper && hasLower && hasSpecial;
    if (!valid) {
      return { passwordStrength: true };
    }
    return null;
  }

  // Custom validator for password match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  get fullName() {
    return this.registerForm.get('fullName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
  get dateOfBirth() {
    return this.registerForm.get('dateOfBirth');
  }
  get genre() {
    return this.registerForm.get('genre');
  }
  get interests() {
    return this.registerForm.get('interests');
  }
  get residenceCountry() {
    return this.registerForm.get('residenceCountry');
  }

  // Helper methods for form validation
  hasFieldError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.dirty));
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || field.valid || (!field.touched && !field.dirty)) {
      return '';
    }

    const errors = field.errors;
    if (!errors) return '';

    // Handle specific field errors
    if (fieldName === 'fullName') {
      if (errors['required']) return 'El nombre completo es obligatorio';
      if (errors['minlength'])
        return 'El nombre debe tener al menos 2 caracteres';
      if (errors['noSpecialCharacters'])
        return 'El nombre no puede contener caracteres especiales';
    }

    if (fieldName === 'email') {
      if (errors['required']) return 'El email es obligatorio';
      if (errors['email']) return 'Ingresa un email válido';
    }

    if (fieldName === 'password') {
      if (errors['required']) return 'La contraseña es obligatoria';
      if (errors['minlength'])
        return 'La contraseña debe tener al menos 8 caracteres';
      if (errors['passwordStrength'])
        return 'La contraseña debe contener al menos: una mayúscula, una minúscula, un número y un carácter especial';
    }

    if (fieldName === 'confirmPassword') {
      if (errors['required']) return 'Confirma tu contraseña';
      // Check for form-level password mismatch error
      const formErrors = this.registerForm.errors;
      if (formErrors && formErrors['passwordMismatch']) {
        return 'Las contraseñas no coinciden';
      }
    }

    if (fieldName === 'dateOfBirth') {
      if (errors['required']) return 'La fecha de nacimiento es obligatoria';
      if (errors['minimumAge']) return 'Debes tener al menos 13 años';
    }

    if (fieldName === 'genre') {
      if (errors['required']) return 'Por favor selecciona un género';
    }

    if (fieldName === 'interests') {
      if (errors['required']) return 'Por favor selecciona al menos un interés';
    }

    if (fieldName === 'residenceCountry') {
      if (errors['required']) return 'El país es obligatorio';
    }

    return 'Campo requerido';
  }

  generateUsername(fullName: string): string {
    return fullName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^a-z0-9_]/g, ''); // Remove any remaining special characters
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const fullName = this.registerForm.value.fullName;
      const username = this.generateUsername(fullName);

      const registerData: RegisterRequest = {
        firstName: fullName.split(' ')[0],
        lastName:
          fullName.split(' ').slice(1).join(' ') || fullName.split(' ')[0],
        username: username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        confirmPassword: this.registerForm.value.confirmPassword,
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Registration successful:', response);

          // Show success message
          this.successMessage = response.message;

          // Redirect to login after a short delay
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage =
            error.message ||
            'Fallo al crear la cuenta. Por favor, inténtelo de nuevo.';
          console.error('Registration error:', error);
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
}
