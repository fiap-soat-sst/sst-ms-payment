// src > External > Database > DatabaseAdapter.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import dotenv from 'dotenv'
dotenv.config()

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,    
})

export const DynamoDB = DynamoDBDocumentClient.from(client)

console.log('[DynamoDB]: Connection has been established successfully 🚀')
