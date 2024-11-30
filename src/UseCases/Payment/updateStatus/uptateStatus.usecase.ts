import { Either, isLeft, isRight, Left, Right } from '../../../@Shared/Either'
import { PaymentStatus } from '../../../Entities/Enums/PaymentStatusEnum'
import IExternalOrderRepository from '../../../External/Order/Contracts/IExternalOrderRepository'
import IExternalPaymentGatewayRepository from '../../../Gateways/contracts/IExternalPaymentGatewayRepository'
import IPaymentGatewayRepository from '../../../Gateways/contracts/IPaymentGatewayRepository'
import { InputUpdateStatusDTO } from './updateStatus.dto'

export default class UpdateStatusUseCase {
    constructor(
        private readonly paymentRepository: IPaymentGatewayRepository,
        private readonly externalPaymentRepository: IExternalPaymentGatewayRepository,
        private readonly externalOrderRepository: IExternalOrderRepository
    ) {}

    async execute(input: InputUpdateStatusDTO): Promise<Either<Error, string>> {
        const paymentStatus =
            await this.externalPaymentRepository.getPaymentStatusById(
                input.externalPaymentId
            )

        if (isLeft(paymentStatus)) {
            return Left<Error>(
                new Error('Erro ao recuperar status do pagamento')
            )
        }

        const status =
            paymentStatus.value === 'approved'
                ? PaymentStatus.APPROVED
                : PaymentStatus.DECLINED

        const savedPayment = await this.paymentRepository.updateStatus(
            input.id,
            status
        )

        if (isRight(savedPayment)) {
            await this.externalOrderRepository.updateOrderStatus(
                savedPayment.value.getOrderId(),
                paymentStatus.value
            )

            return Right<string>(
                `Atualização feita com sucesso.\nOrder Id: ${savedPayment.value.getOrderId()}\nPayment Id: ${
                    input.id
                }\nStatus: ${paymentStatus.value}`
            )
        } else {
            return Left(
                Error('Algo deu errado ao atualizar o status do pedido.')
            )
        }
    }
}
