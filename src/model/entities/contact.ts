import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    length: 200,
  })
  subject!: string

  @Column()
  email!: string

  @Column()
  message!: string

  @Column()
  hospitalId!: number
}
