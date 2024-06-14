import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaDataGComponent } from './idea-data-g.component';

describe('IdeaDataGComponent', () => {
  let component: IdeaDataGComponent;
  let fixture: ComponentFixture<IdeaDataGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeaDataGComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdeaDataGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
