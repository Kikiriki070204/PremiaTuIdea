import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesProyectosComponent } from './reportes-proyectos.component';

describe('ReportesProyectosComponent', () => {
  let component: ReportesProyectosComponent;
  let fixture: ComponentFixture<ReportesProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesProyectosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportesProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
