import { CommonModule } from '@angular/common'
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core'
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'

import { SelectChangeEvent, SelectModule } from 'primeng/select'

@Component({
  selector: 'pa-select',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule],
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
  @Input() label!: string
  @Input({ required: true }) items!: any[] | undefined
  @Input({ required: true }) opcaoLabel!: string
  @Input({ required: true }) opcaoValor!: string

  @Input({ required: true }) filtrarPor!: string
  @Input() carregando: boolean = false
  @Input() obrigatorio: boolean = false
  @Input() placeholder: string = ''

  @Output() evtSelecionar: EventEmitter<any> = new EventEmitter()

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

  aoSelecionar(evento: SelectChangeEvent): void {
    this.evtSelecionar.emit(evento.value)
  }
}
