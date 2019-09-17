import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAccountsDetailsComponent } from './sub-accounts-details.component';

describe('SubAccountsDetailsComponent', () => {
  let component: SubAccountsDetailsComponent;
  let fixture: ComponentFixture<SubAccountsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubAccountsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAccountsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
