import { IsUF } from './state-uf.validator';
import { validate } from 'class-validator';

class TestModel {
  @IsUF()
  state: string;
}

describe('IsUF', () => {
  let model: TestModel;

  beforeEach(() => {
    model = new TestModel();
  });

  it('should validate valid UF codes', async () => {
    const validUFs = ['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS', 'MS', 'MT', 'GO', 'DF',
      'BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA', 'PA', 'AP',
      'AM', 'RR', 'RO', 'AC', 'TO'];

    for (const uf of validUFs) {
      model.state = uf;
      const errors = await validate(model);
      expect(errors.length).toBe(0);
    }
  });

  it('should fail with invalid UF code', async () => {
    model.state = 'XX';
    const errors = await validate(model);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isUF', 'state must be a valid UF code');
  });

  it('should fail with lowercase UF code', async () => {
    model.state = 'sp';
    const errors = await validate(model);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isUF', 'state must be a valid UF code');
  });

  it('should fail with non-string value', async () => {
    model.state = 123 as any;
    const errors = await validate(model);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isUF', 'state must be a valid UF code');
  });

  it('should fail with empty string', async () => {
    model.state = '';
    const errors = await validate(model);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isUF', 'state must be a valid UF code');
  });

  it('should fail with invalid length', async () => {
    model.state = 'SPP';
    const errors = await validate(model);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('isUF', 'state must be a valid UF code');
  });
}); 