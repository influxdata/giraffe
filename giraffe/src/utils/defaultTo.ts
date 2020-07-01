export const defaultTo = (value, defaultValue) => {
  return value == null || value !== value ? defaultValue : value
}
