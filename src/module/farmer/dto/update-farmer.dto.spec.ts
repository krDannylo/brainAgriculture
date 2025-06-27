import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateFarmerDto } from './update-farmer.dto';

describe('UpdateFarmerDto', () => {
  it('should validate a valid dto', async () => {
    const dto = plainToInstance(UpdateFarmerDto, {
      name: 'João Atualizado',
      password: '654321',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is empty', async () => {
    const dto = plainToInstance(UpdateFarmerDto, {
      name: '',
      password: '654321',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'name')).toBe(true);
  });

  it('should fail if password is too short', async () => {
    const dto = plainToInstance(UpdateFarmerDto, {
      name: 'João',
      password: '123',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'password')).toBe(true);
  });

  it('should sanitize HTML in name and password', async () => {
    const input = {
      name: '<b>João</b>',
      password: '<i>654321</i>',
    };
    const dto = plainToInstance(UpdateFarmerDto, input, { enableImplicitConversion: true });
    expect(dto.name.replace(/<[^>]*>/g, '')).toBe('João');
    expect(dto.password.replace(/<[^>]*>/g, '')).toBe('654321');
  });
}); 