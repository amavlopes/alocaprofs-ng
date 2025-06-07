import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core'
import { debounceTime, Subject } from 'rxjs'

@Directive({
  selector: '[paDebounceClick]',
})
export class DebounceClickDirective {
  private click$ = new Subject<Event>()

  @Input() debounceTime = 500
  @Output() evtClick = new EventEmitter<Event>()

  constructor() {
    this.click$.pipe(debounceTime(this.debounceTime)).subscribe((evento: Event) => {
      this.evtClick.emit(evento)
    })
  }

  @HostListener('click', ['$event']) aoClicar(evento: Event) {
    evento.preventDefault()
    evento.stopImmediatePropagation()

    this.click$.next(evento)
  }
}
