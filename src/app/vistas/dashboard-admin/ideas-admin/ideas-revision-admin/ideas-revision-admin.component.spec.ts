import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasRevisionAdminComponent } from './ideas-revision-admin.component';

describe('IdeasRevisionAdminComponent', () => {
  let component: IdeasRevisionAdminComponent;
  let fixture: ComponentFixture<IdeasRevisionAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasRevisionAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdeasRevisionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
