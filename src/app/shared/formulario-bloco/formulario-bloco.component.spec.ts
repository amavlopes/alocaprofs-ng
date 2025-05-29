import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioBlocoComponent } from './formulario-bloco.component';

describe('FormularioBlocoComponent', () => {
  let component: FormularioBlocoComponent;
  let fixture: ComponentFixture<FormularioBlocoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioBlocoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioBlocoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
