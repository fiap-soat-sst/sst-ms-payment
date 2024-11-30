export interface InputCheckoutDTO {
    orderId: string
    total: number
}

export interface OutputCheckoutDTO {
    id: string
    status: string
    orderId: string
    total: number
}
