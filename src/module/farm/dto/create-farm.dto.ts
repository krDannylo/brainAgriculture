import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { isValidFarmArea } from "../../../common/validators/area-control.validator";
import { IsUF } from "../../../common/validators/state-uf.validator";

export class CreateFarmDto {

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @IsString()
  @IsNotEmpty()
  @IsUF()
  readonly state: string;

  @IsNumber()
  @IsPositive()
  readonly totalArea: number;

  @IsNumber()
  @IsPositive()
  readonly arableArea: number;

  @IsNumber()
  @IsPositive()
  readonly vegetationArea: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly farmerId?: number;

  @isValidFarmArea({ message: "Invalid sum area" })
  readonly areaControl: boolean;
}