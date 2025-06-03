import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdicaoProfessorComponent } from './edicao-professor.component';

describe('EdicaoProfessorComponent', () => {
  let component: EdicaoProfessorComponent;
  let fixture: ComponentFixture<EdicaoProfessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdicaoProfessorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdicaoProfessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
