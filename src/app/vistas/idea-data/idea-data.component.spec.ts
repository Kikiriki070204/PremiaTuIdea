import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaDataComponent } from './idea-data.component';

describe('IdeaDataComponent', () => {
  let component: IdeaDataComponent;
  let fixture: ComponentFixture<IdeaDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeaDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdeaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
