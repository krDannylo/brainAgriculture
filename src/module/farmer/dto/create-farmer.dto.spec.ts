import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateFarmerDto } from './create-farmer.dto';

describe('CreateFarmerDto', () => {
  it('should validate a valid dto', async () => {
    const dto = plainToInstance(CreateFarmerDto, {
      name: 'João da Silva',
      document: '529.982.247-25',
      email: 'joao@email.com',
      password: '123456',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is empty', async () => {
    const dto = plainToInstance(CreateFarmerDto, {
      name: '',
      document: '529.982.247-25',
      email: 'joao@email.com',
      password: '123456',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'name')).toBe(true);
  });

  it('should fail if document is invalid', async () => {
    const dto = plainToInstance(CreateFarmerDto, {
      name: 'João',
      document: '111.111.111-11',
      email: 'joao@email.com',
      password: '123456',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'document')).toBe(true);
  });

  it('should fail if email is invalid', async () => {
    const dto = plainToInstance(CreateFarmerDto, {
      name: 'João',
      document: '529.982.247-25',
      email: 'not-an-email',
      password: '123456',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBe(true);
  });

  it('should fail if password is too short', async () => {
    const dto = plainToInstance(CreateFarmerDto, {
      name: 'João',
      document: '529.982.247-25',
      email: 'joao@email.com',
      password: '123',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'password')).toBe(true);
  });

  it('should sanitize HTML in name, document, email, and password', async () => {
    const input = {
      name: '<b>João</b>',
      document: '529.982.247-25',
      email: '<script>alert(1)</script>@email.com',
      password: '<i>123456</i>',
    };
    const dto = plainToInstance(CreateFarmerDto, input, { enableImplicitConversion: true });
    expect(dto.name.replace(/<[^>]*>/g, '')).toBe('João');
    expect(dto.email.replace(/<[^>]*>/g, '')).toBe('@email.com');
    expect(dto.password.replace(/<[^>]*>/g, '')).toBe('123456');
  });
}); 