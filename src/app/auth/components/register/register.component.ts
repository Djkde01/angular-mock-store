import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  FormArray,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest, Country } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
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

  genres = [
    { value: 'male', label: 'Masculino' },
    { value: 'female', label: 'Femenino' },
    { value: 'other', label: 'Otro' },
    { value: 'prefer-not-to-say', label: 'Prefiero no decir' }
  ];

  interestOptions = [
    'Tecnología', 'Deportes', 'Música', 'Arte', 'Cocina', 'Viajes',
    'Lectura', 'Cine', 'Fotografía', 'Gaming', 'Fitness', 'Naturaleza',
    'Ciencia', 'Historia', 'Moda', 'Negocios'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(2), this.noSpecialCharactersValidator]],
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
        interests: this.fb.array([], [Validators.required]),
        residenceCountry: ['', [Validators.required]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    const countries = this.authService.loadCountries(['name', 'region', 'translations', 'flag', 'alpha2Code']);
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
      },
      error: (error) => {
        this.loadingCountries = false;
        this.errorMessage = 'No se pudieron cargar los países. Por favor, inténtelo de nuevo más tarde.';
        console.error('Error loading countries:', error);
      }
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
  noSpecialCharactersValidator(control: AbstractControl): ValidationErrors | null {
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

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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
    return this.registerForm.get('interests') as FormArray;
  }
  get residenceCountry() {
    return this.registerForm.get('residenceCountry');
  }

  onInterestChange(interest: string, event: any): void {
    const interestsArray = this.interests;
    if (event.target.checked) {
      interestsArray.push(this.fb.control(interest));
    } else {
      const index = interestsArray.controls.findIndex(x => x.value === interest);
      if (index >= 0) {
        interestsArray.removeAt(index);
      }
    }
  }

  isInterestSelected(interest: string): boolean {
    return this.interests.controls.some(control => control.value === interest);
  }

  generateUsername(fullName: string): string {
    return fullName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^a-z0-9_]/g, ''); // Remove any remaining special characters
  }

  onGenreChange(event: string): void {
    const selectedGenre = event.toLocaleLowerCase();
    this.registerForm.patchValue({ genre: selectedGenre });
  }

  getGenreIcon(genre: string): string {
    switch (genre.toLowerCase()) {
      case
        'male':
        return '👨';
      case 'female':
        return '👩';
      case 'other':
        return '🌈';
      case 'prefer-not-to-say':
        return '👥';
      default:
        return '❓';
    }
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
        lastName: fullName.split(' ').slice(1).join(' ') || fullName.split(' ')[0],
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
            error.message || 'Fallo al crear la cuenta. Por favor, inténtelo de nuevo.';
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
