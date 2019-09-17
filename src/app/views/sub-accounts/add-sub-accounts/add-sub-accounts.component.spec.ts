import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubAccountsComponent } from './add-sub-accounts.component';

describe('AddSubAccountsComponent', () => {
  let component: AddSubAccountsComponent;
  let fixture: ComponentFixture<AddSubAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
