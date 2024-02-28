import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
  name: "territories",
})
export class Territory {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({
    type: "smallint",
    unique: true,
    nullable: false,
  })
  number!: number;

  @Column({
    type: "varchar",
    length: 200,
    nullable: false,
  })
  label!: string;

  @Column({
    type: "varchar",
    length: 200,
    nullable: true,
  })
  sector!: string;

  @Column({
    name: "quantity_house",
    type: "smallint",
    nullable: true,
    default: 0,
  })
  quantityHouse!: number;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
  })
  locality!: string;

  @Column({
    name: "locality_in_part",
    type: "varchar",
    length: 255,
    nullable: false,
  })
  localityInPart!: string;

  @Column({
    name: "url_map_image",
    type: "varchar",
    nullable: true,
  })
  urlMapImage!: string;

  @Column({
    name: "last_date_completed",
    type: "date",
    nullable: false,
  })
  lastDateCompleted!: Date;

  @Column({
    name: "assigned_lock",
    type: "bool",
    nullable: false,
    default: false,
  })
  assignedLock!: boolean;
}
