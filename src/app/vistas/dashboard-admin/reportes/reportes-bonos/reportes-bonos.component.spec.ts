import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesBonosComponent } from './reportes-bonos.component';

describe('ReportesBonosComponent', () => {
  let component: ReportesBonosComponent;
  let fixture: ComponentFixture<ReportesBonosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesBonosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportesBonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
