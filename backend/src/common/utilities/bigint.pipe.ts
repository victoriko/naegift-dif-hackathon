import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseBigIntPipe implements PipeTransform {
  transform(value: string): bigint {
    const isNumeric = /^-?\d+$/.test(value);
    if (!isNumeric) {
      throw new BadRequestException(
        'Validation failed (numeric string is expected)',
      );
    }
    return BigInt(value);
  }
}
