import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateHarvestSeasonDto {

  @IsString()
  @IsNotEmpty()
  readonly year: string

  @IsNumber()
  @IsNotEmpty()
  readonly farmId: number
}