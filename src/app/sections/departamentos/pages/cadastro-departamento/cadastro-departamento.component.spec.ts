import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroDepartamentoComponent } from './cadastro-departamento.component';

describe('CadastroDepartamentoComponent', () => {
  let component: CadastroDepartamentoComponent;
  let fixture: ComponentFixture<CadastroDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroDepartamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
