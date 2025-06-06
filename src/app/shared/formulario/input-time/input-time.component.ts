import { CommonModule } from '@angular/common'
import { Component, forwardRef, Input } from '@angular/core'

import { InputMaskModule } from 'primeng/inputmask'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms'

@Component({
  selector: 'pa-input-time',
  imports: [CommonModule, FormsModule, InputMaskModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTimeComponent),
      multi: true,
    },
  ],
  templateUrl: './input-time.component.html',
})
export class InputTimeComponent implements ControlValueAccessor {
  private _valor: any

  estaDesabilitado!: boolean
  OnChange: any = () => {}
  OnTouched: any = () => {}

  @Input({ required: true }) id!: string
  @Input({ required: true }) label!: string
  @Input() placeholder: string = ''
  @Input() obrigatorio: boolean = false

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
