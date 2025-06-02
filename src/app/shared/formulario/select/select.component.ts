import { CommonModule } from '@angular/common'
import { Component, forwardRef, Input } from '@angular/core'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms'

import { SelectModule } from 'primeng/select'

@Component({
  selector: 'pa-select',
  imports: [CommonModule, FormsModule, SelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  templateUrl: './select.component.html',
})
export class SelectComponent implements ControlValueAccessor {
  private _valor: any

  estaDesabilitado: boolean = false
  OnChange: any = () => {}
  OnTouched: any = () => {}

  @Input({ required: true }) id!: string
  @Input({ required: true }) label!: string
  @Input({ required: true }) items!: any[] | undefined
  @Input({ required: true }) opcaoLabel!: string
  @Input({ required: true }) opcaoValor!: string

  @Input({ required: true }) filtrarPor!: string
  @Input() carregando: boolean = false
  @Input() obrigatorio: boolean = false
  @Input() placeholder: string = ''

  get valor(): any {
    return this._valor
  }

  set valor(v: any) {
    if (v !== this._valor) {
      this._valor = v
      this.OnChange(v)
    }
  }

  writeValue(v: any): void {
    this.valor = v
  }

  registerOnChange(fn: any): void {
    this.OnChange = fn
  }

  registerOnTouched(fn: any): void {
    this.OnTouched = fn
  }

  setDisabledState?(estaDesabilitado: boolean): void {
    this.estaDesabilitado = estaDesabilitado
  }
}
