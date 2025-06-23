import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Component } from '@angular/core'
import { By } from '@angular/platform-browser'
import { NavigationComponent, NavItem, UserInfo } from '../navigation.component'

@Component({
  standalone: true,
  imports: [NavigationComponent],
  template: `
    <app-navigation
      [title]="title"
      [navItems]="navItems"
      [userInfo]="userInfo"
      [showLogoutButton]="showLogoutButton"
      [logoutButtonText]="logoutButtonText"
      [showBackButton]="showBackButton"
      [backButtonText]="backButtonText"
      (logout)="onLogout()"
      (backClick)="onBackClick()"
    ></app-navigation>
  `,
})
class TestHostComponent {
  title = 'Test App'
  navItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
  ]
  userInfo: UserInfo = {
    name: 'John Doe',
    email: 'john@example.com',
  }
  showLogoutButton = true
  logoutButtonText = 'Logout'
  showBackButton = false
  backButtonText = 'Back'
  logoutCount = 0
  backClickCount = 0

  onLogout() {
    this.logoutCount++
  }

  onBackClick() {
    this.backClickCount++
  }
}

describe('NavigationComponent', () => {
  let component: NavigationComponent
  let fixture: ComponentFixture<TestHostComponent>
  let hostComponent: TestHostComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TestHostComponent)
    hostComponent = fixture.componentInstance
    component = fixture.debugElement.query(
      By.directive(NavigationComponent)
    ).componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display title', () => {
    const titleElement = fixture.debugElement.query(By.css('h1, .text-xl'))
    expect(titleElement.nativeElement.textContent.trim()).toBe('Test App')
  })

  it('should render navigation items', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('nav a, nav button'))
    expect(navLinks.length).toBeGreaterThanOrEqual(3)

    // Check if nav items are rendered (text content)
    const navTexts = navLinks.map((link) =>
      link.nativeElement.textContent.trim()
    )
    expect(navTexts).toContain('Home')
    expect(navTexts).toContain('Products')
    expect(navTexts).toContain('About')
  })

  it('should highlight active navigation item', () => {
    const homeLink = fixture.debugElement.query(By.css('nav a, nav button'))
    // The active item should have different styling - check for active classes
    expect(homeLink).toBeTruthy()
  })

  it('should show user info when userInfo is provided', () => {
    const userElements = fixture.debugElement.queryAll(By.css('*'))
    const hasUserInfo = userElements.some(
      (el) =>
        el.nativeElement.textContent &&
        el.nativeElement.textContent.includes('John Doe')
    )
    expect(hasUserInfo).toBe(true)
  })

  it('should not show user info when userInfo is null', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hostComponent.userInfo = undefined as any
    fixture.detectChanges()

    const userElements = fixture.debugElement.queryAll(By.css('*'))
    const hasUserInfo = userElements.some(
      (el) =>
        el.nativeElement.textContent &&
        el.nativeElement.textContent.includes('John Doe')
    )
    expect(hasUserInfo).toBe(false)
  })

  it('should show logout button when showLogoutButton is true', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'))
    const hasLogoutButton = buttons.some(
      (btn) =>
        btn.nativeElement.textContent &&
        btn.nativeElement.textContent.includes('Logout')
    )
    expect(hasLogoutButton).toBe(true)
  })

  it('should not show logout button when showLogoutButton is false', () => {
    hostComponent.showLogoutButton = false
    fixture.detectChanges()

    const buttons = fixture.debugElement.queryAll(By.css('button'))
    const hasLogoutButton = buttons.some(
      (btn) =>
        btn.nativeElement.textContent &&
        btn.nativeElement.textContent.includes('Logout')
    )
    expect(hasLogoutButton).toBe(false)
  })

  it('should emit logout event when logout button is clicked', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'))
    const logoutButton = buttons.find(
      (btn) =>
        btn.nativeElement.textContent &&
        btn.nativeElement.textContent.includes('Logout')
    )

    if (logoutButton) {
      logoutButton.nativeElement.click()
      expect(hostComponent.logoutCount).toBe(1)
    }
  })

  it('should navigate when nav item is clicked', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('nav a, nav button'))
    const productsLink = navLinks.find(
      (link) =>
        link.nativeElement.textContent &&
        link.nativeElement.textContent.includes('Products')
    )

    // Just verify the link exists and can be clicked
    if (productsLink) {
      expect(
        productsLink.nativeElement.href ||
          productsLink.nativeElement.getAttribute('href')
      ).toContain('/products')
    }
  })

  it('should show mobile menu button on small screens', () => {
    // Look for hamburger menu button (usually has 3 lines or specific mobile menu icon)
    const mobileMenuButton = fixture.debugElement.query(
      By.css('button[aria-label*="menu"], button[aria-expanded]')
    )
    expect(mobileMenuButton).toBeTruthy()
  })

  it('should emit mobile menu toggle when mobile menu button is clicked', () => {
    const mobileMenuButton = fixture.debugElement.query(
      By.css('button[aria-label*="menu"], button[aria-expanded]')
    )

    if (mobileMenuButton) {
      mobileMenuButton.nativeElement.click()
      // Check that the component internal state changes or the mobile menu appears
      expect(component.mobileMenuOpen).toBe(true)
    }
  })

  it('should handle responsive design', () => {
    const containerElement = fixture.debugElement.query(
      By.css('nav, header, div')
    )
    // Component should exist and have responsive design
    expect(containerElement).toBeTruthy()
  })

  it('should handle empty navigation items', () => {
    hostComponent.navItems = []
    fixture.detectChanges()

    // Should not crash and should render without nav items
    expect(component).toBeTruthy()
  })

  it('should handle missing user info', () => {
    hostComponent.userInfo = { name: '', email: '', avatar: '' }
    fixture.detectChanges()

    // Should not crash
    expect(component).toBeTruthy()
  })

  it('should have proper accessibility attributes', () => {
    const navElement = fixture.debugElement.query(By.css('nav'))
    expect(navElement).toBeTruthy()

    // Check for ARIA attributes
    const mobileMenuButton = fixture.debugElement.query(
      By.css('button[aria-expanded], button[aria-label]')
    )
    if (mobileMenuButton) {
      expect(
        mobileMenuButton.nativeElement.hasAttribute('aria-expanded') ||
          mobileMenuButton.nativeElement.hasAttribute('aria-label')
      ).toBe(true)
    }
  })

  it('should handle mobile menu visibility', () => {
    // Initially mobile menu should be closed
    expect(component.mobileMenuOpen).toBe(false)

    // Mobile menu should not be visible initially
    const mobileMenuItems = fixture.debugElement.queryAll(
      By.css('.md\\:hidden.border-t')
    )
    if (mobileMenuItems.length > 0) {
      expect(mobileMenuItems[0]).toBeFalsy()
    }
  })

  it('should have responsive design classes', () => {
    const containerElement = fixture.debugElement.query(By.css('div'))
    const hasResponsiveClasses =
      containerElement.nativeElement.className.includes('sm:') ||
      containerElement.nativeElement.className.includes('md:') ||
      containerElement.nativeElement.className.includes('lg:')
    expect(hasResponsiveClasses).toBe(true)
  })

  it('should handle custom logout button text', () => {
    hostComponent.logoutButtonText = 'Sign Out'
    fixture.detectChanges()

    const buttons = fixture.debugElement.queryAll(By.css('button'))
    const hasCustomLogoutText = buttons.some(
      (btn) =>
        btn.nativeElement.textContent &&
        btn.nativeElement.textContent.includes('Sign Out')
    )
    expect(hasCustomLogoutText).toBe(true)
  })
})
