import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasRechazadasComponent } from './ideas-rechazadas.component';

describe('IdeasRechazadasComponent', () => {
  let component: IdeasRechazadasComponent;
  let fixture: ComponentFixture<IdeasRechazadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasRechazadasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdeasRechazadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
