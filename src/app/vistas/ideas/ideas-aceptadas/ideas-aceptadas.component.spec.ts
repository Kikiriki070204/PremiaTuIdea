import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasAceptadasComponent } from './ideas-aceptadas.component';

describe('IdeasAceptadasComponent', () => {
  let component: IdeasAceptadasComponent;
  let fixture: ComponentFixture<IdeasAceptadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasAceptadasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdeasAceptadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
