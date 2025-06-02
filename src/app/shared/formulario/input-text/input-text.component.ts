import { CommonModule } from '@angular/common'
import { Component, forwardRef, Input } from '@angular/core'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms'

import { InputTextModule } from 'primeng/inputtext'

@Component({
  selector: 'pa-input-text',
  imports: [CommonModule, FormsModule, InputTextModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
  templateUrl: './input-text.component.html',
})
export class InputTextComponent implements ControlValueAccessor {
  private _valor: any

  estaDesabilitado: boolean = false
  onChange: any = () => {}
  onTouched: any = () => {}

  @Input({ required: true }) id!: string
  @Input({ required: true }) label!: string
  @Input() obrigatorio: boolean = false
  @Input() placeholder: string = ''

  get valor() {
    return this._valor
  }

  set valor(v: any) {
    if (v !== this._valor) {
      this._valor = v
      this.onChange(v)
    }
  }

  writeValue(v: any): void {
    this.valor = v
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(estaDesabilitado: boolean): void {
    this.estaDesabilitado = estaDesabilitado
  }
}
