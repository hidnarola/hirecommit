import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewofferDetailComponent } from './viewoffer-detail.component';

describe('ViewofferDetailComponent', () => {
  let component: ViewofferDetailComponent;
  let fixture: ComponentFixture<ViewofferDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewofferDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewofferDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
