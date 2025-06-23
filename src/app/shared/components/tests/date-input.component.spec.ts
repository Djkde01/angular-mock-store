import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DateInputComponent } from '../date-input.component';

@Component({
  standalone: true,
  imports: [DateInputComponent, ReactiveFormsModule],
  template: `
    <app-date-input
      [id]="id"
      [label]="label"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [required]="required"
      [errorMessage]="errorMessage"
      [helperText]="helperText"
      [showError]="showError"
      [formControl]="formControl"
    ></app-date-input>
  `,
})
class TestHostComponent {
  id = 'test-date-input';
  label = 'Test Date';
  placeholder = 'Select a date';
  disabled = false;
  required = false;
  errorMessage = '';
  helperText = '';
  showError = false;
  formControl = new FormControl('');
}

describe('DateInputComponent', () => {
  let component: DateInputComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(
      By.directive(DateInputComponent)
    ).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label when provided', () => {
    const labelElement = fixture.debugElement.query(By.css('label'));
    expect(labelElement.nativeElement.textContent.trim()).toBe('Test Date');
  });

  it('should not render label when not provided', () => {
    hostComponent.label = '';
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('label'));
    expect(labelElement).toBeFalsy();
  });

  it('should show required asterisk when required', () => {
    hostComponent.required = true;
    fixture.detectChanges();

    const requiredSpan = fixture.debugElement.query(By.css('.text-red-500'));
    expect(requiredSpan.nativeElement.textContent.trim()).toBe('*');
  });

  it('should set input attributes correctly', () => {
    const inputElement = fixture.debugElement.query(By.css('input'));

    expect(inputElement.nativeElement.id).toBe('test-date-input');
    expect(inputElement.nativeElement.type).toBe('date');
    expect(inputElement.nativeElement.placeholder).toBe('Select a date');
  });

  it('should be disabled when disabled prop is true', () => {
    hostComponent.disabled = true;
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.nativeElement.disabled).toBe(true);
  });

  it('should update form control value when date changes', () => {
    const inputElement = fixture.debugElement.query(By.css('input'));

    inputElement.nativeElement.value = '2023-06-15';
    inputElement.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(hostComponent.formControl.value).toBe('2023-06-15');
  });

  it('should show error message when showError is true', () => {
    hostComponent.errorMessage = 'This field is required';
    hostComponent.showError = true;
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.text-red-600'));
    expect(errorElement.nativeElement.textContent.trim()).toBe(
      'This field is required'
    );
  });

  it('should not show error message when showError is false', () => {
    hostComponent.errorMessage = 'This field is required';
    hostComponent.showError = false;
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.text-red-600'));
    expect(errorElement).toBeFalsy();
  });

  it('should show helper text when provided and no error', () => {
    hostComponent.helperText = 'This is helper text';
    fixture.detectChanges();

    const helperElement = fixture.debugElement.query(By.css('.text-gray-500'));
    expect(helperElement.nativeElement.textContent.trim()).toBe(
      'This is helper text'
    );
  });

  it('should apply error styles when showError is true', () => {
    hostComponent.showError = true;
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.nativeElement.className).toContain('border-red-300');
    expect(inputElement.nativeElement.className).toContain(
      'focus:ring-red-500'
    );
  });

  it('should handle validation with form control', () => {
    hostComponent.formControl = new FormControl('', [Validators.required]);
    fixture.detectChanges();

    // Mark as touched to trigger validation
    hostComponent.formControl.markAsTouched();
    fixture.detectChanges();

    expect(hostComponent.formControl.invalid).toBe(true);
    expect(hostComponent.formControl.errors?.['required']).toBeTruthy();
  });

  it('should have correct CSS classes based on state', () => {
    const inputElement = fixture.debugElement.query(By.css('input'));

    // Default state
    expect(inputElement.nativeElement.className).toContain('border-gray-300');

    // Error state
    hostComponent.showError = true;
    fixture.detectChanges();
    expect(inputElement.nativeElement.className).toContain('border-red-300');

    // Disabled state
    hostComponent.disabled = true;
    fixture.detectChanges();
    expect(inputElement.nativeElement.className).toContain('bg-gray-50');
    expect(inputElement.nativeElement.className).toContain(
      'cursor-not-allowed'
    );
  });

  it('should format date value correctly', () => {
    const inputElement = fixture.debugElement.query(By.css('input'));

    // Set a date value
    component.writeValue('2023-06-15');
    fixture.detectChanges();

    expect(inputElement.nativeElement.value).toBe('2023-06-15');
  });

  it('should handle empty/null values correctly', () => {
    // Test null value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component.writeValue(null as any);
    expect(component.value).toBe('');

    // Test empty string
    component.writeValue('');
    expect(component.value).toBe('');

    // Test undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component.writeValue(undefined as any);
    expect(component.value).toBe('');
  });
});
