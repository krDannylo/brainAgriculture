import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateHarvestSeasonDto {

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  readonly farmerId?: number

  @IsString()
  @IsNotEmpty()
  readonly year: string

  @IsNumber()
  @IsNotEmpty()
  readonly farmId: number
}