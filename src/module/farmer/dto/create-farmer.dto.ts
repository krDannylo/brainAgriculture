import { IsNotEmpty, isNotEmpty, IsString, Matches, MinLength } from "class-validator";
import { IsValidDocument } from "src/common/validators/document.validator";

export class CreateFarmerDto {

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsValidDocument({ message: 'Document must be a valid CPF or CNPJ' })
  readonly document: string;
}

