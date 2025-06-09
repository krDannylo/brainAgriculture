import { PartialType } from "@nestjs/mapped-types";
import { CreateFarmDto } from "./create-farm.dto";
import { isValidFarmArea } from "src/common/validators/area-control.validator";

export class UpdateFarmDto extends PartialType(CreateFarmDto) {
  @isValidFarmArea({
    message: 'The sum of arableArea and vegetationArea must not exceed totalArea',
  })
  readonly areaVerify?: boolean;
}