import { readFile } from "node:fs/promises";

import { Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { DataSource } from "typeorm";

@Controller("seed")
export class SeedController {
  constructor(private readonly _dataSource: DataSource) {}

  @Post("/run")
  @HttpCode(HttpStatus.OK)
  async run() {
    const query = await readFile("data-seed.sql", "utf8");
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.manager.query(query);
  }
}
