export const converterParaString = function (obj: any) {
  const result: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = String((obj as any)[key])
    }
  }
  return result
}
