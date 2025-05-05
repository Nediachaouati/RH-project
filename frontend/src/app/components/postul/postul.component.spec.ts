import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostulComponent } from './postul.component';

describe('PostulComponent', () => {
  let component: PostulComponent;
  let fixture: ComponentFixture<PostulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostulComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
