import { Either } from '../../@Shared/Either'
import { Payment } from '../../Entities/Payment'
import IExternalPaymentRepository from '../../External/Payment/Contracts/IExternalPaymentRepository'
import IExternalPaymentGatewayRepository from '../contracts/IExternalPaymentGatewayRepository'

export default class ExternalPaymentGatewayRepository
    implements IExternalPaymentGatewayRepository
{
    constructor(private readonly external: IExternalPaymentRepository) {}

    async generateQrCodePaymentString(
        payment: Payment,
        total: number
    ): Promise<Either<Error, String>> {
        return this.external.generateQrCodePaymentString(payment, total)
    }

    async getPaymentStatusById(
        externalPaymentId: String
    ): Promise<Either<Error, String>> {
        return this.external.getPaymentStatusById(externalPaymentId)
    }
}
