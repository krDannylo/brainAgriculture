import { IsValidDocument } from './document.validator';
import { validate } from 'class-validator';

class TestModel {
  @IsValidDocument()
  document: string;
}

describe('IsValidDocument', () => {
  let model: TestModel;

  beforeEach(() => {
    model = new TestModel();
  });

  it('should validate a valid CPF', async () => {
    model.document = '529.982.247-25';
    const errors = await validate(model);
    expect(errors.length).toBe(0);
  });

  it.skip('should validate a valid CNPJ', async () => {
    model.document = '63657305000195';
    const errors = await validate(model);
    expect(errors.length).toBe(0);
  });

  it('should fail with an invalid CPF', async () => {
    model.document = '111.111.111-11';
    const errors = await validate(model);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('IsValidDocument', 'Document must be a valid CPF or CNPJ');
  });

  it('should fail with an invalid CNPJ', async () => {
    model.document = '11.111.111/1111-11';
    const errors = await validate(model);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('IsValidDocument', 'Document must be a valid CPF or CNPJ');
  });

  it('should fail with non-string value', async () => {
    model.document = 12345678901 as any;
    const errors = await validate(model);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('IsValidDocument', 'Document must be a valid CPF or CNPJ');
  });

  it('should fail with empty string', async () => {
    model.document = '';
    const errors = await validate(model);
    expect(errors.length).toBe(1);
    expect(errors[0].constraints).toHaveProperty('IsValidDocument', 'Document must be a valid CPF or CNPJ');
  });
}); 