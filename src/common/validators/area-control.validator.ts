import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function isValidFarmArea(validationOptions: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidFarmArea',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(_: any, args: ValidationArguments) {
          const obj = args.object as any;

          if (
            obj.totalArea !== undefined &&
            obj.arableArea !== undefined &&
            obj.vegetationArea !== undefined
          ) {
            return obj.arableArea + obj.vegetationArea <= obj.totalArea;
          }

          return true;
        },
        defaultMessage(): string {
          return 'The sum of arableArea and vegetationArea must not exceed totalArea';
        },
      },
    });
  };
}