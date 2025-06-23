import { Component, Input, forwardRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'date'
  | 'number'
  | 'tel'

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative mb-2">
      <label
        *ngIf="label"
        [for]="id"
        class="block text-sm font-medium text-gray-700 mb-2"
      >
        {{ label }}
        <span *ngIf="required" class="text-red-500 ml-1">*</span>
      </label>

      <div class="relative">
        <!-- Icon Left -->
        <div
          *ngIf="iconLeft"
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <span [innerHTML]="iconLeft" class="text-gray-400"></span>
        </div>

        <!-- Input Field -->
        <input
          [id]="id"
          [name]="name"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [value]="value"
          [class]="getInputClasses()"
          (input)="onInput($event)"
        />

        <!-- Icon Right -->
        <div
          *ngIf="iconRight"
          class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
        >
          <span [innerHTML]="iconRight" class="text-gray-400"></span>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage && showError" class="mt-2">
        <p class="text-sm text-red-600 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
          {{ errorMessage }}
        </p>
      </div>

      <!-- Helper Text -->
      <div *ngIf="helperText && !errorMessage" class="mt-2">
        <p class="text-sm text-gray-500">{{ helperText }}</p>
      </div>
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = ''
  @Input() name = ''
  @Input() label = ''
  @Input() type: InputType = 'text'
  @Input() placeholder = ''
  @Input() disabled = false
  @Input() readonly = false
  @Input() required = false
  @Input() errorMessage = ''
  @Input() helperText = ''
  @Input() iconLeft?: string
  @Input() iconRight?: string
  @Input() showError = false

  value = ''

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private onChange = (value: string) => {
    // No-op by default
  }
  private onTouched = () => {
    // No-op by default
  }

  writeValue(value: string): void {
    this.value = value || ''
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement
    this.value = target.value
    this.onChange(this.value)
  }

  onBlur(): void {
    this.onTouched()
  }

  getInputClasses(): string {
    const baseClasses =
      'appearance-none relative block w-full px-4 py-3 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent sm:text-sm transition-all duration-200 hover:border-gray-400'

    const iconLeftClass = this.iconLeft ? 'pl-10' : ''
    const iconRightClass = this.iconRight ? 'pr-10' : ''

    const errorClasses =
      this.errorMessage && this.showError
        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'

    const disabledClass = this.disabled ? 'bg-gray-50 cursor-not-allowed' : ''

    return `${baseClasses} ${iconLeftClass} ${iconRightClass} ${errorClasses} ${disabledClass}`.trim()
  }
}
