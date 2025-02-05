import { Territory } from "@/contexts/Overseer/territories/domain/territory";

import { TerritoryMother } from "./territory-mother";

describe.only("Territory should", () => {
  it("change its status to assigned", () => {
    const territory: Territory = TerritoryMother.create({
      currentAssigned: false,
    });

    const territoryLocked = territory.assigned();

    const statusExpected = true;
    expect(territoryLocked.currentAssigned.value).toBe(statusExpected);
  });

  it("change its status to unassigned and update last date completed", () => {
    const territory: Territory = TerritoryMother.create({
      currentAssigned: true,
    });
    const closedDate = new Date("2023-12-23");

    const territoryUnlocked = territory.unassigned(closedDate);

    const statusExpected = false;
    expect(territoryUnlocked.currentAssigned.value).toBe(statusExpected);
    expect(territoryUnlocked.lastDateCompleted.value).toBe(closedDate);
  });
});
