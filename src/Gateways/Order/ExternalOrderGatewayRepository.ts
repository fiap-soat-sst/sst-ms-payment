import { Either } from '../../@Shared/Either'
import { Payment } from '../../Entities/Payment'
import IExternalOrderRepository from '../../External/Order/Contracts/IExternalOrderRepository'
import IExternalOrderGatewayRepository from '../contracts/IExternalOrderGatewayRepository'

export default class ExternalOrderGatewayRepository
    implements IExternalOrderGatewayRepository
{
    constructor(private readonly external: IExternalOrderRepository) {}

    async updateOrderStatus(
        orderId: string,
        status: String
    ): Promise<Either<Error, String>> {
        return this.external.updateOrderStatus(orderId, status)
    }
}
