import { TerritoryLabel } from '@territories/domain/territory-label';
import { TerritoryLabelIsEmpty } from '@territories/domain/territory-label-is-empty';
import { TerritoryLabelLengthExceeded } from '@territories/domain/territory-label-length-exceeded';

describe('TerritoryLabel should', () => {
  it('throw error when label is empty', () => {
    // Arrange
    const labelEmpty = '      ';
    // Act
    const labelInstace = () => {
      new TerritoryLabel(labelEmpty);
    };

    // Assert
    expect(labelInstace).toThrow(TerritoryLabelIsEmpty);
  });

  it('throw error when label lenght exceeded 100 characters', () => {
    // Arrange
    const label =
      'This is a label length exceeded 50 characters. This value is invalid';
    // Act
    const labelInstace = () => {
      new TerritoryLabel(label);
    };

    // Assert
    expect(labelInstace).toThrow(TerritoryLabelLengthExceeded);
  });
});
