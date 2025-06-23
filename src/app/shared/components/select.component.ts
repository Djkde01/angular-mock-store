import { Component, Input, forwardRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectOptionGroup {
  label: string
  options: SelectOption[]
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
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

      <select
        [id]="id"
        [name]="name"
        [value]="value"
        [disabled]="disabled"
        [class]="getSelectClasses()"
        (change)="onSelectionChange($event)"
        (blur)="onTouched()"
      >
        <option *ngIf="placeholder" value="" disabled [selected]="!value">
          {{ placeholder }}
        </option>

        <!-- Simple options -->
        <option
          *ngFor="let option of options"
          [value]="option.value"
          [disabled]="option.disabled"
        >
          {{ option.label }}
        </option>

        <!-- Grouped options -->
        <optgroup *ngFor="let group of optionGroups" [label]="group.label">
          <option
            *ngFor="let option of group.options"
            [value]="option.value"
            [disabled]="option.disabled"
          >
            {{ option.label }}
          </option>
        </optgroup>
      </select>

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
export class SelectComponent implements ControlValueAccessor {
  @Input() id = ''
  @Input() name = ''
  @Input() label = ''
  @Input() placeholder = ''
  @Input() disabled = false
  @Input() required = false
  @Input() errorMessage = ''
  @Input() helperText = ''
  @Input() showError = false
  @Input() options: SelectOption[] = []
  @Input() optionGroups: SelectOptionGroup[] = []

  value: string | number | null = null

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (value: string | number | null) => {
    // No-op by default
  }
  onTouched = () => {
    // No-op by default
  }

  writeValue(value: string | number | null): void {
    this.value = value || ''
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  onSelectionChange(event: Event): void {
    const target = event.target as HTMLSelectElement
    this.value = target.value
    this.onChange(this.value)
  }

  getSelectClasses(): string {
    const baseClasses =
      'appearance-none relative block w-full px-4 py-3 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-all duration-200 hover:border-gray-400'
    const errorClasses = this.showError
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300'
    const disabledClasses = this.disabled ? 'bg-gray-50 cursor-not-allowed' : ''

    return `${baseClasses} ${errorClasses} ${disabledClasses}`.trim()
  }
}
