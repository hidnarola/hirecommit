import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcandidateListComponent } from './newcandidate-list.component';

describe('NewcandidateListComponent', () => {
  let component: NewcandidateListComponent;
  let fixture: ComponentFixture<NewcandidateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewcandidateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewcandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
