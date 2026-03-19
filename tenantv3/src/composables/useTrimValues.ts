export const useTrimValues = () => {
  /**
   * Remove the spaces around a string value
   * @param values regle's `r$.$value` formatted as `key: value`
   * @returns the trimmed values
   */
  const trimValues = (values: Record<string, string | boolean>) =>
    Object.keys(values).forEach((key) => {
      if (typeof values[key] === 'string') {
        values[key] = values[key].trim()
      }
    })

  return { trimValues }
}
