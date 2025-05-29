import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs'

@Component({
  selector: 'pa-input-search',
  imports: [CommonModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './input-search.component.html',
  styleUrl: './input-search.component.css',
})
export class InputSearchComponent implements OnInit {
  private pesquisa$ = new Subject<string>()
  private destroy$ = new Subject<void>()

  @Input({ required: true }) id!: string
  @Input() placeholder: string = ''
  @Output() aoPesquisar: EventEmitter<string> = new EventEmitter<string>()

  ngOnInit(): void {
    this.observarPesquisa()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  observarPesquisa(): void {
    this.pesquisa$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((termo: string) => {
        this.aoPesquisar.emit(termo)
      })
  }

  pesquisar(evento: Event): void {
    const termo = (evento.target as HTMLInputElement).value?.trim()
    this.pesquisa$.next(termo)
  }
}
