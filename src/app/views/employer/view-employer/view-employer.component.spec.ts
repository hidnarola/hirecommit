import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEmployerComponent } from './view-employer.component';

describe('ViewEmployerComponent', () => {
  let component: ViewEmployerComponent;
  let fixture: ComponentFixture<ViewEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
