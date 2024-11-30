import { Either } from '../../../@Shared/Either'

export default interface IExternalOrderRepository {
    updateOrderStatus(
        orderId: string,
        status: String
    ): Promise<Either<Error, String>>
}
