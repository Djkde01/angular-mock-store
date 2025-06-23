import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms'
import { Component } from '@angular/core'
import { By } from '@angular/platform-browser'
import { InputComponent, InputType } from '../input.component'

@Component({
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule],
  template: `
    <app-input
      [id]="id"
      [label]="label"
      [type]="type"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [required]="required"
      [errorMessage]="errorMessage"
      [helperText]="helperText"
      [showError]="showError"
      [formControl]="formControl"
    ></app-input>
  `,
})
class TestHostComponent {
  id = 'test-input'
  label = 'Test Label'
  type: InputType = 'text'
  placeholder = 'Test placeholder'
  disabled = false
  required = false
  errorMessage = ''
  helperText = ''
  showError = false
  formControl = new FormControl('')
}

describe('InputComponent', () => {
  let component: InputComponent
  let fixture: ComponentFixture<TestHostComponent>
  let hostComponent: TestHostComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TestHostComponent)
    hostComponent = fixture.componentInstance
    component = fixture.debugElement.query(
      By.directive(InputComponent)
    ).componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render label when provided', () => {
    const labelElement = fixture.debugElement.query(By.css('label'))
    expect(labelElement.nativeElement.textContent.trim()).toBe('Test Label')
  })

  it('should not render label when not provided', () => {
    hostComponent.label = ''
    fixture.detectChanges()

    const labelElement = fixture.debugElement.query(By.css('label'))
    expect(labelElement).toBeFalsy()
  })

  it('should show required asterisk when required', () => {
    hostComponent.required = true
    fixture.detectChanges()

    const requiredSpan = fixture.debugElement.query(By.css('.text-red-500'))
    expect(requiredSpan.nativeElement.textContent.trim()).toBe('*')
  })

  it('should set input attributes correctly', () => {
    const inputElement = fixture.debugElement.query(By.css('input'))

    expect(inputElement.nativeElement.id).toBe('test-input')
    expect(inputElement.nativeElement.type).toBe('text')
    expect(inputElement.nativeElement.placeholder).toBe('Test placeholder')
  })

  it('should be disabled when disabled prop is true', () => {
    hostComponent.disabled = true
    fixture.detectChanges()

    const inputElement = fixture.debugElement.query(By.css('input'))
    expect(inputElement.nativeElement.disabled).toBe(true)
  })

  it('should update form control value when input changes', () => {
    const inputElement = fixture.debugElement.query(By.css('input'))

    inputElement.nativeElement.value = 'test value'
    inputElement.nativeElement.dispatchEvent(new Event('input'))
    fixture.detectChanges()

    expect(hostComponent.formControl.value).toBe('test value')
  })

  it('should show error message when showError is true', () => {
    hostComponent.errorMessage = 'This field is required'
    hostComponent.showError = true
    fixture.detectChanges()

    const errorElement = fixture.debugElement.query(By.css('.text-red-600'))
    expect(errorElement.nativeElement.textContent.trim()).toBe(
      'This field is required'
    )
  })

  it('should not show error message when showError is false', () => {
    hostComponent.errorMessage = 'This field is required'
    hostComponent.showError = false
    fixture.detectChanges()

    const errorElement = fixture.debugElement.query(By.css('.text-red-600'))
    expect(errorElement).toBeFalsy()
  })

  it('should show helper text when provided and no error', () => {
    hostComponent.helperText = 'This is helper text'
    fixture.detectChanges()

    const helperElement = fixture.debugElement.query(By.css('.text-gray-500'))
    expect(helperElement.nativeElement.textContent.trim()).toBe(
      'This is helper text'
    )
  })

  it('should apply error styles when showError is true', () => {
    hostComponent.showError = true
    fixture.detectChanges()

    const inputElement = fixture.debugElement.query(By.css('input'))
    expect(inputElement.nativeElement.className).toContain('border-gray-300')
    expect(inputElement.nativeElement.className).toContain(
      'focus:ring-indigo-500'
    )
  })

  it('should work with different input types', () => {
    // Test email type
    hostComponent.type = 'email'
    fixture.detectChanges()
    let inputElement = fixture.debugElement.query(By.css('input'))
    expect(inputElement.nativeElement.type).toBe('email')

    // Test password type
    hostComponent.type = 'password'
    fixture.detectChanges()
    inputElement = fixture.debugElement.query(By.css('input'))
    expect(inputElement.nativeElement.type).toBe('password')
  })

  it('should implement ControlValueAccessor correctly', () => {
    // Test writeValue
    component.writeValue('test value')
    expect(component.value).toBe('test value')

    // Test registerOnChange
    let changedValue = ''
    component.registerOnChange((value: string) => {
      changedValue = value
    })

    component.onInput({ target: { value: 'new value' } } as unknown as Event)
    expect(changedValue).toBe('new value')

    // Test registerOnTouched
    let touched = false
    component.registerOnTouched(() => {
      touched = true
    })

    component.onBlur()
    expect(touched).toBe(true)

    // Test setDisabledState
    component.setDisabledState(true)
    expect(component.disabled).toBe(true)
  })

  it('should handle validation with form control', () => {
    hostComponent.formControl = new FormControl('', [Validators.required])
    fixture.detectChanges()

    // Mark as touched to trigger validation
    hostComponent.formControl.markAsTouched()
    fixture.detectChanges()

    expect(hostComponent.formControl.invalid).toBe(true)
    expect(hostComponent.formControl.errors?.['required']).toBeTruthy()
  })
})
