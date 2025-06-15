import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavItem {
  label: string;
  route?: string;
  href?: string;
  icon?: string;
  action?: () => void;
}

export interface UserInfo {
  name: string;
  avatar?: string;
  email?: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200" role="navigation">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">

          <!-- Left side - Logo and navigation -->
          <div class="flex items-center">
            <!-- Logo -->
            <div class="flex items-center space-x-3">

              <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {{ title }}
              </h1>
            </div>

            <!-- Navigation items (desktop) -->
            <div class="hidden md:flex items-center space-x-8 ml-8" *ngIf="navItems.length > 0">
              <ng-container *ngFor="let item of navItems">
                <!-- Router link -->
                <a
                  *ngIf="item.route"
                  [routerLink]="item.route"
                  routerLinkActive="text-indigo-600 border-b-2 border-indigo-600"
                  class="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200 border-b-2 border-transparent"
                >
                  <span *ngIf="item.icon" [innerHTML]="item.icon" class="inline-block w-4 h-4 mr-2"></span>
                  {{ item.label }}
                </a>

                <!-- External link -->
                <a
                  *ngIf="item.href && !item.route"
                  [href]="item.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  <span *ngIf="item.icon" [innerHTML]="item.icon" class="inline-block w-4 h-4 mr-2"></span>
                  {{ item.label }}
                </a>

                <!-- Action button -->
                <button
                  *ngIf="!item.route && !item.href && item.action"
                  (click)="item.action()"
                  class="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  <span *ngIf="item.icon" [innerHTML]="item.icon" class="inline-block w-4 h-4 mr-2"></span>
                  {{ item.label }}
                </button>
              </ng-container>
            </div>
          </div>

          <!-- Right side - User info and actions -->
          <div class="flex items-center space-x-4">
            <!-- Back button (if provided) -->
            <button
              *ngIf="showBackButton"
              (click)="onBackClick()"
              class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span class="font-medium">{{ backButtonText }}</span>
            </button>

            <!-- User info -->
            <div *ngIf="userInfo" class="flex items-center space-x-3">
              <!-- User avatar and name -->
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Bienvenido, <span class="font-medium text-gray-900">{{ userInfo.name }}</span>!
                </span>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center space-x-2">
              <!-- Custom action slot -->
              <ng-content select="[slot=actions]"></ng-content>

              <!-- Logout button (if user is present) -->
              <button
                *ngIf="userInfo && showLogoutButton"
                (click)="onLogout()"
                class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                {{ logoutButtonText }}
              </button>
            </div>

            <!-- Mobile menu button -->
            <button
              *ngIf="navItems.length > 0"
              (click)="toggleMobileMenu()"
              class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span class="sr-only">Abrir menú principal</span>
              <svg
                *ngIf="!mobileMenuOpen"
                class="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                *ngIf="mobileMenuOpen"
                class="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div *ngIf="mobileMenuOpen && navItems.length > 0" class="md:hidden border-t border-gray-200 pt-4 pb-3">
          <div class="space-y-1">
            <ng-container *ngFor="let item of navItems">
              <!-- Router link -->
              <a
                *ngIf="item.route"
                [routerLink]="item.route"
                routerLinkActive="bg-indigo-50 border-indigo-500 text-indigo-700"
                (click)="closeMobileMenu()"
                class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <span *ngIf="item.icon" [innerHTML]="item.icon" class="inline-block w-4 h-4 mr-2"></span>
                {{ item.label }}
              </a>

              <!-- External link -->
              <a
                *ngIf="item.href && !item.route"
                [href]="item.href"
                target="_blank"
                rel="noopener noreferrer"
                (click)="closeMobileMenu()"
                class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <span *ngIf="item.icon" [innerHTML]="item.icon" class="inline-block w-4 h-4 mr-2"></span>
                {{ item.label }}
              </a>

              <!-- Action button -->
              <button
                *ngIf="!item.route && !item.href && item.action"
                (click)="executeActionAndCloseMobileMenu(item.action)"
                class="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <span *ngIf="item.icon" [innerHTML]="item.icon" class="inline-block w-4 h-4 mr-2"></span>
                {{ item.label }}
              </button>
            </ng-container>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavigationComponent {
  @Input() title = 'App';
  @Input() logoUrl = '';
  @Input() navItems: NavItem[] = [];
  @Input() userInfo?: UserInfo;
  @Input() showBackButton = false;
  @Input() backButtonText = 'Volver';
  @Input() showLogoutButton = true;
  @Input() logoutButtonText = 'Logout';

  @Output() backClick = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  mobileMenuOpen = false;

  onBackClick(): void {
    this.backClick.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  executeActionAndCloseMobileMenu(action: () => void): void {
    action();
    this.closeMobileMenu();
  }
}
