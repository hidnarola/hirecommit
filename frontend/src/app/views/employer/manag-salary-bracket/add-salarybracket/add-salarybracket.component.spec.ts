import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalarybracketComponent } from './add-salarybracket.component';

describe('AddSalarybracketComponent', () => {
  let component: AddSalarybracketComponent;
  let fixture: ComponentFixture<AddSalarybracketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSalarybracketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalarybracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
