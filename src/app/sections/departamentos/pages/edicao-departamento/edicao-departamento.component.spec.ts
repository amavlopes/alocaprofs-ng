import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoDepartamentoComponent } from './edicao-departamento.component';

describe('EdicaoDepartamentoComponent', () => {
  let component: EdicaoDepartamentoComponent;
  let fixture: ComponentFixture<EdicaoDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoDepartamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicaoDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
