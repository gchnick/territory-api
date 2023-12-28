import { TerritoryNumber } from '@territories/domain/territory-number';
import { TerritoryNumberExceeded } from '@territories/domain/territory-number-exceeded';
import { TerritoryNumberIsNegative } from '@territories/domain/territory-number-is-negative';

describe('TerritoryNumber should', () => {
  it('throw error when value is a negative number', () => {
    // Arrange
    const negative = -1;

    // Act
    const negativeInstace = () => {
      new TerritoryNumber(negative);
    };

    // Assert
    expect(negativeInstace).toThrow(TerritoryNumberIsNegative);
  });

  it('throw error when value greater that one hundred', () => {
    // Arrange
    const greaterThatOneHundred = 123;

    // Act
    const greaterInstace = () => {
      new TerritoryNumber(greaterThatOneHundred);
    };

    // Assert
    expect(greaterInstace).toThrow(TerritoryNumberExceeded);
  });
});
