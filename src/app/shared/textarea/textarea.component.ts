import { CommonModule } from '@angular/common'
import { Component, Input, OnInit, Optional, Self } from '@angular/core'
import { AbstractControl, ControlValueAccessor, FormsModule, NgControl } from '@angular/forms'

import { TextareaModule } from 'primeng/textarea'
import { MensagemValidacaoComponent } from '../mensagem-validacao/mensagem-validacao.component'

@Component({
  selector: 'pa-textarea',
  imports: [CommonModule, FormsModule, TextareaModule, MensagemValidacaoComponent],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css',
})
export class TextareaComponent implements OnInit, ControlValueAccessor {
  private _valor: any

  controle!: AbstractControl
  estaDesabilitado: boolean = false
  onChanged: any = () => {}
  onTouched: any = () => {}

  @Input({ required: true }) id!: string
  @Input({ required: true }) label!: string
  @Input() obrigatorio: boolean = false
  @Input() placeholder: string = ''
  @Input() autoResize: boolean = true
  @Input() rows: number = 4
  @Input() minLength: number = 2
  @Input() maxLength: number = 100

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (ngControl != null) ngControl.valueAccessor = this
  }

  get valor() {
    return this._valor
  }

  set valor(v: any) {
    if (v !== this.valor) {
      this._valor = v
      this.onChanged(v)
    }
  }

  ngOnInit(): void {
    if (this.ngControl && this.ngControl.control) this.controle = this.ngControl.control
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
