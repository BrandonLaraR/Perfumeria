import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorGeneroComponent } from './por-genero.component';

describe('PorGeneroComponent', () => {
  let component: PorGeneroComponent;
  let fixture: ComponentFixture<PorGeneroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PorGeneroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PorGeneroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
