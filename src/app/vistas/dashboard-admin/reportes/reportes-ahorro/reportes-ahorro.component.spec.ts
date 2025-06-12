import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesAhorroComponent } from './reportes-ahorro.component';

describe('ReportesAhorroComponent', () => {
  let component: ReportesAhorroComponent;
  let fixture: ComponentFixture<ReportesAhorroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesAhorroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportesAhorroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
