import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonosAdminComponent } from './bonos-admin.component';

describe('BonosAdminComponent', () => {
  let component: BonosAdminComponent;
  let fixture: ComponentFixture<BonosAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonosAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BonosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
