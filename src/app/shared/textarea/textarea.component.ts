import { CommonModule } from '@angular/common'
import { Component, forwardRef, inject, Injector, Input, OnInit } from '@angular/core'
import { ControlValueAccessor, FormControl, FormControlName, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms'

import { TextareaModule } from 'primeng/textarea'
import { MensagemValidacaoComponent } from '../mensagem-validacao/mensagem-validacao.component'

@Component({
  selector: 'pa-textarea',
  imports: [CommonModule, FormsModule, TextareaModule, MensagemValidacaoComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css',
})
export class TextareaComponent implements OnInit, ControlValueAccessor {
  private injetor = inject(Injector)
  private _valor: any

  controle!: FormControl
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
    const formControlName = this.injetor.get(FormControlName)
    if (formControlName) this.controle = formControlName.control
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
