import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAlocacaoComponent } from './lista-alocacao.component';

describe('ListaAlocacaoComponent', () => {
  let component: ListaAlocacaoComponent;
  let fixture: ComponentFixture<ListaAlocacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAlocacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAlocacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
