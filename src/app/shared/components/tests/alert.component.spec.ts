import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Component } from '@angular/core'
import { By } from '@angular/platform-browser'
import { AlertComponent, AlertType } from '../alert.component'

@Component({
  standalone: true,
  imports: [AlertComponent],
  template: `
    <app-alert
      [type]="type"
      [message]="message"
      [dismissible]="dismissible"
      [customClasses]="customClasses"
      (dismiss)="onDismiss()"
    ></app-alert>
  `,
})
class TestHostComponent {
  type: AlertType = 'info'
  message = 'Test alert message'
  dismissible = false
  customClasses = ''
  dismissCount = 0
  title = ''

  onDismiss() {
    this.dismissCount++
  }
}

describe('AlertComponent', () => {
  let component: AlertComponent
  let fixture: ComponentFixture<TestHostComponent>
  let hostComponent: TestHostComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TestHostComponent)
    hostComponent = fixture.componentInstance
    component = fixture.debugElement.query(
      By.directive(AlertComponent)
    ).componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render message text', () => {
    hostComponent.message = 'Test alert message'

    // Wait after content initialization
    fixture.whenStable().then(() => {
      fixture.detectChanges()
      const alertElement = fixture.debugElement.query(By.css('p'))
      expect(alertElement.nativeElement.textContent).toContain(
        'Test alert message'
      )
    })
  })

  it('should apply info type styles by default', () => {
    const alertElement = fixture.debugElement.query(By.css('div[role="alert"]'))
    expect(alertElement.nativeElement.className).toContain('bg-blue-50')
    expect(alertElement.nativeElement.className).toContain('text-blue-800')
  })

  it('should apply success type styles', () => {
    hostComponent.type = 'success'
    fixture.detectChanges()

    const alertElement = fixture.debugElement.query(By.css('div[role="alert"]'))
    expect(alertElement.nativeElement.className).toContain('bg-green-50')
    expect(alertElement.nativeElement.className).toContain('text-green-800')
  })

  it('should apply error type styles', () => {
    hostComponent.type = 'error'
    fixture.detectChanges()

    const alertElement = fixture.debugElement.query(By.css('div[role="alert"]'))
    expect(alertElement.nativeElement.className).toContain('bg-red-50')
    expect(alertElement.nativeElement.className).toContain('text-red-800')
  })

  it('should apply warning type styles', () => {
    hostComponent.type = 'warning'
    fixture.detectChanges()

    const alertElement = fixture.debugElement.query(By.css('div[role="alert"]'))
    expect(alertElement.nativeElement.className).toContain('bg-yellow-50')
    expect(alertElement.nativeElement.className).toContain('text-yellow-800')
  })

  it('should show appropriate icon for each type', () => {
    // Test success icon
    hostComponent.type = 'success'
    fixture.detectChanges()
    let iconElement = fixture.debugElement.query(By.css('.rounded-lg'))
    expect(iconElement).toBeTruthy()
    expect(iconElement.nativeElement.className).toContain('text-green-800')

    // Test error icon
    hostComponent.type = 'error'
    fixture.detectChanges()
    iconElement = fixture.debugElement.query(By.css('.rounded-lg'))
    expect(iconElement.nativeElement.className).toContain('text-red-800')

    // Test warning icon
    hostComponent.type = 'warning'
    fixture.detectChanges()
    iconElement = fixture.debugElement.query(By.css('.rounded-lg'))
    expect(iconElement.nativeElement.className).toContain('text-yellow-800')

    // Test info icon
    hostComponent.type = 'info'
    fixture.detectChanges()
    iconElement = fixture.debugElement.query(By.css('.rounded-lg'))
    expect(iconElement.nativeElement.className).toContain('text-blue-800')
  })

  it('should not show dismiss button when not dismissible', () => {
    hostComponent.dismissible = false
    fixture.detectChanges()

    const dismissButton = fixture.debugElement.query(By.css('button'))
    expect(dismissButton).toBeFalsy()
  })

  it('should show dismiss button when dismissible', () => {
    hostComponent.dismissible = true
    fixture.detectChanges()

    const dismissButton = fixture.debugElement.query(By.css('button'))
    expect(dismissButton).toBeTruthy()
    expect(dismissButton.nativeElement.getAttribute('aria-label')).toBe(
      'Cerrar'
    )
  })

  it('should emit dismiss event when dismiss button is clicked', () => {
    hostComponent.dismissible = true
    fixture.detectChanges()

    const dismissButton = fixture.debugElement.query(By.css('button'))
    dismissButton.nativeElement.click()

    expect(hostComponent.dismissCount).toBe(1)
  })

  it('should apply custom classes when provided', () => {
    hostComponent.customClasses = 'custom-test-class'
    fixture.detectChanges()

    const alertElement = fixture.debugElement.query(By.css('div[role="alert"]'))
    expect(alertElement.nativeElement.className).toContain('custom-test-class')
  })

  it('should have proper accessibility attributes', () => {
    const alertElement = fixture.debugElement.query(By.css('div[role="alert"]'))
    expect(alertElement.nativeElement.getAttribute('role')).toBe('alert')
  })

  it('should handle different icon types correctly', () => {
    // Test each icon type
    const iconTypes: AlertType[] = ['success', 'error', 'warning', 'info']

    iconTypes.forEach((type) => {
      hostComponent.type = type
      fixture.detectChanges()

      const iconElement = fixture.debugElement.query(
        By.css('div[role="alert"]')
      )
      expect(iconElement).toBeTruthy()

      // Check that the icon has the correct color class
      const expectedColorClass =
        type === 'success'
          ? 'text-green-800'
          : type === 'error'
            ? 'text-red-800'
            : type === 'warning'
              ? 'text-yellow-800'
              : 'text-blue-800'

      expect(iconElement.nativeElement.className).toContain(expectedColorClass)
    })
  })

  it('should handle empty message gracefully', () => {
    hostComponent.message = ''
    fixture.detectChanges()

    const alertElement = fixture.debugElement.query(By.css('div[role="alert"]'))
    expect(alertElement).toBeTruthy()
  })

  it('should have responsive layout classes', () => {
    const alertElement = fixture.debugElement.query(By.css('div[role="alert"]'))
    expect(alertElement.nativeElement.className).toContain('rounded-lg')
    expect(alertElement.nativeElement.className).toContain('p-4')
  })

  it('should handle multiple clicks on dismiss button', () => {
    hostComponent.dismissible = true
    fixture.detectChanges()

    const dismissButton = fixture.debugElement.query(By.css('button'))

    // Click multiple times
    dismissButton.nativeElement.click()
    dismissButton.nativeElement.click()
    dismissButton.nativeElement.click()

    expect(hostComponent.dismissCount).toBe(3)
  })
})
