import express, { Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../../../swagger.json'
import PaymentRoutes from './Routes/PaymentRoutes'
import VerifyAuthToken from '../../UseCases/Payment/Auth/verifyAuthToken.usecase'
import { authMiddleware } from './Auth/AuthMiddleware'
import dotenv from 'dotenv'
dotenv.config()

const app: Express = express()
app.use(express.json())

const jwtSecret = process.env.JWT_SECRET || ''

const verifyAuthToken = new VerifyAuthToken(jwtSecret)

const paymentRoutes = new PaymentRoutes()

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        swaggerOptions: { url: `${process.env.SWAGGER_URL}` },
    })
)
app.use('/api', authMiddleware(verifyAuthToken))
app.use('/api/payment', paymentRoutes.buildRouter())

export default app
