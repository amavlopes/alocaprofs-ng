import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, forwardRef, inject, Injector, Input, OnInit } from '@angular/core'
import {
  ControlValueAccessor,
  FormControl,
  FormControlName,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms'

import { InputTextModule } from 'primeng/inputtext'
import { MensagemValidacaoComponent } from '../mensagem-validacao/mensagem-validacao.component'

@Component({
  selector: 'pa-input-text',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, InputTextModule, MensagemValidacaoComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css',
})
export class InputTextComponent implements ControlValueAccessor, OnInit {
  private injetor = inject(Injector)
  private _valor: any

  controle!: FormControl
  estaDesabilitado: boolean = false
  onChange: any = () => {}
  onTouched: any = () => {}

  @Input({ required: true }) id!: string
  @Input({ required: true }) label!: string
  @Input() obrigatorio: boolean = false
  @Input() placeholder: string = ''
  @Input() minLength: number = 2
  @Input() maxLength: number = 100

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
    const formControlName = this.injetor.get(FormControlName)
    if (formControlName) this.controle = formControlName.control
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
