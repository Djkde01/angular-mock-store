import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LoadingSpinnerComponent, SpinnerSize, SpinnerVariant } from '../loading-spinner.component';

@Component({
  standalone: true,
  imports: [LoadingSpinnerComponent],
  template: `
    <app-loading-spinner
      [size]="size"
      [variant]="variant"
      [text]="text"
      [centered]="centered"
      [customClasses]="customClasses"
    ></app-loading-spinner>
  `
})
class TestHostComponent {
  size: SpinnerSize = 'md';
  variant: SpinnerVariant = 'primary';
  text = '';
  centered = false;
  customClasses = '';
}

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(LoadingSpinnerComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render SVG spinner', () => {
    const svgElement = fixture.debugElement.query(By.css('.border-2'));
    expect(svgElement).toBeTruthy();
    expect(svgElement.nativeElement.classList).toContain('animate-spin');
  });

  it('should apply default size classes', () => {
    const svgElement = fixture.debugElement.query(By.css('.border-2'));
    expect(svgElement.nativeElement.classList).toContain('h-6');
    expect(svgElement.nativeElement.classList).toContain('w-6');
  });

  it('should apply different size classes', () => {
    // Test small size
    hostComponent.size = 'sm';
    fixture.detectChanges();
    let svgElement = fixture.debugElement.query(By.css('.border-2'));
    expect(svgElement.nativeElement.classList).toContain('h-4');
    expect(svgElement.nativeElement.classList).toContain('w-4');

    // Test large size
    hostComponent.size = 'lg';
    fixture.detectChanges();
    svgElement = fixture.debugElement.query(By.css('.border-2'));
    expect(svgElement.nativeElement.classList).toContain('h-8');
    expect(svgElement.nativeElement.classList).toContain('w-8');

    // Test extra large size
    hostComponent.size = 'xl';
    fixture.detectChanges();
    svgElement = fixture.debugElement.query(By.css('.border-2'));
    expect(svgElement.nativeElement.classList).toContain('h-12');
    expect(svgElement.nativeElement.classList).toContain('w-12');
  });

  it('should apply primary variant color by default', () => {
    const svgElement = fixture.debugElement.query(By.css('.border-2'));
    expect(svgElement.nativeElement.classList).toContain('border-indigo-600');
  });

  it('should apply different variant colors', () => {
    // Test secondary variant
    hostComponent.variant = 'secondary';
    fixture.detectChanges();
    let svgElement = fixture.debugElement.query(By.css('.border-2'));
    expect(svgElement.nativeElement.classList).toContain('border-gray-600');

    // Test success variant
    hostComponent.variant = 'primary';
    fixture.detectChanges();
    svgElement = fixture.debugElement.query(By.css('.border-2'));
    expect(svgElement.nativeElement.classList).toContain('border-indigo-600');

    // Test white variant
    hostComponent.variant = 'white';
    fixture.detectChanges();
    svgElement = fixture.debugElement.query(By.css('.border-2'));
    expect(svgElement.nativeElement.classList).toContain('border-white');
  });

  it('should show text when provided', () => {
    hostComponent.text = 'Loading...';
    fixture.detectChanges();

    const textElement = fixture.debugElement.query(By.css('p'));
    expect(textElement).toBeTruthy();
    expect(textElement.nativeElement.textContent.trim()).toBe('Loading...');
  });

  it('should not show text when not provided', () => {
    hostComponent.text = '';
    fixture.detectChanges();

    const textElement = fixture.debugElement.query(By.css('p'));
    expect(textElement).toBeFalsy();
  });

  it('should apply centered styles when centered is true', () => {
    hostComponent.centered = true;
    fixture.detectChanges();

    const containerElement = fixture.debugElement.query(By.css('div'));
    expect(containerElement.nativeElement.classList).toContain('justify-center');
  });

  it('should not apply centered styles when centered is false', () => {
    hostComponent.centered = false;
    fixture.detectChanges();

    const containerElement = fixture.debugElement.query(By.css('div'));
    expect(containerElement.nativeElement.classList).not.toContain('justify-center');
  });

  it('should apply custom classes when provided', () => {
    hostComponent.customClasses = 'custom-spinner-class';
    fixture.detectChanges();

    const containerElement = fixture.debugElement.query(By.css('div'));
    expect(containerElement.nativeElement.classList).toContain('custom-spinner-class');
  });

  it('should have proper accessibility attributes', () => {
    const containerElement = fixture.debugElement.query(By.css('div'));
    expect(containerElement.nativeElement.getAttribute('role')).toBe('status');
    expect(containerElement.nativeElement.getAttribute('aria-label')).toBe('Loading');
  });

  it('should handle combination of text and centered', () => {
    hostComponent.text = 'Please wait...';
    hostComponent.centered = true;
    fixture.detectChanges();

    const containerElement = fixture.debugElement.query(By.css('div'));
    const textElement = fixture.debugElement.query(By.css('p'));

    expect(containerElement.nativeElement.classList).toContain('justify-center');
    expect(textElement.nativeElement.textContent.trim()).toBe('Please wait...');
  });

  it('should maintain flex layout', () => {
    const containerElement = fixture.debugElement.query(By.css('div'));
    expect(containerElement.nativeElement.classList).toContain('flex');
    expect(containerElement.nativeElement.classList).toContain('items-center');
  });

  it('should have consistent spacing between spinner and text', () => {
    hostComponent.text = 'Loading...';
    fixture.detectChanges();

    const containerElement = fixture.debugElement.query(By.css('div'));
    expect(containerElement.nativeElement.classList).toContain('space-y-2');
  });
});
