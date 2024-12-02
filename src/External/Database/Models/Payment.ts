export class Payment {
  id: string
  orderId: string
  status: string

  constructor(id: string, orderId: string, status: string) {
      this.id = id
      this.orderId = orderId
      this.status = status
  }
}
