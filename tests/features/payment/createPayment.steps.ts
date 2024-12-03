import { Given, When, Then } from '@cucumber/cucumber'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import assert from 'assert'
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT
const baseUrl = `http://localhost:${port}/api/payment` // URL do servidor em execução

let response: request.Response
let token: string
let payment: any = {}

const jwtSecret = process.env.JWT_SECRET || ''

Given('que o cliente não se identifica', async () => {
    token = jwt.sign({ name: 'Teste', type: 'UNREGISTERED' }, jwtSecret)
})

Given('que o cliente se identifica via CPF {string}', async (cpf: string) => {
    token = jwt.sign({ name: 'Teste', user_name: 'Teste', type: 'REGISTERED', cpf }, jwtSecret)
    payment.cpf = cpf
})

When('o sistema cria o pagamento com o ID {string} e o valor {string}', async (orderId: string, value: string) => {
    payment.orderId = orderId
    payment.total = parseFloat(value)
    response = await request(baseUrl)
        .post('/checkout')
        .set({ 'token': token })
        .send(payment)
})

Then('o pagamento é criado com sucesso', () => {
    assert.equal(response.status, 200)
    assert.equal(response.body.status, 'Pagamento Iniciado')
})