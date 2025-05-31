import { FormControl } from '@angular/forms'

export interface FormularioDepartamentoI {
  idDepartamento: FormControl<string | null>
  nome: FormControl<string | null>
  descricao: FormControl<string | null>
}
