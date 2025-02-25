import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 63 })
  name: string;

  @Column({ unique: true, length: 127 })
  email: string;

  @Column({ length: 127 })
  password: string;

  @Column({ name: "birth_at", type: "date", nullable: true })
  birthAt: string;

  @CreateDateColumn({ name: "create_at" })
  createAt: string;

  @UpdateDateColumn({ name: "update_at" })
  updateAt: string;

  @Column({ enum: [1, 2] })
  role: number;
}
