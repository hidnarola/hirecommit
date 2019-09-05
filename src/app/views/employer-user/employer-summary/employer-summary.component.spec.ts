import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerSummaryComponent } from './employer-summary.component';

describe('EmployerSummaryComponent', () => {
  let component: EmployerSummaryComponent;
  let fixture: ComponentFixture<EmployerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
