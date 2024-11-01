import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsOptional,
  IsDate,
  IsNumber,
} from 'class-validator';
import { PageRequest } from '../common/pagination/page.request';
import { Type } from 'class-transformer';

/**
 * Data Transfer Object (DTO) for finding purchases
 *
 * This DTO is used to encapsulate the data required to find and filter purchases.
 * It extends the PageRequest class to include pagination properties and adds
 * various optional filters such as store number, gift ID, date range, state, and payment details.
 * The DTO ensures that the data is validated and transformed appropriately before being processed.
 */
export class FindPurchasesDto extends PageRequest {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'Store number' })
  storeNo?: number;

  @IsOptional()
  @IsString()
  @Length(1, 64)
  @ApiProperty({ required: false, description: 'Gift ID' })
  giftId?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    required: false,
    description:
      'Start date for the query period (based on payment date) (YYYY-MM-DD)',
  })
  startDttm?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    required: false,
    description:
      'End date for the query period (based on payment date) (YYYY-MM-DD)',
  })
  endDttm?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 4)
  @ApiProperty({ required: false, description: 'State (common code [NG10])' })
  state?: string;

  @IsOptional()
  @IsString()
  @Length(1, 256)
  @ApiProperty({
    required: false,
    description: 'Order number from the PG company',
  })
  orderId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 256)
  @ApiProperty({
    required: false,
    description: 'Order key from the PG company',
  })
  paymentKey?: string;
}
