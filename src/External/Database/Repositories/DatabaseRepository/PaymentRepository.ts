import { Repository } from 'typeorm'
import { Either, Left, Right, isLeft } from '../../../../@Shared/Either'
import { Payment as model } from '../../Models/Payment'
import { AppDataSource } from '../../DatabaseAdapter'
import IPaymentRepository from '../Contracts/IPaymentRepository'
import { Payment } from '../../../../Entities/Payment'
import { ObjectId } from 'mongodb'

export default class PaymentRepository implements IPaymentRepository {
    private repository: Repository<model>

    constructor() {
        this.repository = AppDataSource.getRepository(model)
    }

    async list(): Promise<Either<Error, Payment[]>> {
        try {
            const paymentsFind = await this.repository.find()

            if (paymentsFind.length === 0) {
                return Right<Payment[]>([])
            }

            const payments = paymentsFind.map((payment) => {
                return new Payment(
                    payment.id.toString(),
                    payment.orderId,
                    payment.status
                )
            })
            return Right<Payment[]>(payments)
        } catch (error) {
            console.error(error)
            return Left<Error>(error as Error)
        }
    }

    async checkout(payment: Payment): Promise<Either<Error, Payment>> {
        try {
            const orderFind = await this.repository.findOne({
                where: {
                    orderId: payment.getOrderId(),
                },
            })

            if (orderFind) {
                return Left<Error>(new Error('Order is already paid'))
            }

            const paymentJSON = payment.toJSON()

            const paymentModel = new model()
            paymentModel.orderId = paymentJSON.orderId
            paymentModel.status = paymentJSON.status

            const paymentSave = await this.repository.save(paymentModel)

            const paymentSent = new Payment(
                paymentSave.id.toString(),
                paymentSave.orderId,
                paymentSave.status
            )

            return Right<Payment>(paymentSent)
        } catch (error) {
            console.error(error)
            return Left<Error>(error as Error)
        }
    }

    async getById(id: string): Promise<Either<Error, Payment>> {
        try {
            const paymentFind = await this.repository.findOne({
                where: { id: new ObjectId(id) },
            })

            if (!paymentFind) {
                return Left<Error>(new Error('Payment not found'))
            }

            const payment = new Payment(
                paymentFind.id.toString(),
                paymentFind.orderId,
                paymentFind.status
            )

            return Right<Payment>(payment)
        } catch (error) {
            return Left<Error>(error as Error)
        }
    }

    async updateStatus(
        id: string,
        status: string
    ): Promise<Either<Error, string>> {
        try {
            const paymentFind = await this.repository.findOne({
                where: { id: new ObjectId(id) },
            })

            if (!paymentFind) {
                return Left<Error>(new Error('Payment not found'))
            }

            paymentFind.status = status

            await this.repository.save(paymentFind)

            return Right(`Status de pagamento atualizado para: ${status}`)
        } catch (error) {
            console.error(error)
            return Left<Error>(error as Error)
        }
    }
}
