import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActividadDataComponent } from './actividad-data.component';

describe('ActividadDataComponent', () => {
  let component: ActividadDataComponent;
  let fixture: ComponentFixture<ActividadDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActividadDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActividadDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
