import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Component } from '@angular/core'
import { By } from '@angular/platform-browser'
import { PaginationComponent } from '../pagination.component'

@Component({
  standalone: true,
  imports: [PaginationComponent],
  template: `
    <app-pagination
      [currentPage]="currentPage"
      [totalPages]="totalPages"
      [totalItems]="totalItems"
      [itemsPerPage]="itemsPerPage"
      [maxVisiblePages]="maxVisiblePages"
      (pageChange)="onPageChange($event)"
    ></app-pagination>
  `,
})
class TestHostComponent {
  currentPage = 1
  totalPages = 10
  totalItems = 100
  itemsPerPage = 10
  maxVisiblePages = 5
  lastPageChange = 0

  onPageChange(page: number) {
    this.lastPageChange = page
  }
}

describe('PaginationComponent', () => {
  let component: PaginationComponent
  let fixture: ComponentFixture<TestHostComponent>
  let hostComponent: TestHostComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TestHostComponent)
    hostComponent = fixture.componentInstance
    component = fixture.debugElement.query(
      By.directive(PaginationComponent)
    ).componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display pagination info', () => {
    const infoElement = fixture.debugElement.query(
      By.css('.text-sm.text-gray-700')
    )
    expect(infoElement).toBeTruthy()
    expect(infoElement.nativeElement.textContent).toContain('Mostrando')
    expect(infoElement.nativeElement.textContent).toContain('1')
    expect(infoElement.nativeElement.textContent).toContain('10')
    expect(infoElement.nativeElement.textContent).toContain('100')
  })

  it('should have Previous button disabled on first page', () => {
    hostComponent.currentPage = 1
    fixture.detectChanges()

    const prevButton = fixture.debugElement.query(
      By.css('button[aria-label="Página anterior"]')
    )
    expect(prevButton.nativeElement.disabled).toBe(true)
  })

  it('should have Next button disabled on last page', () => {
    hostComponent.currentPage = 10
    fixture.detectChanges()

    const nextButton = fixture.debugElement.query(
      By.css('button[aria-label="Página siguiente"]')
    )
    expect(nextButton.nativeElement.disabled).toBe(true)
  })

  it('should emit pageChange when page button is clicked', () => {
    const pageButtons = fixture.debugElement.queryAll(By.css('button'))
    const pageButton = pageButtons.find(
      (btn) => btn.nativeElement.textContent.trim() === '2'
    )
    if (pageButton) {
      pageButton.nativeElement.click()
      expect(hostComponent.lastPageChange).toBe(2)
    }
  })

  it('should emit pageChange when Next button is clicked', () => {
    hostComponent.currentPage = 5
    fixture.detectChanges()

    const nextButton = fixture.debugElement.query(
      By.css('button[aria-label="Página siguiente"]')
    )
    nextButton.nativeElement.click()

    expect(hostComponent.lastPageChange).toBe(6)
  })

  it('should emit pageChange when Previous button is clicked', () => {
    hostComponent.currentPage = 5
    fixture.detectChanges()

    const prevButton = fixture.debugElement.query(
      By.css('button[aria-label="Página anterior"]')
    )
    prevButton.nativeElement.click()

    expect(hostComponent.lastPageChange).toBe(4)
  })

  it('should calculate pagination info correctly', () => {
    hostComponent.currentPage = 2
    hostComponent.totalItems = 100
    fixture.detectChanges()

    const infoElement = fixture.debugElement.query(
      By.css('.text-sm.text-gray-700')
    )
    expect(infoElement.nativeElement.textContent).toContain('11')
    expect(infoElement.nativeElement.textContent).toContain('20')
  })

  it('should handle edge case of last page with fewer items', () => {
    hostComponent.currentPage = 10
    hostComponent.totalItems = 95
    fixture.detectChanges()

    const infoElement = fixture.debugElement.query(
      By.css('.text-sm.text-gray-700')
    )
    expect(infoElement.nativeElement.textContent).toContain('91')
    expect(infoElement.nativeElement.textContent).toContain('95')
  })

  it('should have proper accessibility attributes', () => {
    const nav = fixture.debugElement.query(By.css('nav'))
    expect(nav.nativeElement.getAttribute('aria-label')).toBe('Pagination')
  })
})
