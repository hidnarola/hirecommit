import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailconfermationComponent } from './emailconfermation.component';

describe('EmailconfermationComponent', () => {
  let component: EmailconfermationComponent;
  let fixture: ComponentFixture<EmailconfermationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailconfermationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailconfermationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
