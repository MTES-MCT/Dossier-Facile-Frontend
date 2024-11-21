export class DfMessage {
  id?: number
  creationDateTime?: Date
  messageBody?: string
  typeMessage?: 'FROM_TENANT' | 'TO_TENANT'
  status?: 'READ' | 'UNREAD'
}
