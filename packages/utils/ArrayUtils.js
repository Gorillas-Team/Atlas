export const toMap = (key, values) => {
  return values.map((value) => [value[key], value])
}
