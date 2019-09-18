import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerSummaryDetailComponent } from './employer-summary-detail.component';

describe('EmployerSummaryDetailComponent', () => {
  let component: EmployerSummaryDetailComponent;
  let fixture: ComponentFixture<EmployerSummaryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerSummaryDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerSummaryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
