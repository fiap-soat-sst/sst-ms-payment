import { Router } from 'express'
import PaymentController from '../../../Controllers/PaymentController'
import PaymentRepository from '../../Database/Repositories/DatabaseRepository/PaymentRepository'
import CheckoutUseCase from '../../../UseCases/Payment/checkout/checkout.usecase'
import GetByIdUseCase from '../../../UseCases/Payment/getById/getById.usecase'
import UpdateStatusUseCase from '../../../UseCases/Payment/updateStatus/uptateStatus.usecase'
import PaymentGatewayRepository from '../../../Gateways/Payment/PaymentGatewayRepository'
import ListUseCase from '../../../UseCases/Payment/list/list.usecase'
import ExternalPaymentGatewayRepository from '../../../Gateways/Payment/ExternalPaymentGatewayRepository'
import { MercadoPagoExternal } from '../../Payment/MercadoPagoExternal'
import ExternalOrderGatewayRepository from '../../../Gateways/Order/ExternalOrderGatewayRepository'
import { OrderExternal } from '../../Order/OrderExternal'

export default class PaymentRoutes {
    private readonly paymentRepository: PaymentRepository
    private readonly mercadoPagoExternal: MercadoPagoExternal
    private readonly orderExternal: OrderExternal
    private readonly paymentController: PaymentController
    private readonly checkoutUseCase: CheckoutUseCase
    private readonly getByIdUseCase: GetByIdUseCase
    private readonly updateStatusUseCase: UpdateStatusUseCase
    private readonly listUseCase: ListUseCase
    private readonly paymentGatewayRepository: PaymentGatewayRepository
    private readonly externalPaymentRepository: ExternalPaymentGatewayRepository
    private readonly externalOrderRepository: ExternalOrderGatewayRepository

    constructor() {
        this.paymentRepository = new PaymentRepository()
        this.mercadoPagoExternal = new MercadoPagoExternal()
        this.paymentGatewayRepository = new PaymentGatewayRepository(
            this.paymentRepository
        )
        this.externalPaymentRepository = new ExternalPaymentGatewayRepository(
            this.mercadoPagoExternal
        )
        this.externalOrderRepository = new ExternalOrderGatewayRepository(
            this.orderExternal
        )
        this.checkoutUseCase = new CheckoutUseCase(
            this.paymentGatewayRepository,
            this.externalPaymentRepository
        )
        this.getByIdUseCase = new GetByIdUseCase(this.paymentGatewayRepository)
        this.updateStatusUseCase = new UpdateStatusUseCase(
            this.paymentGatewayRepository,
            this.externalPaymentRepository,
            this.externalOrderRepository
        )

        this.listUseCase = new ListUseCase(this.paymentGatewayRepository)

        this.paymentController = new PaymentController(
            this.checkoutUseCase,
            this.getByIdUseCase,
            this.updateStatusUseCase,
            this.listUseCase
        )
    }

    buildRouter(): Router {
        const router = Router()
        router.get('/', this.paymentController.list.bind(this))
        router.post('/checkout', this.paymentController.checkout.bind(this))
        router.get('/:id', this.paymentController.getById.bind(this))
        router.post(
            '/update-status/:id',
            this.paymentController.updateStatus.bind(this)
        )
        return router
    }
}
