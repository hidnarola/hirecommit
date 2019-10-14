import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCustomFeildComponent } from './list-custom-feild.component';

describe('ListCustomFeildComponent', () => {
  let component: ListCustomFeildComponent;
  let fixture: ComponentFixture<ListCustomFeildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCustomFeildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCustomFeildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
