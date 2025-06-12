import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesPuntosComponent } from './reportes-puntos.component';

describe('ReportesPuntosComponent', () => {
  let component: ReportesPuntosComponent;
  let fixture: ComponentFixture<ReportesPuntosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesPuntosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportesPuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
