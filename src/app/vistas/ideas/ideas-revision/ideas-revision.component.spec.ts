import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasRevisionComponent } from './ideas-revision.component';

describe('IdeasRevisionComponent', () => {
  let component: IdeasRevisionComponent;
  let fixture: ComponentFixture<IdeasRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasRevisionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdeasRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
