import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasRechazadasAdminComponent } from './ideas-rechazadas-admin.component';

describe('IdeasRechazadasAdminComponent', () => {
  let component: IdeasRechazadasAdminComponent;
  let fixture: ComponentFixture<IdeasRechazadasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasRechazadasAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdeasRechazadasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
