import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRhComponent } from './add-rh.component';

describe('AddRhComponent', () => {
  let component: AddRhComponent;
  let fixture: ComponentFixture<AddRhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRhComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
