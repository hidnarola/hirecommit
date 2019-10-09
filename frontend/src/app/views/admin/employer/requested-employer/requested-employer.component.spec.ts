import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedEmployerComponent } from './requested-employer.component';

describe('RequestedEmployerComponent', () => {
  let component: RequestedEmployerComponent;
  let fixture: ComponentFixture<RequestedEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestedEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
