import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerAddofferComponent } from './employer-addoffer.component';

describe('EmployerAddofferComponent', () => {
  let component: EmployerAddofferComponent;
  let fixture: ComponentFixture<EmployerAddofferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerAddofferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerAddofferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
