export interface MapEntry<T> {
  key: string
  value: T
}

export function entries<T>(map?: { [key: string]: T }): MapEntry<T>[] {
  const result = []
  if (map) {
    for (let k in map) {
      if (map.hasOwnProperty(k)) {
        result.push({ key: k, value: map[k] })
      }
    }
  }
  return result
}
