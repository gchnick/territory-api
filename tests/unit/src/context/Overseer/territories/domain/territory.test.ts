import { Territory } from "@/contexts/Overseer/territories/domain/territory";

import { TerritoryMother } from "./territory-mother";

describe("Territory should", () => {
  it("change its bloking status to lock", () => {
    const territory: Territory = TerritoryMother.create({ isLocked: false });

    const territoryLocked = territory.lock();

    const statusExpected = true;
    expect(territoryLocked.isLocked.value).toBe(statusExpected);
  });

  it("change its bloking status to unlock and update last date completed", () => {
    const territory: Territory = TerritoryMother.create({ isLocked: true });
    const closedDate = new Date("2023-12-23");

    const territoryUnlocked = territory.unlock(closedDate);

    const statusExpected = false;
    expect(territoryUnlocked.isLocked.value).toBe(statusExpected);
    expect(territoryUnlocked.lastDateCompleted.value).toBe(closedDate);
  });
});
