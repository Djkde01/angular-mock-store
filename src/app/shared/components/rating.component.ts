import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'

export type RatingSize = 'sm' | 'md' | 'lg'

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex items-center space-x-1"
      [attr.aria-label]="
        'Calificación: ' + rating + ' de ' + maxRating + ' estrellas'
      "
    >
      <!-- Stars -->
      <div class="flex items-center">
        <button
          *ngFor="let star of stars; let i = index"
          (click)="onStarClick(i + 1)"
          (mouseenter)="onStarHover(i + 1)"
          (mouseleave)="onMouseLeave()"
          [disabled]="readonly"
          [class]="getStarClasses(i + 1)"
          [attr.aria-label]="'Calificar con ' + (i + 1) + ' estrellas'"
          type="button"
        >
          <!-- Full star -->
          <svg
            *ngIf="getStarType(i + 1) === 'full'"
            [class]="getStarSizeClasses()"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            ></path>
          </svg>

          <!-- Half star -->
          <svg
            *ngIf="getStarType(i + 1) === 'half'"
            [class]="getStarSizeClasses()"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient [id]="'half-' + i">
                <stop offset="50%" stop-color="currentColor"></stop>
                <stop offset="50%" stop-color="transparent"></stop>
              </linearGradient>
            </defs>
            <path
              [attr.fill]="'url(#half-' + i + ')'"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            ></path>
            <path
              fill="currentColor"
              opacity="0.3"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            ></path>
          </svg>

          <!-- Empty star -->
          <svg
            *ngIf="getStarType(i + 1) === 'empty'"
            [class]="getStarSizeClasses()"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Rating text -->
      <span *ngIf="showRatingText" [class]="getRatingTextClasses()">
        {{ rating | number: '1.1-1' }}
      </span>

      <!-- Count text -->
      <span
        *ngIf="showCount && count !== undefined"
        [class]="getCountTextClasses()"
      >
        ({{ count }})
      </span>
    </div>
  `,
})
export class RatingComponent implements OnInit {
  @Input() rating = 0
  @Input() maxRating = 5
  @Input() size: RatingSize = 'md'
  @Input() readonly = true
  @Input() allowHalf = true
  @Input() showRatingText = false
  @Input() showCount = false
  @Input() count?: number
  @Input() customClasses = ''

  @Output() ratingChange = new EventEmitter<number>()

  hoveredRating = 0
  stars: number[] = []

  ngOnInit() {
    this.stars = Array(this.maxRating)
      .fill(0)
      .map((_, i) => i + 1)
  }

  onStarClick(value: number): void {
    if (!this.readonly) {
      this.rating = value
      this.ratingChange.emit(value)
    }
  }

  onStarHover(value: number): void {
    if (!this.readonly) {
      this.hoveredRating = value
    }
  }

  onMouseLeave(): void {
    if (!this.readonly) {
      this.hoveredRating = 0
    }
  }

  getStarType(position: number): 'full' | 'half' | 'empty' {
    const currentRating = this.hoveredRating || this.rating

    if (currentRating >= position) {
      return 'full'
    } else if (this.allowHalf && currentRating >= position - 0.5) {
      return 'half'
    } else {
      return 'empty'
    }
  }

  getStarClasses(position: number): string {
    const baseClasses = 'focus:outline-none transition-colors duration-200'
    const interactiveClasses = this.readonly
      ? ''
      : 'hover:scale-110 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50'

    const starType = this.getStarType(position)

    let colorClasses = ''
    if (starType === 'full') {
      colorClasses = 'text-yellow-400'
    } else if (starType === 'half') {
      colorClasses = 'text-yellow-400'
    } else {
      colorClasses = this.readonly
        ? 'text-gray-300'
        : 'text-gray-300 hover:text-yellow-400'
    }

    const disabledClasses = this.readonly ? 'cursor-default' : 'cursor-pointer'

    return `${baseClasses} ${interactiveClasses} ${colorClasses} ${disabledClasses} ${this.customClasses}`.trim()
  }

  getStarSizeClasses(): string {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    }

    return sizeClasses[this.size]
  }

  getRatingTextClasses(): string {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
    }

    return `font-medium text-gray-900 ${sizeClasses[this.size]}`
  }

  getCountTextClasses(): string {
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
    }

    return `text-gray-500 ${sizeClasses[this.size]}`
  }
}
