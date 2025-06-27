import { validate } from 'class-validator';
import { CreateCropDto } from './create-crop.dto';

describe('CreateCropDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new CreateCropDto();
    Object.assign(dto, {
      name: 'Milho',
      harvestSeasonId: 1,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is empty', async () => {
    const dto = new CreateCropDto();
    Object.assign(dto, {
      name: '',
      harvestSeasonId: 1,
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'name')).toBe(true);
  });

  it('should fail if harvestSeasonId is not a number', async () => {
    const dto = new CreateCropDto();
    Object.assign(dto, {
      name: 'Milho',
      harvestSeasonId: 'abc',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'harvestSeasonId')).toBe(true);
  });
}); 