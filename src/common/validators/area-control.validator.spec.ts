import { isValidFarmArea } from './area-control.validator';
import { validate } from 'class-validator';

class TestModel {
  totalArea: number;
  arableArea: number;
  vegetationArea: number;

  @isValidFarmArea({
    message: 'The sum of arableArea and vegetationArea must not exceed totalArea'
  })
  areaControl: boolean;
}

describe('isValidFarmArea', () => {
  let model: TestModel;

  beforeEach(() => {
    model = new TestModel();
    model.areaControl = true;
  });

  it('should validate when sum of areas is equal to total area', async () => {
    model.totalArea = 100;
    model.arableArea = 60;
    model.vegetationArea = 40;
    const errors = await validate(model);
    expect(errors.length).toBe(0);
  });

  it('should validate when sum of areas is less than total area', async () => {
    model.totalArea = 100;
    model.arableArea = 50;
    model.vegetationArea = 30;
    const errors = await validate(model);
    expect(errors.length).toBe(0);
  });

  it('should fail when sum of areas exceeds total area', async () => {
    model.totalArea = 100;
    model.arableArea = 60;
    model.vegetationArea = 50;
    const errors = await validate(model);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty(
      'isValidFarmArea',
      'The sum of arableArea and vegetationArea must not exceed totalArea'
    );
  });

  it('should validate when areas are zero', async () => {
    model.totalArea = 0;
    model.arableArea = 0;
    model.vegetationArea = 0;
    const errors = await validate(model);
    expect(errors.length).toBe(0);
  });

  it('should validate when some areas are undefined', async () => {
    model.totalArea = undefined;
    model.arableArea = undefined;
    model.vegetationArea = undefined;
    const errors = await validate(model);
    expect(errors.length).toBe(0);
  });

  it('should validate with decimal values', async () => {
    model.totalArea = 100.5;
    model.arableArea = 50.25;
    model.vegetationArea = 50.25;
    const errors = await validate(model);
    expect(errors.length).toBe(0);
  });

  it('should fail with negative values that sum correctly', async () => {
    model.totalArea = -100;
    model.arableArea = -60;
    model.vegetationArea = -40;
    const errors = await validate(model);
    expect(errors.length).toBe(1);
  });
}); 