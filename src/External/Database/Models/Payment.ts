import { Entity, Column, ObjectIdColumn } from 'typeorm'
import { ObjectId } from 'mongodb'

@Entity()
export class Payment {
    @ObjectIdColumn()
    id!: ObjectId

    @Column()
    orderId: string

    @Column({ length: 255 })
    status: string
}
