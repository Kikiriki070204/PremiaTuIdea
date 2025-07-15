import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaIdeaComponent } from './categoria-idea.component';

describe('CategoriaIdeaComponent', () => {
  let component: CategoriaIdeaComponent;
  let fixture: ComponentFixture<CategoriaIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaIdeaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoriaIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
