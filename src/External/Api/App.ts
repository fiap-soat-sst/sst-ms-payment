import express, { Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../../../swagger.json'
import PaymentRoutes from './Routes/PaymentRoutes'

const app: Express = express()
app.use(express.json())

const paymentRoutes = new PaymentRoutes()

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        swaggerOptions: { url: `${process.env.SWAGGER_URL}` },
    })
)
app.use('/api/payment', paymentRoutes.buildRouter())

export default app
