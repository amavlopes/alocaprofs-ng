import { FormControl } from '@angular/forms'

export interface FormularioProfessorI {
  idProfessor: FormControl<string | null>
  nome: FormControl<string | null>
  cpf: FormControl<string | null>
  idDepartamento: FormControl<string | null>
}
