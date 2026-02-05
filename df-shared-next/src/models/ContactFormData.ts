export type ContactFormData = {
  firstname: string
  lastname: string
  email: string
  profile: 'tenant' | 'owner'
  subject: string
  message: string
}
