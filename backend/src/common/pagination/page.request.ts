import { Type } from 'class-transformer';
import { IsString, IsOptional, Length, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PageRequest {
  /**
   * Page number for pagination
   * Defaults to 1 if not provided
   */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Page number', required: false })
  pageNo?: number = 1;

  /**
   * Sort order for pagination
   * Can be 'asc' for ascending or 'desc' for descending
   * Defaults to 'desc' if not provided
   */
  @IsString()
  @IsOptional()
  @Length(3, 4)
  @ApiProperty({
    description: 'Sort order (asc: ascending, desc: descending)',
    required: false,
  })
  sortOrd?: string = 'desc';

  /**
   * Cursor for pagination
   * Used for cursor-based pagination
   */
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Cursor for pagination', required: false })
  cursor?: string;

  /**
   * Page size for pagination
   * Defaults to 10 if not provided
   */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Page size', required: false })
  pageSize?: number = 10;

  /**
   * Calculate the offset for pagination
   *
   * @returns The offset value
   */
  getOffset(): number {
    return (this.pageNo! - 1) * this.pageSize!;
  }

  /**
   * Get the limit for pagination
   *
   * @returns The limit value
   */
  getLimit(): number {
    return this.pageSize!;
  }
}
