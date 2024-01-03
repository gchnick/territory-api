import { TerritoryMother } from './territory.mother';

describe('Territory should', () => {
  it('change its bloking status to lock', () => {
    // Arrange
    const territory = TerritoryMother.create({ isLocked: false });

    // Act
    const territoryLocked = territory.lock();

    // Assert
    const statusExpected = true;
    expect(territoryLocked.isLocked.value).toBe(statusExpected);
  });

  it('change its bloking status to unlock and update last date completed', () => {
    // Arrange
    const territory = TerritoryMother.create({ isLocked: true });
    const closedDate = new Date('2023-12-23');

    // Act
    const territoryUnlocked = territory.unlock(closedDate);

    // Assert
    const statusExpected = false;
    expect(territoryUnlocked.isLocked.value).toBe(statusExpected);
    expect(territoryUnlocked.lastDateCompleted.value).toBe(closedDate);
  });
});
