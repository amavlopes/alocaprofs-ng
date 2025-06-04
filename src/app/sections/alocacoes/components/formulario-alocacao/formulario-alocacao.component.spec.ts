import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioAlocacaoComponent } from './formulario-alocacao.component';

describe('FormularioAlocacaoComponent', () => {
  let component: FormularioAlocacaoComponent;
  let fixture: ComponentFixture<FormularioAlocacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioAlocacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioAlocacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
