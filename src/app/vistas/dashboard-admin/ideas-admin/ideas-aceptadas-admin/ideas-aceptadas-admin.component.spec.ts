import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasAceptadasAdminComponent } from './ideas-aceptadas-admin.component';

describe('IdeasAceptadasAdminComponent', () => {
  let component: IdeasAceptadasAdminComponent;
  let fixture: ComponentFixture<IdeasAceptadasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasAceptadasAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdeasAceptadasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
