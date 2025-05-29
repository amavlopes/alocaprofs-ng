import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroTabelaContainerComponent } from './filtro-tabela-container.component';

describe('FiltroTabelaContainerComponent', () => {
  let component: FiltroTabelaContainerComponent;
  let fixture: ComponentFixture<FiltroTabelaContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroTabelaContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltroTabelaContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
