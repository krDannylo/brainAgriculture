import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class NonEmptyBodyPipe implements PipeTransform {
  private readonly ignoredKeys = ['areaVerify'];

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    if (!this.hasValidKeys(value)) {
      throw new BadRequestException('Request body should not be empty');
    }

    return value;
  }

  private hasValidKeys(body: any): boolean {
    if (typeof body !== 'object' || body === null) return false;

    return Object.keys(body).some(key => !this.ignoredKeys.includes(key));
  }
}