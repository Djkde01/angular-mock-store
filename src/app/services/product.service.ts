import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'https://fakestoreapi.com/products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get all products from the API
   */
  getProducts(): Observable<Product[]> {
    this.loadingSubject.next(true);
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map(products => {
        this.productsSubject.next(products);
        this.loadingSubject.next(false);
        return products;
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error fetching products:', error);
        return throwError(() => new Error('Failed to load products'));
      })
    );
  }

  /**
   * Get a single product by ID
   */
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching product:', error);
        return throwError(() => new Error('Failed to load product'));
      })
    );
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return throwError(() => new Error('Failed to load categories'));
      })
    );
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    this.loadingSubject.next(true);
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`).pipe(
      map(products => {
        this.loadingSubject.next(false);
        return products;
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        console.error('Error fetching products by category:', error);
        return throwError(() => new Error('Failed to load products by category'));
      })
    );
  }

  /**
   * Filter products locally
   */
  filterProducts(products: Product[], filters: {
    category?: string;
    search?: string;
  }): Product[] {
    return products.filter(product => {
      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });
  }
}
