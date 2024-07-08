import { DataSource, EntitySchema } from "typeorm";

import { Criteria } from "@/contexts/shared/domain/criteria/criteria";
import { DeepPartial } from "@/contexts/shared/domain/deep-partial";
import { Nullable } from "@/contexts/shared/domain/nullable";
import { BooleanValueObject } from "@/contexts/shared/domain/value-object/boolean-value-object";
import { CriteriaToTypeOrmConverter } from "@/contexts/shared/infrastructure/criteria/criteria-to-type-orm-converter";
import { TypeOrmRepository } from "@/contexts/shared/infrastructure/persistence/typeorm/type-orm-repository";

import { Territory } from "../../domain/territory";
import { TerritoryId } from "../../domain/territory-id";
import { TerritoryIsLocked } from "../../domain/territory-is-locked";
import { TerritoryNotFount } from "../../domain/territory-not-fount";
import { TerritoryNumber } from "../../domain/territory-number";
import { TerritoryRepository } from "../../domain/territory-repository";
import { TerritoryEntity } from "./typeorm/territory-entity";

export class TerritoryTypeOrm
  extends TypeOrmRepository<Territory>
  implements TerritoryRepository
{
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  protected entitySchema(): EntitySchema<Territory> {
    return TerritoryEntity;
  }

  async save(territory: Territory): Promise<void> {
    await this.persist(territory);
  }

  async searchAll(): Promise<Array<Territory> | Territory> {
    return await this.repository().find();
  }

  async matching(criteria: Criteria): Promise<Array<Territory> | Territory> {
    const converter = new CriteriaToTypeOrmConverter();
    const converted = converter.convert(criteria);
    let _criteria = {};

    if (
      converted.where?.isLocked &&
      BooleanValueObject.isBoolean(converted.where?.isLocked)
    ) {
      _criteria = {
        where: {
          isLocked: new TerritoryIsLocked(
            BooleanValueObject.parse(converted.where.isLocked),
          ),
        },
      };
    }

    return await this.repository().find({ ...converted, ..._criteria });
  }

  async findByNumber(number: TerritoryNumber): Promise<Nullable<Territory>> {
    return await this.repository().findOneBy({ number });
  }

  async findById(id: TerritoryId): Promise<Nullable<Territory>> {
    return await this.repository().findOneBy({ id });
  }

  async update(id: TerritoryId, data: DeepPartial<Territory>): Promise<void>;
  async update(id: TerritoryId, data: Territory): Promise<void> {
    const { id: withId, ..._data } = data;

    if (withId) {
      await this.repository().save(data);
    } else {
      const territory = await this.repository().preload({ id, ..._data });

      if (!territory) {
        throw new TerritoryNotFount(
          `Territory with id <${id.value}> not found`,
        );
      }

      await this.repository().save(territory);
    }
  }

  async delete(id: TerritoryId): Promise<void> {
    await this.repository().delete({ id });
  }

  async deleteAll(): Promise<void> {
    await this.truncate();
  }
}
