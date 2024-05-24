import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremioDataComponent } from './premio-data.component';

describe('PremioDataComponent', () => {
  let component: PremioDataComponent;
  let fixture: ComponentFixture<PremioDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremioDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PremioDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
