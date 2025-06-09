import { Farm } from '@prisma/client';
import { ResponseFarmDto } from '../dto/response-farm.dto';

export function mapFarmToResponseDto(farm: Farm): ResponseFarmDto {
  return {
    ...farm,
    totalArea: farm.totalArea.toNumber(),
    arableArea: farm.arableArea.toNumber(),
    vegetationArea: farm.vegetationArea.toNumber(),
  };
}