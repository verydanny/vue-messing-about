import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Hospital {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    length: 200,
  })
  name!: string

  @Column()
  phoneNumber!: string

  @Column()
  address!: string
}
