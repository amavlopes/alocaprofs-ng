import { HttpParams } from '@angular/common/http'

export const criarHttpParams = function (query: { [key: string]: any }): HttpParams {
  let params = new HttpParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(key, value.toString())
    }
  })

  return params
}
