import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroAlocacaoComponent } from './cadastro-alocacao.component';

describe('CadastroAlocacaoComponent', () => {
  let component: CadastroAlocacaoComponent;
  let fixture: ComponentFixture<CadastroAlocacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroAlocacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroAlocacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
