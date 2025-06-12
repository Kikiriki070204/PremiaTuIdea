import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasImplementadasAdminComponent } from './ideas-implementadas-admin.component';

describe('IdeasImplementadasAdminComponent', () => {
  let component: IdeasImplementadasAdminComponent;
  let fixture: ComponentFixture<IdeasImplementadasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasImplementadasAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdeasImplementadasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
