import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoCursoComponent } from './edicao-curso.component';

describe('EdicaoCursoComponent', () => {
  let component: EdicaoCursoComponent;
  let fixture: ComponentFixture<EdicaoCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoCursoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicaoCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
