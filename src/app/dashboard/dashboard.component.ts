import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { ProductService } from '../services/product.service';
import { User } from '../auth/models/user.model';
import { Product } from '../models/product.model';
import {
  PaginationComponent,
  RatingComponent,
  UserInfo,
  NavItem,
  NavigationComponent,
  LoadingSpinnerComponent,
  AlertComponent,
  CardComponent,
  ButtonComponent,
} from '../shared/components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PaginationComponent,
    RatingComponent,
    NavigationComponent,
    LoadingSpinnerComponent,
    AlertComponent,
    CardComponent,
    ButtonComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Make Math available in template
  Math = Math;

  currentUser: User | null = null;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  categories: string[] = [];
  loading = false;
  error: string | null = null;

  // Filter and sort properties
  selectedCategory = '';
  searchTerm = '';
  sortBy: 'price-asc' | 'price-desc' | 'none' = 'none';

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 8;
  totalItems = 0;
  totalPages = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
        if (!user) {
          this.router.navigate(['/auth/login']);
        }
      });

    this.loadProducts();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load products';
          this.loading = false;
          console.error('Error loading products:', error);
        }
      });
  }

  loadCategories(): void {
    this.productService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      });
  }

  applyFilters(): void {
    const filters = {
      category: this.selectedCategory || undefined,
      search: this.searchTerm || undefined,
    };

    // Filter products
    this.filteredProducts = this.productService.filterProducts(this.products, filters);

    // Apply sorting
    this.applySorting();

    // Reset to first page and update pagination
    this.currentPage = 1;
    this.updatePagination();
  }

  applySorting(): void {
    switch (this.sortBy) {
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
  }

  updatePagination(): void {
    this.totalItems = this.filteredProducts.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onPriceChange(): void {
    this.applyFilters();
  }

  setSortBy(): void {
    // Dinamically set sortBy none to asc, asc to desc, and desc to none
    if (this.sortBy === 'none') {
      this.sortBy = 'price-asc';
    } else if (this.sortBy === 'price-asc') {
      this.sortBy = 'price-desc';
    } else {
      this.sortBy = 'none';
    }
    this.onSortChange();
  }

  getSortIcon(): string {
    switch (this.sortBy) {
      case 'price-asc':
        return '⇈';
      case 'price-desc':
        return '⇊';
      default:
        return '⇅';
    }
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.onCategoryChange();
  }

  onSortChange(): void {
    this.applyFilters();
    this.currentPage = 1;
    this.updatePagination();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      // Scroll to top of products section
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.searchTerm = '';
    this.sortBy = 'none';
    this.applyFilters();
  }

  // Pagination helper methods
  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getUserInfo(): UserInfo | undefined {
    if (!this.currentUser) return undefined;
    return {
      name: this.currentUser.firstName || this.currentUser.username || 'Usuario',
      email: this.currentUser.email
    };
  }
}
