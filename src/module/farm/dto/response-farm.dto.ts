export class ResponseFarmDto {
  id: number;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  farmerId: number | null;
  createdAt: Date;
  updatedAt: Date;
}