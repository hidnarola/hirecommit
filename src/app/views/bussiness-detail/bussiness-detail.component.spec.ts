import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinessDetailComponent } from './bussiness-detail.component';

describe('BussinessDetailComponent', () => {
  let component: BussinessDetailComponent;
  let fixture: ComponentFixture<BussinessDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BussinessDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BussinessDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
