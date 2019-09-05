import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BussinessDetail1Component } from './bussiness-detail1.component';

describe('BussinessDetail1Component', () => {
  let component: BussinessDetail1Component;
  let fixture: ComponentFixture<BussinessDetail1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BussinessDetail1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BussinessDetail1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
