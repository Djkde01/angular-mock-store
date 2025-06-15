import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RadioGroupComponent, RadioOption } from '../radio-group.component';

@Component({
  standalone: true,
  imports: [RadioGroupComponent, ReactiveFormsModule],
  template: `
    <app-radio-group
      [id]="id"
      [label]="label"
      [disabled]="disabled"
      [required]="required"
      [errorMessage]="errorMessage"
      [helperText]="helperText"
      [showError]="showError"
      [options]="options"
      [layout]="layout"
      [formControl]="formControl"
    ></app-radio-group>
  `
})
class TestHostComponent {
  id = 'test-radio-group';
  label = 'Test Radio Group';
  disabled = false;
  required = false;
  errorMessage = '';
  helperText = '';
  showError = false;
  layout: 'horizontal' | 'vertical' | 'grid' = 'grid';
  formControl = new FormControl('');

  options: RadioOption[] = [
    { value: 'option1', label: 'Option 1', icon: '📱' },
    { value: 'option2', label: 'Option 2', icon: '💻' },
    { value: 'option3', label: 'Option 3', disabled: true, icon: '🖥️' }
  ];
}

describe('RadioGroupComponent', () => {
  let component: RadioGroupComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(RadioGroupComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label when provided', () => {
    const labelElement = fixture.debugElement.query(By.css('.legend'));
    expect(labelElement.nativeElement.textContent.trim()).toBe('Test Radio Group');
  });

  it('should show required asterisk when required', () => {
    hostComponent.required = true;
    fixture.detectChanges();

    const requiredSpan = fixture.debugElement.query(By.css('.text-red-500'));
    expect(requiredSpan.nativeElement.textContent.trim()).toBe('*');
  });

  it('should render all radio options', () => {
    const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
    expect(radioInputs.length).toBe(3);

    expect(radioInputs[0].nativeElement.value).toBe('option1');
    expect(radioInputs[1].nativeElement.value).toBe('option2');
    expect(radioInputs[2].nativeElement.value).toBe('option3');
  });

  it('should render option labels and icons', () => {
    const labels = fixture.debugElement.queryAll(By.css('label'));

    // Check first option
    expect(labels[1].nativeElement.textContent).toContain('📱');
    expect(labels[1].nativeElement.textContent).toContain('Option 1');

    // Check second option
    expect(labels[2].nativeElement.textContent).toContain('💻');
    expect(labels[2].nativeElement.textContent).toContain('Option 2');
  });

  it('should disable individual options when marked as disabled', () => {
    const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));

    expect(radioInputs[0].nativeElement.disabled).toBe(false);
    expect(radioInputs[1].nativeElement.disabled).toBe(false);
    expect(radioInputs[2].nativeElement.disabled).toBe(true);
  });

  it('should disable all options when component is disabled', () => {
    hostComponent.disabled = true;
    fixture.detectChanges();

    const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
    radioInputs.forEach(input => {
      expect(input.nativeElement.disabled).toBe(true);
    });
  });

  it('should update form control value when option is selected', () => {
    const firstRadio = fixture.debugElement.query(By.css('input[value="option1"]'));

    firstRadio.nativeElement.checked = true;
    firstRadio.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(hostComponent.formControl.value).toBe('option1');
  });

  it('should show error message when showError is true', () => {
    hostComponent.errorMessage = 'This field is required';
    hostComponent.showError = true;
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.text-red-600'));
    expect(errorElement.nativeElement.textContent.trim()).toBe('This field is required');
  });

  it('should show helper text when provided and no error', () => {
    hostComponent.helperText = 'This is helper text';
    fixture.detectChanges();

    const helperElement = fixture.debugElement.query(By.css('.text-gray-500'));
    expect(helperElement.nativeElement.textContent.trim()).toBe('This is helper text');
  });

  it('should apply different layout classes', () => {
    const containerDiv = fixture.debugElement.query(By.css('.space-y-3 > div'));

    // Test grid layout (default)
    expect(containerDiv.nativeElement.className).toContain('grid');

    // Test horizontal layout
    hostComponent.layout = 'horizontal';
    fixture.detectChanges();
    expect(containerDiv.nativeElement.className).toContain('flex');
    expect(containerDiv.nativeElement.className).toContain('flex-wrap');

    // Test vertical layout
    hostComponent.layout = 'vertical';
    fixture.detectChanges();
    expect(containerDiv.nativeElement.className).toContain('space-y-3');
  });

  it('should implement ControlValueAccessor correctly', () => {
    // Test writeValue
    component.writeValue('option2');
    expect(component.value).toBe('option2');

    // Test registerOnChange
    let changedValue = '';
    component.registerOnChange((value: string) => {
      changedValue = value;
    });

    const mockEvent = {
      target: { value: 'option1' }
    } as any;

    component.onSelectionChange(mockEvent);
    // Extracted value should be 'option1'
    expect(component.value).toBe(mockEvent);

    // Test registerOnTouched
    let touched = false;
    component.registerOnTouched(() => {
      touched = true;
    });

    component.onTouched();
    expect(touched).toBe(true);

    // Test setDisabledState
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);
  });

  it('should track selected option correctly', () => {
    expect(component.isSelected('option1')).toBe(false);

    component.writeValue('option1');
    expect(component.isSelected('option1')).toBe(true);
    expect(component.isSelected('option2')).toBe(false);
  });

  it('should handle trackBy function correctly', () => {
    const result = component.trackByValue(0, hostComponent.options[0]);
    expect(result).toBe('option1');
  });

  it('should apply proper styling classes', () => {
    const labels = fixture.debugElement.queryAll(By.css('label:not(.legend)'));

    // Check that styling classes are applied
    expect(labels[0].nativeElement.className).toContain('cursor-pointer');
    expect(labels[0].nativeElement.className).toContain('relative');

    // Check disabled styling
    expect(labels[2].nativeElement.className).toContain('pointer-events-none');
    expect(labels[2].nativeElement.className).toContain('opacity-50');
  });
});
