import { PartialType } from "@nestjs/mapped-types";
import { CreateHarvestSeasonDto } from "./create-harvest-season.dto";

export class UpdateHarvestSeasonDto extends PartialType(CreateHarvestSeasonDto) { }