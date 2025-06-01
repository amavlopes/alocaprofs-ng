import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioProfessorComponent } from './formulario-professor.component';

describe('FormularioProfessorComponent', () => {
  let component: FormularioProfessorComponent;
  let fixture: ComponentFixture<FormularioProfessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioProfessorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioProfessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
