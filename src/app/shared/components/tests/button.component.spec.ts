import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ButtonComponent, ButtonVariant, ButtonSize } from '../button.component';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <app-button
      [variant]="variant"
      [size]="size"
      [disabled]="disabled"
      [loading]="loading"
      [type]="type"
      [customClasses]="customClasses"
      [iconLeft]="iconLeft"
      [iconRight]="iconRight"
      [fullWidth]="fullWidth"
      (buttonClick)="onButtonClick()"
    >
      {{ buttonText }}
    </app-button>
  `
})
class TestHostComponent {
  variant: ButtonVariant = 'primary';
  size: ButtonSize = 'md';
  disabled = false;
  loading = false;
  type = 'button';
  customClasses = '';
  iconLeft = '';
  iconRight = '';
  fullWidth = false;
  buttonText = 'Test Button';
  clickCount = 0;

  onButtonClick() {
    this.clickCount++;
  }
}

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(ButtonComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render button text', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.textContent.trim()).toBe('Test Button');
  });

  it('should apply primary variant classes by default', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.className).toContain('from-indigo-600');
    expect(buttonElement.nativeElement.className).toContain('text-white');
  });

  it('should apply secondary variant classes', () => {
    hostComponent.variant = 'secondary';
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.className).toContain('bg-gray-100');
    expect(buttonElement.nativeElement.className).toContain('text-gray-700');
  });

  it('should apply danger variant classes', () => {
    hostComponent.variant = 'danger';
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.className).toContain('to-red-600');
    expect(buttonElement.nativeElement.className).toContain('text-white');
  });

  it('should apply different size classes', () => {
    // Test small size
    hostComponent.size = 'sm';
    fixture.detectChanges();
    let buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.className).toContain('px-3');
    expect(buttonElement.nativeElement.className).toContain('py-2');

    // Test large size
    hostComponent.size = 'lg';
    fixture.detectChanges();
    buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.className).toContain('px-6');
    expect(buttonElement.nativeElement.className).toContain('py-3');
  });

  it('should be disabled when disabled prop is true', () => {
    hostComponent.disabled = true;
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.disabled).toBe(true);
    expect(buttonElement.nativeElement.className).toContain('opacity-50');
  });

  it('should show loading state', () => {
    hostComponent.loading = true;
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    const loadingSpinner = fixture.debugElement.query(By.css('svg'));

    expect(buttonElement.nativeElement.disabled).toBe(true);
    expect(loadingSpinner).toBeTruthy();
    expect(buttonElement.nativeElement.className).toContain('opacity-50');
  });

  it('should show icon when provided', () => {
    hostComponent.iconLeft = '🚀';
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.textContent).toContain('🚀');
  });

  it('should emit click event when clicked', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'));

    buttonElement.nativeElement.click();
    fixture.detectChanges();

    expect(hostComponent.clickCount).toBe(1);
  });

  it('should not emit click event when disabled', () => {
    hostComponent.disabled = true;
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    expect(hostComponent.clickCount).toBe(0);
  });

  it('should not emit click event when loading', () => {
    hostComponent.loading = true;
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.nativeElement.click();
    fixture.detectChanges();

    expect(hostComponent.clickCount).toBe(0);
  });

  it('should apply custom classes', () => {
    hostComponent.customClasses = 'custom-test-class';
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.className).toContain('custom-test-class');
  });

  it('should set correct button type', () => {
    hostComponent.type = 'submit';
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button'));
    expect(buttonElement.nativeElement.type).toBe('submit');
  });
});
