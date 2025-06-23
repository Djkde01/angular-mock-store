import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="getButtonClasses()"
      (click)="onClick($event)"
    >
      <!-- Loading Spinner -->
      <span *ngIf="loading" class="flex items-center justify-center mr-2">
        <svg
          class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
        ></svg>
      </span>

      <!-- Icon (left) -->
      <span
        *ngIf="iconLeft && !loading"
        [innerHTML]="iconLeft"
        class="mr-2"
      ></span>

      <!-- Button Content -->
      <span [class.opacity-0]="loading">
        <ng-content></ng-content>
      </span>

      <!-- Icon (right) -->
      <span
        *ngIf="iconRight && !loading"
        [innerHTML]="iconRight"
        class="ml-2"
      ></span>
    </button>
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary'
  @Input() size: ButtonSize = 'md'
  @Input() type: 'button' | 'submit' | 'reset' = 'button'
  @Input() disabled = false
  @Input() loading = false
  @Input() fullWidth = false
  @Input() iconLeft?: string
  @Input() iconRight?: string
  @Input() customClasses = ''

  @Output() buttonClick = new EventEmitter<Event>()

  onClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event)
    }
  }

  getButtonClasses(): string {
    const baseClasses =
      'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105'

    const variantClasses = {
      primary:
        'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white focus:ring-indigo-500 shadow-lg hover:shadow-xl',
      secondary:
        'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500 border border-gray-300',
      danger:
        'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
      success:
        'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-500 shadow-lg hover:shadow-xl',
      ghost:
        'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
    }

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    const widthClass = this.fullWidth ? 'w-full' : ''
    const disabledClass =
      this.disabled || this.loading ? 'opacity-50 cursor-not-allowed' : ''

    return `${baseClasses} ${variantClasses[this.variant]} ${sizeClasses[this.size]} ${widthClass} ${disabledClass} ${this.customClasses}`.trim()
  }
}
