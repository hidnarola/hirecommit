import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatedetailApproveComponent } from './candidatedetail-approve.component';

describe('CandidatedetailApproveComponent', () => {
  let component: CandidatedetailApproveComponent;
  let fixture: ComponentFixture<CandidatedetailApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatedetailApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatedetailApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
