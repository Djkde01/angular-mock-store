import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule, FormControl } from '@angular/forms'
import { Component } from '@angular/core'
import { By } from '@angular/platform-browser'
import {
  CheckboxGroupComponent,
  CheckboxOption,
} from '../checkbox-group.component'

@Component({
  standalone: true,
  imports: [CheckboxGroupComponent, ReactiveFormsModule],
  template: `
    <app-checkbox-group
      [id]="id"
      [label]="label"
      [disabled]="disabled"
      [required]="required"
      [errorMessage]="errorMessage"
      [helperText]="helperText"
      [showError]="showError"
      [options]="options"
      [layout]="layout"
      [minSelections]="minSelections"
      [maxSelections]="maxSelections"
      [formControl]="formControl"
    ></app-checkbox-group>
  `,
})
class TestHostComponent {
  id = 'test-checkbox-group'
  label = 'Test Checkbox Group'
  disabled = false
  required = false
  errorMessage = ''
  helperText = ''
  showError = false
  layout: 'vertical' | 'horizontal' = 'vertical'
  minSelections = 0
  maxSelections: number | null = null
  formControl = new FormControl<string[]>([])
  options: CheckboxOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2', icon: 'star' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ]
}

describe('CheckboxGroupComponent', () => {
  let component: CheckboxGroupComponent
  let hostComponent: TestHostComponent
  let fixture: ComponentFixture<TestHostComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TestHostComponent)
    hostComponent = fixture.componentInstance
    component = fixture.debugElement.query(
      By.directive(CheckboxGroupComponent)
    ).componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display label when provided', () => {
    hostComponent.label = 'Test Checkbox Group'
    fixture.detectChanges()
    const labelElement = fixture.debugElement.query(By.css('.legend'))
    expect(labelElement.nativeElement.textContent.trim()).toBe(
      'Test Checkbox Group'
    )
  })

  it('should render all options', () => {
    const checkboxes = fixture.debugElement.queryAll(
      By.css('input[type="checkbox"]')
    )
    expect(checkboxes.length).toBe(3)
  })

  it('should show required indicator when required is true', () => {
    hostComponent.required = true
    fixture.detectChanges()

    const requiredIndicator = fixture.debugElement.query(
      By.css('.text-red-500')
    )
    expect(requiredIndicator.nativeElement.textContent.trim()).toBe('*')
  })

  it('should disable all checkboxes when disabled is true', () => {
    hostComponent.disabled = true
    fixture.detectChanges()

    const checkboxes = fixture.debugElement.queryAll(
      By.css('input[type="checkbox"]')
    )
    checkboxes.forEach((checkbox) => {
      expect(checkbox.nativeElement.disabled).toBe(true)
    })
  })

  it('should disable individual option when option.disabled is true', () => {
    const disabledCheckbox = fixture.debugElement.queryAll(
      By.css('input[type="checkbox"]')
    )[2]
    expect(disabledCheckbox.nativeElement.disabled).toBe(true)
  })

  it('should display error message when showError is true', () => {
    hostComponent.showError = true
    hostComponent.errorMessage = 'Please select at least one option'
    fixture.detectChanges()

    const errorElement = fixture.debugElement.query(By.css('.text-red-600'))
    expect(errorElement.nativeElement.textContent.trim()).toBe(
      'Please select at least one option'
    )
  })

  it('should display helper text when provided', () => {
    hostComponent.helperText = 'Select your preferences'
    fixture.detectChanges()

    const helperElement = fixture.debugElement.query(By.css('.text-gray-500'))
    expect(helperElement.nativeElement.textContent.trim()).toBe(
      'Select your preferences'
    )
  })

  it('should update form control when checkbox is clicked', () => {
    const firstCheckbox = fixture.debugElement.queryAll(
      By.css('input[type="checkbox"]')
    )[0]

    firstCheckbox.nativeElement.checked = true
    firstCheckbox.triggerEventHandler('change', { target: { checked: true } })
    fixture.detectChanges()

    expect(hostComponent.formControl.value).toContain('option1')
  })

  it('should apply horizontal layout class when layout is horizontal', () => {
    hostComponent.layout = 'horizontal'
    fixture.detectChanges()

    const container = fixture.debugElement.query(By.css('.gap-3'))
    expect(container).toBeTruthy()
  })

  it('should apply vertical layout class when layout is vertical', () => {
    hostComponent.layout = 'vertical'
    fixture.detectChanges()

    const container = fixture.debugElement.query(By.css('.space-y-3'))
    expect(container).toBeTruthy()
  })

  it('should display icons when provided in options', () => {
    const iconElement = fixture.debugElement.query(By.css('.text-2xl'))
    expect(iconElement).toBeTruthy()
  })
})
