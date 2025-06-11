import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiosAdminComponent } from './premios-admin.component';

describe('PremiosAdminComponent', () => {
  let component: PremiosAdminComponent;
  let fixture: ComponentFixture<PremiosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PremiosAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PremiosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
