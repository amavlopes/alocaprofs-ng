import { CommonModule } from '@angular/common'
import { Component, Input, OnInit, Optional, Self } from '@angular/core'
import { AbstractControl, ControlValueAccessor, FormsModule, NgControl } from '@angular/forms'

import { InputTextModule } from 'primeng/inputtext'
import { MensagemValidacaoComponent } from '../mensagem-validacao/mensagem-validacao.component'

@Component({
  selector: 'pa-input-text',
  imports: [CommonModule, FormsModule, InputTextModule, MensagemValidacaoComponent],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css',
})
export class InputTextComponent implements ControlValueAccessor, OnInit {
  private _valor: any

  controle!: AbstractControl
  estaDesabilitado: boolean = false
  onChange: any = () => {}
  onTouched: any = () => {}

  @Input({ required: true }) id!: string
  @Input({ required: true }) label!: string
  @Input() obrigatorio: boolean = false
  @Input() placeholder: string = ''
  @Input() minLength: number = 2
  @Input() maxLength: number = 100

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (ngControl != null) ngControl.valueAccessor = this
  }

  get valor() {
    return this._valor
  }

  set valor(v: any) {
    if (v !== this._valor) {
      this._valor = v
      this.onChange(v)
    }
  }

  ngOnInit(): void {
    if (this.ngControl && this.ngControl.control) this.controle = this.ngControl.control
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
