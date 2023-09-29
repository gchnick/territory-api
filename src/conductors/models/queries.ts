import { prisma } from '../../config/connection';

export const setLastDateAssignedQuery = (
  id: string,
  last_date_assigned: Date
) => {
  return prisma.conductors.update({
    where: { id },
    data: { last_date_assigned }
  });
};
