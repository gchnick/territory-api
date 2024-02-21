import { Column, Entity, PrimaryColumn } from "typeorm";

import { User } from "./user.entity";

@Entity({
  name: "roles",
})
export class Role {
  @PrimaryColumn("urowid")
  id!: string;

  @Column({ unique: true })
  role!: string;

  // @ManyToOne() FIXME: Implement
  user!: User;
}
