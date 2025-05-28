import cookies from 'js-cookie'

const DOMAIN = `${import.meta.env.VITE_COOKIE_DOMAIN}`

export const CookiesService = {
  setJsonCookie(name: string, value: unknown, expires?: number | Date) {
    const json = JSON.stringify(value)
    const base64 = btoa(json)
    cookies.set(name, base64, { expires, path: '/', domain: DOMAIN })
  },
  getJsonCookie(name: string) {
    const base64 = cookies.get(name)
    if (base64) {
      const json = atob(base64)
      try {
        return JSON.parse(json)
      } catch (error) {
        console.info(`Invalid cookie [${name}] value: [${base64}]`)
        console.error(error)
      }
    }
  },
  deleteCookie(name: string) {
    cookies.remove(name)
  },
  datePlusDaysFromNow(days: number) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date
  }
}
