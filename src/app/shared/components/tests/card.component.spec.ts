import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CardComponent, CardVariant, CardSize } from '../card.component';

@Component({
  standalone: true,
  imports: [CardComponent],
  template: `
    <app-card
      [variant]="variant"
      [size]="size"
      [hoverable]="hoverable"
      [customClasses]="customClasses"
    >
      <div class="test-content">Card content goes here</div>
    </app-card>
  `
})
class TestHostComponent {
  variant: CardVariant = 'default';
  size: CardSize = 'md';
  hoverable = false;
  customClasses = '';
}

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(CardComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render projected content', () => {
    const cardElement = fixture.debugElement.query(By.css('.test-content'));
    expect(cardElement).toBeTruthy();
    expect(cardElement.nativeElement.textContent.trim()).toBe('Card content goes here');
  });

  it('should apply default variant styles', () => {
    const cardElement = fixture.debugElement.query(By.css('div'));
    expect(cardElement.nativeElement.className).toContain('bg-white');
    expect(cardElement.nativeElement.className).toContain('border');
    expect(cardElement.nativeElement.className).toContain('border-gray-200');
  });

  it('should apply product variant styles', () => {
    hostComponent.variant = 'product';
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('div'));
    expect(cardElement.nativeElement.className).toContain('bg-white');
    expect(cardElement.nativeElement.className).toContain('border');
    expect(cardElement.nativeElement.className).toContain('shadow-lg');
  });

  it('should apply form variant styles', () => {
    hostComponent.variant = 'form';
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('div'));
    expect(cardElement.nativeElement.className).toContain('bg-white');
    expect(cardElement.nativeElement.className).toContain('shadow-lg');
    expect(cardElement.nativeElement.className).toContain('border');
  });

  it('should apply elevated variant styles', () => {
    hostComponent.variant = 'elevated';
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('div'));
    expect(cardElement.nativeElement.className).toContain('bg-white');
    expect(cardElement.nativeElement.className).toContain('shadow-xl');
    expect(cardElement.nativeElement.className).toContain('border');
  });

  it('should apply different size styles', () => {
    // Test small size
    hostComponent.size = 'sm';
    fixture.detectChanges();
    let cardElement = fixture.debugElement.query(By.css('div'));
    expect(cardElement.nativeElement.className).toContain('p-4');

    // Test medium size
    hostComponent.size = 'md';
    fixture.detectChanges();
    cardElement = fixture.debugElement.query(By.css('div'));
    expect(cardElement.nativeElement.className).toContain('p-6');

    // Test large size
    hostComponent.size = 'lg';
    fixture.detectChanges();
    cardElement = fixture.debugElement.query(By.css('div'));
    expect(cardElement.nativeElement.className).toContain('p-8');
  });

  it('should apply hoverable styles when hoverable is true', () => {
    hostComponent.hoverable = true;
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('div'));
    expect(cardElement.nativeElement.className).toContain('transition-all');
    expect(cardElement.nativeElement.className).toContain('duration-300');
    expect(cardElement.nativeElement.className).toContain('hover:shadow-lg');
  });

  it('should not apply hoverable styles when hoverable is false', () => {
    hostComponent.hoverable = false;
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('div'));
    expect(cardElement.nativeElement.className).not.toContain('hover:shadow-lg');
  });

  it('should apply custom classes when provided', () => {
    hostComponent.customClasses = 'custom-test-class another-class';
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('div'));
    expect(cardElement.nativeElement.className).toContain('custom-test-class');
    expect(cardElement.nativeElement.className).toContain('another-class');
  });

  it('should have base classes applied in all variants', () => {
    const variants: CardVariant[] = ['default', 'product', 'form', 'elevated'];

    variants.forEach(variant => {
      hostComponent.variant = variant;
      fixture.detectChanges();

      const cardElement = fixture.debugElement.query(By.css('div'));
      expect(cardElement.nativeElement.className).toContain('rounded-xl');
    });
  });

  it('should handle combination of variant, size, and hoverable', () => {
    hostComponent.variant = 'product';
    hostComponent.size = 'lg';
    hostComponent.hoverable = true;
    hostComponent.customClasses = 'test-class';
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('div'));

    // Check variant styles
    expect(cardElement.nativeElement.className).toContain('shadow-lg');

    // Check size styles
    expect(cardElement.nativeElement.className).toContain('p-8');

    // Check hoverable styles
    expect(cardElement.nativeElement.className).toContain('hover:shadow-lg');

    // Check custom classes
    expect(cardElement.nativeElement.className).toContain('test-class');
  });

  it('should maintain rounded corners across all variants', () => {
    const variants: CardVariant[] = ['default', 'product', 'form', 'elevated'];

    variants.forEach(variant => {
      hostComponent.variant = variant;
      fixture.detectChanges();

      const cardElement = fixture.debugElement.query(By.css('div'));
      expect(cardElement.nativeElement.className).toContain('rounded-xl');
    });
  });

  it('should handle empty content gracefully', () => {
    const testComponent = TestBed.createComponent(CardComponent);
    testComponent.detectChanges();

    const cardElement = testComponent.debugElement.query(By.css('div'));
    expect(cardElement).toBeTruthy();
  });

  it('should apply correct background and text colors', () => {
    const variants: CardVariant[] = ['default', 'product', 'form', 'elevated'];

    variants.forEach(variant => {
      hostComponent.variant = variant;
      fixture.detectChanges();

      const cardElement = fixture.debugElement.query(By.css('div'));
      expect(cardElement.nativeElement.className).toContain('bg-white');
    });
  });

  it('should handle different content types', () => {
    // The component should work with any type of projected content
    const cardElement = fixture.debugElement.query(By.css('div'));
    expect(cardElement).toBeTruthy();

    // Check that ng-content is working
    const projectedContent = fixture.debugElement.query(By.css('.test-content'));
    expect(projectedContent).toBeTruthy();
  });

  it('should build CSS classes correctly', () => {
    // Test the getCardClasses method indirectly
    hostComponent.variant = 'form';
    hostComponent.size = 'lg';
    hostComponent.hoverable = true;
    hostComponent.customClasses = 'extra-class';
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('div'));
    const classes = cardElement.nativeElement.className;

    // Should contain all expected classes
    expect(classes).toContain('rounded-xl');
    expect(classes).toContain('bg-white');
    expect(classes).toContain('shadow-lg');
    expect(classes).toContain('p-8');
    expect(classes).toContain('hover:shadow-lg');
    expect(classes).toContain('extra-class');
  });
});
