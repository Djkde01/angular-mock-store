import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  SelectComponent,
  SelectOption,
  SelectOptionGroup,
} from '../select.component';

@Component({
  standalone: true,
  imports: [SelectComponent, ReactiveFormsModule],
  template: `
    <app-select
      [id]="id"
      [label]="label"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [required]="required"
      [errorMessage]="errorMessage"
      [helperText]="helperText"
      [showError]="showError"
      [options]="options"
      [optionGroups]="optionGroups"
      [formControl]="formControl"
    ></app-select>
  `,
})
class TestHostComponent {
  id = 'test-select';
  label = 'Test Label';
  placeholder = 'Select an option';
  disabled = false;
  required = false;
  errorMessage = '';
  helperText = '';
  showError = false;
  formControl = new FormControl('');

  options: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ];

  optionGroups: SelectOptionGroup[] = [
    {
      label: 'Group 1',
      options: [
        { value: 'group1-option1', label: 'Group 1 Option 1' },
        { value: 'group1-option2', label: 'Group 1 Option 2' },
      ],
    },
    {
      label: 'Group 2',
      options: [{ value: 'group2-option1', label: 'Group 2 Option 1' }],
    },
  ];
}

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(
      By.directive(SelectComponent)
    ).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label when provided', () => {
    const labelElement = fixture.debugElement.query(By.css('label'));
    expect(labelElement.nativeElement.textContent.trim()).toBe('Test Label');
  });

  it('should show required asterisk when required', () => {
    hostComponent.required = true;
    fixture.detectChanges();

    const requiredSpan = fixture.debugElement.query(By.css('.text-red-500'));
    expect(requiredSpan.nativeElement.textContent.trim()).toBe('*');
  });

  it('should render placeholder option when provided', () => {
    const selectElement = fixture.debugElement.query(By.css('select'));
    const placeholderOption = selectElement.query(By.css('option[value=""]'));

    expect(placeholderOption).toBeTruthy();
    expect(placeholderOption.nativeElement.textContent.trim()).toBe(
      'Select an option'
    );
    expect(placeholderOption.nativeElement.disabled).toBe(true);
  });

  it('should render simple options correctly', () => {
    // Clear option groups to test simple options
    hostComponent.optionGroups = [];
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(
      By.css('option:not([value=""])')
    );
    expect(options.length).toBe(3);

    expect(options[0].nativeElement.value).toBe('option1');
    expect(options[0].nativeElement.textContent.trim()).toBe('Option 1');

    expect(options[2].nativeElement.disabled).toBe(true);
  });

  it('should render option groups correctly', () => {
    // Clear simple options to test option groups
    hostComponent.options = [];
    fixture.detectChanges();

    const optgroups = fixture.debugElement.queryAll(By.css('optgroup'));
    expect(optgroups.length).toBe(2);

    expect(optgroups[0].nativeElement.label).toBe('Group 1');
    expect(optgroups[1].nativeElement.label).toBe('Group 2');

    const group1Options = optgroups[0].queryAll(By.css('option'));
    expect(group1Options.length).toBe(2);
    expect(group1Options[0].nativeElement.value).toBe('group1-option1');
  });

  it('should be disabled when disabled prop is true', () => {
    hostComponent.disabled = true;
    fixture.detectChanges();

    const selectElement = fixture.debugElement.query(By.css('select'));
    expect(selectElement.nativeElement.disabled).toBe(true);
  });

  it('should update form control value when selection changes', () => {
    // Clear option groups to test simple options
    hostComponent.optionGroups = [];
    fixture.detectChanges();

    const selectElement = fixture.debugElement.query(By.css('select'));

    selectElement.nativeElement.value = 'option1';
    selectElement.nativeElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(hostComponent.formControl.value).toBe('option1');
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

    const selectElement = fixture.debugElement.query(By.css('select'));
    expect(selectElement.nativeElement.className).toContain('border-red-300');
    expect(selectElement.nativeElement.className).toContain(
      'focus:ring-red-500'
    );
  });

  it('should implement ControlValueAccessor correctly', () => {
    // Test writeValue
    component.writeValue('test-value');
    expect(component.value).toBe('test-value');

    // Test registerOnChange
    let changedValue: string | number | null = '';
    component.registerOnChange((value: string | number | null) => {
      changedValue = value;
    });

    const mockEvent = {
      target: { value: 'new-value' },
    } as unknown as Event;

    component.onSelectionChange(mockEvent);
    expect(changedValue).toBe('new-value');

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

  it('should have correct CSS classes based on state', () => {
    const selectElement = fixture.debugElement.query(By.css('select'));

    // Default state
    expect(selectElement.nativeElement.className).toContain('border-gray-300');

    // Error state
    hostComponent.showError = true;
    fixture.detectChanges();
    expect(selectElement.nativeElement.className).toContain('border-red-300');

    // Disabled state
    hostComponent.disabled = true;
    fixture.detectChanges();
    expect(selectElement.nativeElement.className).toContain('bg-gray-50');
    expect(selectElement.nativeElement.className).toContain(
      'cursor-not-allowed'
    );
  });
});
