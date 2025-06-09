import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { NonEmptyBodyPipe } from './non-empy-body.pipe';

describe('NonEmptyBodyPipe', () => {
  let pipe: NonEmptyBodyPipe;
  let metadata: ArgumentMetadata;

  beforeEach(() => {
    pipe = new NonEmptyBodyPipe();
    metadata = {
      type: 'body',
      metatype: Object,
      data: ''
    };
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should pass through non-body metadata types', () => {
    const value = { test: 'value' };
    const paramMetadata: ArgumentMetadata = {
      type: 'param',
      metatype: Object,
      data: ''
    };

    expect(pipe.transform(value, paramMetadata)).toBe(value);
  });

  it('should pass valid body with non-ignored keys', () => {
    const value = { name: 'Test', description: 'Test description' };
    expect(pipe.transform(value, metadata)).toEqual(value);
  });

  it('should pass body with both ignored and non-ignored keys', () => {
    const value = { name: 'Test', areaVerify: true };
    expect(pipe.transform(value, metadata)).toEqual(value);
  });

  it('should throw BadRequestException for empty body', () => {
    const value = {};
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
    expect(() => pipe.transform(value, metadata)).toThrow('Request body should not be empty');
  });

  it('should throw BadRequestException for null body', () => {
    const value = null;
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
    expect(() => pipe.transform(value, metadata)).toThrow('Request body should not be empty');
  });

  it('should throw BadRequestException for body with only ignored keys', () => {
    const value = { areaVerify: true };
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
    expect(() => pipe.transform(value, metadata)).toThrow('Request body should not be empty');
  });
}); 