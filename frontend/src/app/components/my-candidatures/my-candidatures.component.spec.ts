import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCandidaturesComponent } from './my-candidatures.component';

describe('MyCandidaturesComponent', () => {
  let component: MyCandidaturesComponent;
  let fixture: ComponentFixture<MyCandidaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCandidaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCandidaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
