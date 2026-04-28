export const useUtils = () => {
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

  const getDocSize = (size: number | undefined) => {
    if (size) return Math.round(size / 1024)
  }

  const getAllowedTypes = (types: readonly string[] | string[]) =>
    types.map((type) => type.trim().split('/')[1]).join(', ')

  return { trimValues, getDocSize, getAllowedTypes }
}
