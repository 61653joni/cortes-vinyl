import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prestaciones } from './prestaciones';

describe('Prestaciones', () => {
  let component: Prestaciones;
  let fixture: ComponentFixture<Prestaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prestaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prestaciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
