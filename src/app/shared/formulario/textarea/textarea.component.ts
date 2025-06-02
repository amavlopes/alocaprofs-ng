import { CommonModule } from '@angular/common'
import { Component, forwardRef, Input } from '@angular/core'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms'

import { TextareaModule } from 'primeng/textarea'

@Component({
  selector: 'pa-textarea',
  imports: [CommonModule, FormsModule, TextareaModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  templateUrl: './textarea.component.html',
})
export class TextareaComponent implements ControlValueAccessor {
  private _valor: any

  estaDesabilitado: boolean = false
  onChanged: any = () => {}
  onTouched: any = () => {}

  @Input({ required: true }) id!: string
  @Input({ required: true }) label!: string
  @Input() obrigatorio: boolean = false
  @Input() placeholder: string = ''
  @Input() autoResize: boolean = true
  @Input() rows: number = 4

  get valor() {
    return this._valor
  }

  set valor(v: any) {
    if (v !== this.valor) {
      this._valor = v
      this.onChanged(v)
    }
  }

  writeValue(v: any): void {
    this.valor = v
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState?(estaDesabilitado: boolean): void {
    this.estaDesabilitado = estaDesabilitado
  }
}
