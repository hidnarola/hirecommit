import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubAccountsComponent } from './view-sub-accounts.component';

describe('ViewSubAccountsComponent', () => {
  let component: ViewSubAccountsComponent;
  let fixture: ComponentFixture<ViewSubAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSubAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
