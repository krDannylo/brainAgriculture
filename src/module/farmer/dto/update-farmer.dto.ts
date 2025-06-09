import { CreateFarmerDto } from "./create-farmer.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateFarmerDto extends PartialType(CreateFarmerDto) {

}