import { DynamoDB } from '../../DatabaseAdapter'
import IPaymentRepository from '../Contracts/IPaymentRepository'
import { Either, Left, Right } from '../../../../@Shared/Either'
import { Payment } from '../../../../Entities/Payment'
import { PutCommand, GetCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'

const TABLE_NAME = 'payment-table'

export default class PaymentRepository implements IPaymentRepository {
    async list(): Promise<Either<Error, Payment[]>> {
        try {
            const result = await DynamoDB.send(new ScanCommand({ TableName: TABLE_NAME }))
            const payments = result.Items?.map(
                (item) => new Payment(item.id, item.orderId, item.status)
            ) || []
            return Right<Payment[]>(payments)
        } catch (error) {
            console.error(error)
            return Left<Error>(error as Error)
        }
    }

    async checkout(payment: Payment): Promise<Either<Error, Payment>> {
        try {
            const existing = await DynamoDB.send(
                new GetCommand({ TableName: TABLE_NAME, Key: { orderId: payment.getOrderId() } })
            )
            if (existing.Item) {
                return Left<Error>(new Error('Order is already paid'))
            }

            await DynamoDB.send(
                new PutCommand({
                    TableName: TABLE_NAME,
                    Item: {
                        id: payment.getId(),
                        orderId: payment.getOrderId(),
                        status: payment.getStatus(),
                    },
                })
            )
            return Right<Payment>(payment)
        } catch (error) {
            console.error(error)
            return Left<Error>(error as Error)
        }
    }

    async getById(orderId: string): Promise<Either<Error, Payment>> {
        try {
            const result = await DynamoDB.send(
                new GetCommand({ TableName: TABLE_NAME, Key: { orderId } })
            )
            if (!result.Item) {
                return Left<Error>(new Error('Payment not found'))
            }
            const payment = new Payment(result.Item.id, result.Item.orderId, result.Item.status)
            return Right<Payment>(payment)
        } catch (error) {
            console.error(error)
            return Left<Error>(error as Error)
        }
    }

    async updateStatus(orderId: string, status: string): Promise<Either<Error, Payment>> {
        try {
            await DynamoDB.send(
                new UpdateCommand({
                    TableName: TABLE_NAME,
                    Key: { orderId },
                    UpdateExpression: 'set #status = :status',
                    ExpressionAttributeNames: { '#status': 'status' },
                    ExpressionAttributeValues: { ':status': status },
                })
            )
            return this.getById(orderId)
        } catch (error) {
            console.error(error)
            return Left<Error>(error as Error)
        }
    }
}
