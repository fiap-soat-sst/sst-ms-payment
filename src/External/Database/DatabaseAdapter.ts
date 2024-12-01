import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Payment } from './Models/Payment'

export const AppDataSource = new DataSource({
    type: 'mongodb',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 27017,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: false,
    entities: [Payment],
    synchronize: true,
    useUnifiedTopology: true,
})

AppDataSource.initialize()
    .then(() => {
        console.log(
            '[MongoDb]: Connection has been established successfully 🚀'
        )
    })
    .catch((error) => {
        throw error
    })
