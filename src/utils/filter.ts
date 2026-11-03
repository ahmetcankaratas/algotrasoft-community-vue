type StringKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T]

// Keeps the items whose string property contains the query, case-insensitively.
// An empty query keeps everything.
export function filterByProperty<T>(items: T[], query: string, property: StringKeys<T>): T[] {
  if (items.length === 0 || query === '') {
    return items
  }
  const needle = query.toLowerCase()
  return items.filter((item) => (item[property] as string).toLowerCase().includes(needle))
}
