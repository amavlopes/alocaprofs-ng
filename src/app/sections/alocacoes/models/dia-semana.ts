import { DiaSemanaE } from '../enums/dia-semana.enum'
import { DiaSemanaI } from '../interfaces/dia-semana.interface'

export class DiaSemana implements DiaSemanaI {
  id: number
  nome: string

  constructor(id: number, nome: string) {
    this.id = id
    this.nome = nome
  }

  static carregar() {
    return [
      {
        id: DiaSemanaE.DOMINGO,
        nome: 'Domingo',
      },
      {
        id: DiaSemanaE.SEGUNDA,
        nome: 'Segunda',
      },
      {
        id: DiaSemanaE.TERCA,
        nome: 'Terça',
      },
      {
        id: DiaSemanaE.QUARTA,
        nome: 'Quarta',
      },
      {
        id: DiaSemanaE.QUINTA,
        nome: 'Quinta',
      },
      {
        id: DiaSemanaE.SEXTA,
        nome: 'Sexta',
      },
      {
        id: DiaSemanaE.SABADO,
        nome: 'Sábado',
      },
    ]
  }

  static retornarDia(dia: DiaSemanaE) {
    switch (dia) {
      case DiaSemanaE.DOMINGO:
        return 'Domingo'
      case DiaSemanaE.SEGUNDA:
        return 'Segunda'
      case DiaSemanaE.TERCA:
        return 'Terça'
      case DiaSemanaE.QUARTA:
        return 'Quarta'
      case DiaSemanaE.QUINTA:
        return 'Quinta'
      case DiaSemanaE.SEXTA:
        return 'Sexta'
      case DiaSemanaE.SABADO:
        return 'Sábado'
    }
  }
}
