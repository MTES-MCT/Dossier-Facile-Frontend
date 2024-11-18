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
    if (base64 != undefined) {
      const json = atob(base64)
      return JSON.parse(json)
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
