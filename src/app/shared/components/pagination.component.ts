import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav
      class="bg-white rounded-lg shadow-lg border border-gray-200 p-4"
      role="navigation"
      aria-label="Pagination"
    >
      <div class="flex items-center justify-between">
        <!-- Items info -->
        <div class="text-sm text-gray-700">
          Mostrando <span class="font-medium">{{ startItem }}</span> a
          <span class="font-medium">{{ endItem }}</span> de
          <span class="font-medium">{{ totalItems }}</span> resultados
        </div>

        <!-- Pagination controls -->
        <div class="flex items-center space-x-2">
          <!-- Previous Button -->
          <button
            (click)="onPageChange(currentPage - 1)"
            [disabled]="!canGoPrevious()"
            [class]="getPreviousButtonClasses()"
            aria-label="Página anterior"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>

          <!-- First Page -->
          <button
            *ngIf="getPageNumbers()[0] > 1"
            (click)="onPageChange(1)"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
            [attr.aria-label]="'Ir a página 1'"
          >
            1
          </button>

          <!-- Ellipsis -->
          <span
            *ngIf="getPageNumbers()[0] > 2"
            class="px-2 py-2 text-gray-500"
            aria-hidden="true"
            >...</span
          >

          <!-- Page Numbers -->
          <button
            *ngFor="let page of getPageNumbers()"
            (click)="onPageChange(page)"
            [class]="getPageButtonClasses(page)"
            [attr.aria-label]="'Ir a página ' + page"
            [attr.aria-current]="page === currentPage ? 'page' : null"
          >
            {{ page }}
          </button>

          <!-- Ellipsis -->
          <span
            *ngIf="
              getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1
            "
            class="px-2 py-2 text-gray-500"
            aria-hidden="true"
          >
            ...
          </span>

          <!-- Last Page -->
          <button
            *ngIf="getPageNumbers()[getPageNumbers().length - 1] < totalPages"
            (click)="onPageChange(totalPages)"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
            [attr.aria-label]="'Ir a página ' + totalPages"
          >
            {{ totalPages }}
          </button>

          <!-- Next Button -->
          <button
            (click)="onPageChange(currentPage + 1)"
            [disabled]="!canGoNext()"
            [class]="getNextButtonClasses()"
            aria-label="Página siguiente"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  `,
})
export class PaginationComponent {
  @Input() currentPage = 1
  @Input() totalPages = 1
  @Input() totalItems = 0
  @Input() itemsPerPage = 10
  @Input() maxVisiblePages = 5

  @Output() pageChange = new EventEmitter<number>()

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems)
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page)
    }
  }

  getPageNumbers(): number[] {
    const pages = []

    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(this.maxVisiblePages / 2)
    )
    const endPage = Math.min(
      this.totalPages,
      startPage + this.maxVisiblePages - 1
    )

    if (endPage - startPage + 1 < this.maxVisiblePages) {
      startPage = Math.max(1, endPage - this.maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  canGoPrevious(): boolean {
    return this.currentPage > 1
  }

  canGoNext(): boolean {
    return this.currentPage < this.totalPages
  }

  getPreviousButtonClasses(): string {
    const baseClasses =
      'px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg transition-colors duration-200'
    const disabledClasses = !this.canGoPrevious()
      ? 'text-gray-300 cursor-not-allowed opacity-50'
      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'

    return `${baseClasses} ${disabledClasses}`
  }

  getNextButtonClasses(): string {
    const baseClasses =
      'px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg transition-colors duration-200'
    const disabledClasses = !this.canGoNext()
      ? 'text-gray-300 cursor-not-allowed opacity-50'
      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'

    return `${baseClasses} ${disabledClasses}`
  }

  getPageButtonClasses(page: number): string {
    const baseClasses =
      'px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200'

    if (page === this.currentPage) {
      return `${baseClasses} bg-indigo-600 text-white`
    } else {
      return `${baseClasses} text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700`
    }
  }
}
