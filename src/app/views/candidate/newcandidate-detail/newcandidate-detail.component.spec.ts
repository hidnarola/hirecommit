import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcandidateDetailComponent } from './newcandidate-detail.component';

describe('NewcandidateDetailComponent', () => {
  let component: NewcandidateDetailComponent;
  let fixture: ComponentFixture<NewcandidateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewcandidateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewcandidateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
