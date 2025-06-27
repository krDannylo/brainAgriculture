import { IsEmail, IsNotEmpty, isNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { IsValidDocument } from "src/common/validators/document.validator";
import sanitizeHtml from 'sanitize-html';
import { Transform } from "class-transformer";

export class CreateFarmerDto {

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }) => sanitizeHtml(value))
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsValidDocument({ message: 'Document must be a valid CPF or CNPJ' })
  @Transform(({ value }) => sanitizeHtml(value))
  readonly document: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => sanitizeHtml(value))
  readonly email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @Transform(({ value }) => sanitizeHtml(value))
  password: string
}

