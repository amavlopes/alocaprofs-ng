import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoAlocacaoComponent } from './edicao-alocacao.component';

describe('EdicaoAlocacaoComponent', () => {
  let component: EdicaoAlocacaoComponent;
  let fixture: ComponentFixture<EdicaoAlocacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoAlocacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicaoAlocacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
