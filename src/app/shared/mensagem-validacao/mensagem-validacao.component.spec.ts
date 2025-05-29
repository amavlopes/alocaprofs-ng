import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensagemValidacaoComponent } from './mensagem-validacao.component';

describe('MensagemValidacaoComponent', () => {
  let component: MensagemValidacaoComponent;
  let fixture: ComponentFixture<MensagemValidacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensagemValidacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensagemValidacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
