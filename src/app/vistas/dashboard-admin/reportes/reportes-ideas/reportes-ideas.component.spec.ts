import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesIdeasComponent } from './reportes-ideas.component';

describe('ReportesIdeasComponent', () => {
  let component: ReportesIdeasComponent;
  let fixture: ComponentFixture<ReportesIdeasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesIdeasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportesIdeasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
