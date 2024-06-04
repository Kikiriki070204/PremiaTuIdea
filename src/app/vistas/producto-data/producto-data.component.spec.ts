import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoDataComponent } from './producto-data.component';

describe('ProductoDataComponent', () => {
  let component: ProductoDataComponent;
  let fixture: ComponentFixture<ProductoDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
