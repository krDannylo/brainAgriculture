import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { cpf, cnpj } from 'cpf-cnpj-validator';

export function IsValidDocument(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidDocument',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          return cpf.isValid(value) || cnpj.isValid(value);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Document must be a valid CPF or CNPJ';
        },
      },
    });
  };
}