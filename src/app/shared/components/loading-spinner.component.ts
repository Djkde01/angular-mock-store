import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'primary' | 'secondary' | 'white';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getContainerClasses()">
      <!-- Spinner -->
      <div [class]="getSpinnerClasses()"></div>

      <!-- Loading text -->
      <p *ngIf="text" [class]="getTextClasses()">{{ text }}</p>
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() size: SpinnerSize = 'md';
  @Input() variant: SpinnerVariant = 'primary';
  @Input() text = '';
  @Input() centered = true;
  @Input() inline = false;
  @Input() customClasses = '';

  getContainerClasses(): string {
    const baseClasses = this.inline ? 'inline-flex' : 'flex flex-col';
    const centerClasses = this.centered && !this.inline ? 'items-center justify-center' : 'items-center';
    const spacingClasses = this.text ? 'space-y-2' : '';

    return `${baseClasses} ${centerClasses} ${spacingClasses} ${this.customClasses}`.trim();
  }

  getSpinnerClasses(): string {
    const baseClasses = 'animate-spin rounded-full border-2 border-solid';

    const sizeClasses = {
      xs: 'h-3 w-3 border-[1px]',
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12 border-4'
    };

    const variantClasses = {
      primary: 'border-indigo-600 border-t-transparent',
      secondary: 'border-gray-600 border-t-transparent',
      white: 'border-white border-t-transparent'
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }

  getTextClasses(): string {
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg'
    };

    const variantClasses = {
      primary: 'text-gray-600',
      secondary: 'text-gray-500',
      white: 'text-white'
    };

    return `font-medium ${sizeClasses[this.size]} ${variantClasses[this.variant]}`;
  }
}
