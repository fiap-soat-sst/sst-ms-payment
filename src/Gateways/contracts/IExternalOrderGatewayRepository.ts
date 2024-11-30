import { Either } from '../../@Shared/Either'

export default interface IExternalOrderGatewayRepository {
    updateOrderStatus(
        orderId: string,
        status: String
    ): Promise<Either<Error, String>>
}
