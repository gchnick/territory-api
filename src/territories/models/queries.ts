import { prisma } from '../../config/connection';

/**
 *
 * @param id territory id
 */
export const assignedLockQuery = (id: string) => {
  return prisma.territories.update({
    where: { id },
    data: { assigned_lock: true }
  });
};

/**
 *
 * @param id territory id
 * @param last_date_completed last data of completed
 */
export const assignedUnlockQuery = (id: string, last_date_completed: Date) => {
  return prisma.territories.update({
    where: { id },
    data: { last_date_completed, assigned_lock: false }
  });
};
