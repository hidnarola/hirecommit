import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomFeildComponent } from './add-custom-feild.component';

describe('AddCustomFeildComponent', () => {
  let component: AddCustomFeildComponent;
  let fixture: ComponentFixture<AddCustomFeildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomFeildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomFeildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
