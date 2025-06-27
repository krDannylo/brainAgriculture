import { validate } from 'class-validator';
import { UpdateHarvestSeasonDto } from './update-harvest-season.dto';

describe('UpdateHarvestSeasonDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new UpdateHarvestSeasonDto();
    Object.assign(dto, {
      year: '2025',
      farmId: 2,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if year is empty', async () => {
    const dto = new UpdateHarvestSeasonDto();
    Object.assign(dto, {
      year: '',
      farmId: 2,
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'year')).toBe(true);
  });

  it('should fail if farmId is not a number', async () => {
    const dto = new UpdateHarvestSeasonDto();
    Object.assign(dto, {
      year: '2025',
      farmId: 'xyz',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'farmId')).toBe(true);
  });
}); 