import { validate } from 'class-validator';
import { CreateFarmDto } from './create-farm.dto';

describe('CreateFarmDto', () => {
  it('should validate a valid dto', async () => {
    const dto = new CreateFarmDto();
    Object.assign(dto, {
      name: 'Fazenda Teste',
      city: 'Cidade Teste',
      state: 'SP',
      totalArea: 100,
      arableArea: 60,
      vegetationArea: 40,
      farmerId: 1,
      areaControl: true,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is empty', async () => {
    const dto = new CreateFarmDto();
    Object.assign(dto, {
      name: '',
      city: 'Cidade',
      state: 'SP',
      totalArea: 100,
      arableArea: 60,
      vegetationArea: 40,
      areaControl: true,
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'name')).toBe(true);
  });

  it('should fail if state is invalid', async () => {
    const dto = new CreateFarmDto();
    Object.assign(dto, {
      name: 'Fazenda',
      city: 'Cidade',
      state: 'XX',
      totalArea: 100,
      arableArea: 60,
      vegetationArea: 40,
      areaControl: true,
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'state')).toBe(true);
  });

  it('should fail if totalArea is negative', async () => {
    const dto = new CreateFarmDto();
    Object.assign(dto, {
      name: 'Fazenda',
      city: 'Cidade',
      state: 'SP',
      totalArea: -10,
      arableArea: 5,
      vegetationArea: 4,
      areaControl: true,
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'totalArea')).toBe(true);
  });

  it('should fail if sum of arableArea and vegetationArea exceeds totalArea', async () => {
    const dto = new CreateFarmDto();
    Object.assign(dto, {
      name: 'Fazenda',
      city: 'Cidade',
      state: 'SP',
      totalArea: 10,
      arableArea: 8,
      vegetationArea: 5,
      areaControl: true,
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'areaControl')).toBe(true);
  });
}); 