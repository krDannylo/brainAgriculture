import { validate } from 'class-validator';
import { CreateHarvestSeasonDto } from './create-harvest-season.dto';

describe('CreateHarvestSeasonDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new CreateHarvestSeasonDto();
    Object.assign(dto, {
      year: '2024',
      farmId: 1,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if year is empty', async () => {
    const dto = new CreateHarvestSeasonDto();
    Object.assign(dto, {
      year: '',
      farmId: 1,
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'year')).toBe(true);
  });

  it('should fail if farmId is not a number', async () => {
    const dto = new CreateHarvestSeasonDto();
    Object.assign(dto, {
      year: '2024',
      farmId: 'abc',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'farmId')).toBe(true);
  });
}); 