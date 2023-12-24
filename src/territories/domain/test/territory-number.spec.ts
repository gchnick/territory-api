import { TerritoryNumber } from '../territory-number';
import { TerritoryNumberExceeded } from '../territory-number-exceeded';
import { TerritoryNumberIsNegative } from '../territory-number-is-negative';

describe('Territory should', () => {
  it('throw error when created with a negative number or number greater that one hundred', () => {
    // Arrange
    const negative = -1;
    const greaterThatOneHundred = 123;

    // Act
    const negativeInstace = () => {
      new TerritoryNumber(negative);
    };

    const greaterInstace = () => {
      new TerritoryNumber(greaterThatOneHundred);
    };

    // Assert
    expect(negativeInstace).toThrow(TerritoryNumberIsNegative);
    expect(greaterInstace).toThrow(TerritoryNumberExceeded);
  });
});
