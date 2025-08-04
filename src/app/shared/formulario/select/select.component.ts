import { CommonModule } from '@angular/common'
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'

import { SelectChangeEvent, SelectModule } from 'primeng/select'
import { noop } from 'rxjs'

@Component({
  selector: 'pa-select',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  templateUrl: './select.component.html'
})
export class SelectComponent implements ControlValueAccessor {
  private _valor: unknown

  estaDesabilitado = false
  onChange: (_: unknown) => void = () => noop
  onTouched: (_: unknown) => void = () => noop

  @Input({ required: true }) id!: string
  @Input() label!: string
  @Input({ required: true }) items!: unknown[] | undefined
  @Input({ required: true }) opcaoLabel!: string
  @Input({ required: true }) opcaoValor!: string

  @Input({ required: true }) filtrarPor!: string
  @Input() carregando = false
  @Input() obrigatorio = false
  @Input() placeholder = ''

  @Output() evtSelecionar = new EventEmitter<unknown>()

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

  aoSelecionar(evento: SelectChangeEvent): void {
    this.evtSelecionar.emit(evento.value)
  }
}
