import { AxiosHeaders, AxiosResponse } from 'axios'
import { Either, Left, Right } from '../../@Shared/Either'
import { HttpRequest } from '../../@Shared/Request'
import IExternalOrderRepository from './Contracts/IExternalOrderRepository'

export class OrderExternal implements IExternalOrderRepository {
    async updateOrderStatus(
        orderId: string,
        status: String
    ): Promise<Either<Error, String>> {
        try {
            const url = `${process.env.ORDER_SERVICE_URL}/${orderId}`
            const request = new HttpRequest()
            const headers = new AxiosHeaders()
            headers.set('x-api-key', process.env.X_API_KEY)

            const result: AxiosResponse = await request.post(url, headers, {
                status,
            })

            return Right<string>(result.status.toString())
        } catch (error) {
            console.error(error)
            return Left<Error>(error as Error)
        }
    }
}
