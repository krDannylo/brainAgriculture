import { IsNotEmpty, IsNumber, isNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateCropDto {

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly harvestSeasonId: number;
}