import { CommonModule } from '@angular/common'
import { Component, forwardRef, Input } from '@angular/core'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms'

import { InputMaskModule } from 'primeng/inputmask'
import { noop } from 'rxjs'

@Component({
  selector: 'pa-input-time',
  imports: [CommonModule, FormsModule, InputMaskModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTimeComponent),
      multi: true
    }
  ],
  templateUrl: './input-time.component.html'
})
export class InputTimeComponent implements ControlValueAccessor {
  private _valor: unknown

  estaDesabilitado!: boolean
  onChange: (_: unknown) => void = () => noop
  onTouched: (_: unknown) => void = () => noop

  @Input({ required: true }) id!: string
  @Input({ required: true }) label!: string
  @Input() placeholder = ''
  @Input() obrigatorio = false

  get valor() {
    return this._valor
  }

  set valor(v: unknown) {
    if (v !== this._valor) {
      this._valor = v
      this.onChange(v)
    }
  }

  writeValue(v: unknown): void {
    this.valor = v
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState?(estaDesabilitado: boolean): void {
    this.estaDesabilitado = estaDesabilitado
  }
}
