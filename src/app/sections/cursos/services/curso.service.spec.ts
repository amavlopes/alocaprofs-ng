import { TestBed } from '@angular/core/testing'

import { CursoService } from '../../../pages/cursos/curso.service'

describe('CursoService', () => {
  let service: CursoService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(CursoService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
