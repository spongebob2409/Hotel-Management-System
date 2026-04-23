import {
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsString() guestId: string | undefined;
  @IsString() roomId: string | undefined;
  @IsDateString() checkIn: string | undefined;
  @IsDateString() checkOut: string | undefined;
  @IsOptional() @IsInt() @Min(1) adults?: number;
  @IsOptional() @IsInt() @Min(0) children?: number;
  @IsOptional() @IsBoolean() parkingEnabled?: boolean;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() paymentMethod?: string;
}
