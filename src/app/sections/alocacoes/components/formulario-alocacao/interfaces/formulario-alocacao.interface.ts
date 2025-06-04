import { FormControl } from '@angular/forms'

export interface FormularioAlocacaoI {
  idAlocacao: FormControl<string | null>
  diaSemana: FormControl<string | null>
  horarioInicial: FormControl<string | null>
  horarioFinal: FormControl<string | null>
  idCurso: FormControl<string | null>
  idProfessor: FormControl<string | null>
}
