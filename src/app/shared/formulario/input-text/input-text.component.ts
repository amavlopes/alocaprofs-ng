import { CommonModule } from '@angular/common'
import { Component, forwardRef, Input } from '@angular/core'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms'

import { InputTextModule } from 'primeng/inputtext'
import { noop } from 'rxjs'

@Component({
  selector: 'pa-input-text',
  imports: [CommonModule, FormsModule, InputTextModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true
    }
  ],
  templateUrl: './input-text.component.html'
})
export class InputTextComponent implements ControlValueAccessor {
  private _valor: unknown

  estaDesabilitado = false
  onChange: (_: unknown) => void = () => noop
  onTouched: (_: unknown) => void = () => noop

  @Input({ required: true }) id!: string
  @Input({ required: true }) label!: string
  @Input() obrigatorio = false
  @Input() placeholder = ''

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

  setDisabledState(estaDesabilitado: boolean): void {
    this.estaDesabilitado = estaDesabilitado
  }
}
