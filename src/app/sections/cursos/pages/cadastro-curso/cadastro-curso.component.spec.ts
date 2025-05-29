import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CadastroCursoComponent } from './cadastro-curso.component'

describe('CadastroCursoComponent', () => {
  let component: CadastroCursoComponent
  let fixture: ComponentFixture<CadastroCursoComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroCursoComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CadastroCursoComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
