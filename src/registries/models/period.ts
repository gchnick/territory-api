import { prisma } from '../../config/connection';
import { LastPeriodNotFount, PeriodIsStart, PeriodNotFount } from './errors';
import { PartialPeriod, Period, PeriodEntity } from './types';

class PeriodModel {
  getById = async (id: string) => {
    const period = await prisma.registry_periods.findFirst({
      where: { id },
    });

    if (!period) {
      throw new PeriodNotFount(`Period with id '${id}' not found`);
    }

    return this.#toModel(period);
  };

  getCurrent = async () => {
    const currentPeriod = await prisma.registry_periods.findFirst({
      where: { finish_date: null },
    });

    if (!currentPeriod) {
      throw new LastPeriodNotFount(
        'Current registry period not found. Please, create a period'
      );
    }

    return this.#toModel(currentPeriod);
  };

  create = async (data: Period) => {
    const isStartPeriod = await prisma.registry_periods.findFirst({
      where: { finish_date: null },
    });

    if (isStartPeriod) {
      throw new PeriodIsStart('Period is start. Please, use current period');
    }

    const newPeriod = await prisma.registry_periods.create({
      data: {
        start_date: data.startDate ?? new Date(),
        description: data.description,
      },
    });

    return this.#toModel(newPeriod);
  };

  update = async (period: Period, data: PartialPeriod) => {
    const updatedPeriod = await prisma.registry_periods.update({
      where: { id: period.id },
      data: {
        description: data.description,
        finish_date: data.finishDate,
      },
    });

    return this.#toModel(updatedPeriod);
  };

  finishLast = async (currentPeriod: Period) => {
    const finishedPeriod = await prisma.registry_periods.update({
      where: { id: currentPeriod.id },
      data: { finish_date: new Date() },
    });

    return this.#toModel(finishedPeriod);
  };

  delete = async (id: string) => {
    try {
      await prisma.registry_periods.delete({ where: { id } });
    } catch (e) {
      console.log(`Period with id '${id}' not found`);
      console.log(e);
    }
  };

  #toModel(entity: PeriodEntity): Period {
    return {
      id: entity.id,
      description: entity.description,
      startDate: entity.start_date,
      finishDate: entity.finish_date ?? undefined,
    };
  }
}

export const periodModel = new PeriodModel();
