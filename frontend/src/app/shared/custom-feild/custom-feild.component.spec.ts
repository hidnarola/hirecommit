import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFeildComponent } from './custom-feild.component';

describe('CustomFeildComponent', () => {
  let component: CustomFeildComponent;
  let fixture: ComponentFixture<CustomFeildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFeildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFeildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
