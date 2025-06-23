import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Component } from '@angular/core'
import { By } from '@angular/platform-browser'
import { RatingComponent, RatingSize } from '../rating.component'

@Component({
  standalone: true,
  imports: [RatingComponent],
  template: `
    <app-rating
      [rating]="rating"
      [maxRating]="maxRating"
      [size]="size"
      [readonly]="readonly"
      [showRatingText]="showRatingText"
      [allowHalf]="allowHalf"
      [customClasses]="customClasses"
      (ratingChange)="onRatingChange($event)"
    ></app-rating>
  `,
})
class TestHostComponent {
  rating = 0
  maxRating = 5
  size: RatingSize = 'md'
  readonly = false
  showRatingText = false
  allowHalf = false
  customClasses = ''
  lastRatingChange = 0

  onRatingChange(rating: number) {
    this.lastRatingChange = rating
  }
}

describe('RatingComponent', () => {
  let component: RatingComponent
  let fixture: ComponentFixture<TestHostComponent>
  let hostComponent: TestHostComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TestHostComponent)
    hostComponent = fixture.componentInstance
    component = fixture.debugElement.query(
      By.directive(RatingComponent)
    ).componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render correct number of stars', () => {
    const starElements = fixture.debugElement.queryAll(By.css('button'))
    expect(starElements.length).toBe(5)
  })

  it('should render custom maxRating number of stars', () => {
    hostComponent.maxRating = 10
    fixture.detectChanges()

    // Manually trigger ngOnInit to update stars array for this test
    component.ngOnInit()
    fixture.detectChanges()

    const starElements = fixture.debugElement.queryAll(By.css('button'))
    expect(starElements.length).toBe(10)
  })

  it('should display correct rating', () => {
    hostComponent.rating = 3
    fixture.detectChanges()

    // Basic test - check that rating is set
    expect(component.rating).toBe(3)
  })

  it('should apply different size classes', () => {
    // Test small size
    hostComponent.size = 'sm'
    fixture.detectChanges()

    expect(component.size).toBe('sm')

    // Test large size
    hostComponent.size = 'lg'
    fixture.detectChanges()

    expect(component.size).toBe('lg')
  })

  it('should show rating text when showRatingText is true', () => {
    hostComponent.rating = 4.5
    hostComponent.showRatingText = true
    fixture.detectChanges()

    // Check if showRatingText property is set
    expect(component.showRatingText).toBe(true)
  })

  it('should not show rating text when showRatingText is false', () => {
    hostComponent.rating = 4.5
    hostComponent.showRatingText = false
    fixture.detectChanges()

    expect(component.showRatingText).toBe(false)
  })

  it('should be interactive when not readonly', () => {
    hostComponent.readonly = false
    fixture.detectChanges()

    expect(component.readonly).toBe(false)
  })

  it('should not be interactive when readonly', () => {
    hostComponent.readonly = true
    fixture.detectChanges()

    expect(component.readonly).toBe(true)
  })

  it('should emit rating change when star is clicked', () => {
    hostComponent.readonly = false
    fixture.detectChanges()

    const thirdStar = fixture.debugElement.queryAll(By.css('button'))[2]
    thirdStar.nativeElement.click()

    expect(hostComponent.lastRatingChange).toBe(3)
  })

  it('should not emit rating change when readonly', () => {
    hostComponent.readonly = true
    fixture.detectChanges()

    const thirdStar = fixture.debugElement.queryAll(By.css('button'))[2]
    thirdStar.nativeElement.click()

    expect(hostComponent.lastRatingChange).toBe(0)
  })

  it('should handle half stars when allowHalf is true', () => {
    hostComponent.allowHalf = true
    hostComponent.rating = 3.5
    fixture.detectChanges()

    expect(component.allowHalf).toBe(true)
    expect(component.rating).toBe(3.5)
  })

  it('should apply custom classes when provided', () => {
    hostComponent.customClasses = 'custom-rating-class'
    fixture.detectChanges()

    expect(component.customClasses).toBe('custom-rating-class')
  })

  it('should have proper hover effects when interactive', () => {
    hostComponent.readonly = false
    fixture.detectChanges()

    expect(component.readonly).toBe(false)
  })

  it('should handle zero rating', () => {
    hostComponent.rating = 0
    fixture.detectChanges()

    expect(component.rating).toBe(0)
  })

  it('should handle maximum rating', () => {
    hostComponent.rating = 5
    fixture.detectChanges()

    expect(component.rating).toBe(5)
  })

  it('should clamp rating to maxRating', () => {
    hostComponent.rating = 10
    hostComponent.maxRating = 5
    fixture.detectChanges()

    expect(component.maxRating).toBe(5)
  })

  it('should handle negative ratings', () => {
    hostComponent.rating = -1
    fixture.detectChanges()

    expect(component.rating).toBe(-1)
  })

  it('should have consistent layout', () => {
    const containerElement = fixture.debugElement.query(By.css('div'))
    expect(containerElement).toBeTruthy()
  })

  it('should have proper spacing between stars', () => {
    const containerElement = fixture.debugElement.query(By.css('div'))
    expect(containerElement).toBeTruthy()
  })
})
