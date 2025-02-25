import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "src/enums/role.enum";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 63 })
  name: string;

  @Column({ unique: true, length: 127 })
  email: string;

  @Column({ length: 127 })
  password: string;

  @Column({ name: "birth_at", type: "date", nullable: true })
  birthAt: Date;

  @CreateDateColumn({ name: "create_at" })
  createAt: string;

  @UpdateDateColumn({ name: "update_at" })
  updateAt: string;

  @Column({ enum: Role, default: Role.USER })
  role: number;
}	