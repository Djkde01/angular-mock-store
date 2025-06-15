import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'https://fakestoreapi.com/products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Get HTTP headers with authorization token if available
   */
  private getHttpHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Get all products from the API
   */
  getProducts(): Observable<Product[]> {
    this.loadingSubject.next(true);
    const headers = this.getHttpHeaders();

    return this.http.get<Product[]>(this.apiUrl, { headers }).pipe(
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
    const headers = this.getHttpHeaders();

    return this.http.get<Product>(`${this.apiUrl}/${id}`, { headers }).pipe(
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
    const headers = this.getHttpHeaders();

    return this.http.get<string[]>(`${this.apiUrl}/categories`, { headers }).pipe(
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
    const headers = this.getHttpHeaders();

    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`, { headers }).pipe(
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
