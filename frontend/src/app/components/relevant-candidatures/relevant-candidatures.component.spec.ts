import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelevantCandidaturesComponent } from './relevant-candidatures.component';

describe('RelevantCandidaturesComponent', () => {
  let component: RelevantCandidaturesComponent;
  let fixture: ComponentFixture<RelevantCandidaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelevantCandidaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelevantCandidaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
