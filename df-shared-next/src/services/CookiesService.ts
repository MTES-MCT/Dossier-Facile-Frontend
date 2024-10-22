import { useCookies } from 'vue3-cookies'

const DOMAIN = `${import.meta.env.VITE_COOKIE_DOMAIN}`

const { cookies } = useCookies()

export const CookiesService = {
  setJsonCookie(name: string, value: unknown, expires?: string | Date) {
    const json = JSON.stringify(value)
    const base64 = btoa(json)
    cookies.set(name, base64, expires, '/', DOMAIN)
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
