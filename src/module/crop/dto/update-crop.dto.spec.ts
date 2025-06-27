import { validate } from 'class-validator';
import { UpdateCropDto } from './update-crop.dto';

describe('UpdateCropDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new UpdateCropDto();
    Object.assign(dto, {
      name: 'Soja',
      harvestSeasonId: 2,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is empty', async () => {
    const dto = new UpdateCropDto();
    Object.assign(dto, {
      name: '',
      harvestSeasonId: 2,
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'name')).toBe(true);
  });

  it('should fail if harvestSeasonId is not a number', async () => {
    const dto = new UpdateCropDto();
    Object.assign(dto, {
      name: 'Soja',
      harvestSeasonId: 'xyz',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'harvestSeasonId')).toBe(true);
  });
}); 