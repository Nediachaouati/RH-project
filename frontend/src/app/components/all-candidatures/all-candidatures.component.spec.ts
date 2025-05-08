import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCandidaturesComponent } from './all-candidatures.component';

describe('AllCandidaturesComponent', () => {
  let component: AllCandidaturesComponent;
  let fixture: ComponentFixture<AllCandidaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCandidaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCandidaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
