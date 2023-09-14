import { prisma } from '../../config/connection';
import { LastPeriodNotFount } from './errors';
import { PartialPeriod, Period, PeriodEntity } from './types';

class PeriodModel {
  async create(data: Period) {
    const newPeriod = await prisma.registry_periods.create({
      data: {
        start_date: data.startDate ?? new Date(),
        description: data.description
      }
    });

    return this.#toModel(newPeriod);
  }

  async update(id: string, data: PartialPeriod) {
    const updatedPeriod = await prisma.registry_periods.update({
      where: { id },
      data: {
        description: data.description,
        finish_date: data.finishDate
      }
    });

    return this.#toModel(updatedPeriod);
  }

  async finishLast() {
    const lastPeriod = await prisma.registry_periods.findFirst({
      where: { finish_date: null },
      select: { id: true }
    });

    if (!lastPeriod) {
      throw new LastPeriodNotFount(`Last registry period not found`);
    }

    const finishedPeriod = await prisma.registry_periods.update({
      where: { id: lastPeriod.id },
      data: { finish_date: new Date() }
    });

    return this.#toModel(finishedPeriod);
  }

  async delete(id: string) {
    const period = await prisma.registry_periods.findFirst({ where: { id } });
    period &&
      (await prisma.registry_periods.delete({ where: { id: period.id } }));
  }

  #toModel(entity: PeriodEntity): Period {
    return {
      id: entity.id,
      description: entity.description,
      startDate: entity.start_date,
      finishDate: entity.finish_date ?? undefined
    };
  }
}

export const periodModel = new PeriodModel();
