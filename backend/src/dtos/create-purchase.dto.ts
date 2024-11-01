import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Data Transfer Object (DTO) for creating a purchase
 *
 * This DTO is used to encapsulate the data required to create a new purchase.
 * It includes various properties such as store number, gift number, gifter and giftee details,
 * payment information, and optional fields for additional metadata.
 * The DTO ensures that the data is validated and transformed appropriately before being processed.
 */
export class CreatePurchaseDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'Store number' })
  readonly storeNo: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: 'Gift number' })
  readonly giftNo: number;

  @IsOptional()
  @IsString()
  @Length(1, 27)
  @ApiProperty({ required: false, description: 'Purchase number' })
  purchaseNo?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'Gifter member number' })
  gifterNo?: number;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  @ApiProperty({ required: false, description: 'Gifter mobile number' })
  gifterMobile?: string;

  @IsOptional()
  @IsString()
  @Length(1, 80)
  @ApiProperty({ required: false, description: 'Gifter email address' })
  gifterEmail?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'Giftee member number' })
  gifteeNo?: number;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  @ApiProperty({ required: false, description: 'Giftee mobile number' })
  gifteeMobile?: string;

  @IsOptional()
  @IsString()
  @Length(1, 80)
  @ApiProperty({ required: false, description: 'Giftee email address' })
  gifteeEmail?: string;

  @IsOptional()
  @IsString()
  @Length(1, 150)
  @ApiProperty({ required: false, description: 'Gift message' })
  memo?: string;

  @IsString()
  @Length(1, 4)
  @ApiProperty({ description: 'Send method (SM01: Link copy, SM02: SMS)' })
  readonly sendMethod: string;

  @IsString()
  @Length(1, 4)
  @ApiProperty({
    description: 'Payment method (PM01: Credit card, PM02: Bank transfer)',
  })
  readonly payMethod: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'PG company ID' })
  readonly pgId: number;

  @IsOptional()
  @IsString()
  @Length(1, 64)
  @ApiProperty({ required: false, description: 'PG company payment code' })
  readonly pgCode: string;

  @IsOptional()
  @IsString()
  @Length(1, 256)
  @ApiProperty({ required: false, description: 'PG company order number' })
  readonly orderId: string;

  @IsOptional()
  @IsString()
  @Length(1, 256)
  @ApiProperty({ required: false, description: 'PG company order key' })
  readonly paymentKey: string;

  @IsOptional()
  @IsString()
  @Length(1, 1)
  @ApiProperty({
    required: false,
    description: 'Purchase state (C: Completed)',
  })
  readonly state?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'Price' })
  readonly price: number;
}
