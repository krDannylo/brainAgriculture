import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { BR_STATE_CODES } from '../utils/br-states.utils';

export function IsUF(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isUF',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'string' &&
            BR_STATE_CODES.includes(value.toUpperCase())
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `"${args.value}" UF Invalid`;
        },
      },
    });
  };
}