import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

import { Role } from "./role.entity";

@Entity({
  name: "users",
})
export class User {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  name!: string;

  @Column({
    type: "text",
    unique: true,
  })
  email!: string;

  @Column({ type: "text" })
  password!: string;

  @Column({ type: "bool" })
  enabled!: boolean;

  @Column({ type: "bool" })
  verified!: boolean;

  @OneToMany(() => Role, r => r.role)
  roles!: Role[];
}
