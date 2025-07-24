import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesPremiosComponent } from './reportes-premios.component';

describe('ReportesPremiosComponent', () => {
  let component: ReportesPremiosComponent;
  let fixture: ComponentFixture<ReportesPremiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesPremiosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportesPremiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
