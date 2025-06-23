import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'default' | 'product' | 'form' | 'elevated';
export type CardSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getCardClasses()">
      <!-- Header slot -->
      <div *ngIf="title || hasHeaderSlot" [class]="getHeaderClasses()">
        <h3 *ngIf="title" class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h3>
        <ng-content select="[slot=header]"></ng-content>
      </div>

      <!-- Main content -->
      <div [class]="getContentClasses()">
        <ng-content></ng-content>
      </div>

      <!-- Footer slot -->
      <div *ngIf="hasFooterSlot" [class]="getFooterClasses()">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() size: CardSize = 'md';
  @Input() title = '';
  @Input() hoverable = false;
  @Input() clickable = false;
  @Input() customClasses = '';

  // Check if slots are being used
  hasHeaderSlot = false;
  hasFooterSlot = false;

  getCardClasses(): string {
    const baseClasses =
      'bg-white rounded-xl border border-gray-200 transition-all duration-300';

    const variantClasses = {
      default: 'shadow-sm hover:shadow-md',
      product:
        'shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden',
      form: 'shadow-lg',
      elevated: 'shadow-xl hover:shadow-2xl',
    };

    const sizeClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const interactiveClasses = this.hoverable
      ? 'hover:shadow-lg cursor-pointer'
      : '';
    const clickableClasses = this.clickable ? 'cursor-pointer' : '';

    return `${baseClasses} ${variantClasses[this.variant]} ${
      sizeClasses[this.size]
    } ${interactiveClasses} ${clickableClasses} ${this.customClasses}`.trim();
  }

  getHeaderClasses(): string {
    const sizeClasses = {
      sm: 'mb-3',
      md: 'mb-4',
      lg: 'mb-6',
    };

    return `border-b border-gray-100 pb-3 ${sizeClasses[this.size]}`;
  }

  getContentClasses(): string {
    return 'flex-1';
  }

  getFooterClasses(): string {
    const sizeClasses = {
      sm: 'mt-3',
      md: 'mt-4',
      lg: 'mt-6',
    };

    return `border-t border-gray-100 pt-3 ${sizeClasses[this.size]}`;
  }
}
