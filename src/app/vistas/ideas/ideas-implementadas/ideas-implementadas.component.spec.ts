import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasImplementadasComponent } from './ideas-implementadas.component';

describe('IdeasImplementadasComponent', () => {
  let component: IdeasImplementadasComponent;
  let fixture: ComponentFixture<IdeasImplementadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasImplementadasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdeasImplementadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
