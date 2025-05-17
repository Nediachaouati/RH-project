import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCandidaturesForOneOffreComponent } from './all-candidatures-for-one-offre.component';

describe('AllCandidaturesForOneOffreComponent', () => {
  let component: AllCandidaturesForOneOffreComponent;
  let fixture: ComponentFixture<AllCandidaturesForOneOffreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCandidaturesForOneOffreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCandidaturesForOneOffreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
