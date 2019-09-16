import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalarybracketComponent } from './view-salarybracket.component';

describe('ViewSalarybracketComponent', () => {
  let component: ViewSalarybracketComponent;
  let fixture: ComponentFixture<ViewSalarybracketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSalarybracketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalarybracketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
