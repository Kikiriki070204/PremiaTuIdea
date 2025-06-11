import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasAdminComponent } from './ideas-admin.component';

describe('IdeasAdminComponent', () => {
  let component: IdeasAdminComponent;
  let fixture: ComponentFixture<IdeasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdeasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
