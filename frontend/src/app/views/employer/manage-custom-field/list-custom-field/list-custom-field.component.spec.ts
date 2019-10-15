import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCustomFieldComponent } from './list-custom-field.component';

describe('ListCustomFieldComponent', () => {
  let component: ListCustomFieldComponent;
  let fixture: ComponentFixture<ListCustomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListCustomFieldComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
