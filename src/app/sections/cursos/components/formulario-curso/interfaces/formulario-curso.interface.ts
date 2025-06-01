import { FormControl } from '@angular/forms'

export interface FormularioCursoI {
  idCurso: FormControl<string | null>
  nome: FormControl<string | null>
  descricao: FormControl<string | null>
}
