import { CommonModule } from '@angular/common'
import { Component, forwardRef, Input } from '@angular/core'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms'

import { TextareaModule } from 'primeng/textarea'
import { noop } from 'rxjs'

@Component({
  selector: 'pa-textarea',
  imports: [CommonModule, FormsModule, TextareaModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  templateUrl: './textarea.component.html'
})
export class TextareaComponent implements ControlValueAccessor {
  private _valor: unknown

  estaDesabilitado = false
  onChange: (_: unknown) => void = () => noop
  onTouched: (_: unknown) => void = () => noop

  @Input({ required: true }) id!: string
  @Input({ required: true }) label!: string
  @Input() obrigatorio = false
  @Input() placeholder = ''
  @Input() autoResize = true
  @Input() rows = 4

  get valor() {
    return this._valor
  }

  set valor(v: unknown) {
    if (v !== this.valor) {
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
