import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface RadioOption {
  value: any;
  label: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-3 mb-2">
      <label *ngIf="label" class="block text-sm font-medium text-gray-700">
        {{ label }}
        <span *ngIf="required" class="text-red-500 ml-1">*</span>
      </label>

      <div [class]="getContainerClasses()">
        <label
          *ngFor="let option of options; trackBy: trackByValue"
          class="relative cursor-pointer"
          [class.pointer-events-none]="option.disabled"
          [class.opacity-50]="option.disabled"
        >
          <input
            type="radio"
            [name]="name || 'radio-group'"
            [value]="option.value"
            [checked]="value === option.value"
            [disabled]="disabled || option.disabled"
            (change)="onSelectionChange(option.value)"
            (blur)="onTouched()"
            class="sr-only peer"
          />
          <div [class]="getOptionClasses()">
            <div class="text-center">
              <div *ngIf="option.icon" class="text-2xl mb-1">
                {{ option.icon }}
              </div>
              <span [class]="getLabelClasses()">
                {{ option.label }}
              </span>
            </div>
          </div>
        </label>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage && showError" class="mt-2">
        <p class="text-sm text-red-600 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          {{ errorMessage }}
        </p>
      </div>

      <!-- Helper Text -->
      <div *ngIf="helperText && !errorMessage" class="mt-2">
        <p class="text-sm text-gray-500">{{ helperText }}</p>
      </div>
    </div>
  `
})
export class RadioGroupComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() name = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() errorMessage = '';
  @Input() helperText = '';
  @Input() showError = false;
  @Input() options: RadioOption[] = [];
  @Input() layout: 'horizontal' | 'vertical' | 'grid' = 'grid';
  @Input() columns = 2;

  value: any = null;

  private onChange = (value: any) => {};
  public onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectionChange(value: any): void {
    this.value = value;
    this.onChange(value);
  }

  trackByValue(index: number, option: RadioOption): any {
    return option.value;
  }

  getContainerClasses(): string {
    switch (this.layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-3';
      case 'vertical':
        return 'space-y-3';
      case 'grid':
      default:
        return `grid grid-cols-1 gap-3 sm:grid-cols-${this.columns}`;
    }
  }

  getOptionClasses(): string {
    return 'flex items-center justify-center p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200 peer-checked:border-purple-500 peer-checked:bg-purple-50 peer-checked:shadow-lg peer-checked:ring-2 peer-checked:ring-purple-200 peer-focus:ring-2 peer-focus:ring-purple-300 peer-focus:ring-offset-2';
  }

  getLabelClasses(): string {
    return 'text-sm font-medium text-gray-700 peer-checked:text-purple-700 select-none';
  }
}
