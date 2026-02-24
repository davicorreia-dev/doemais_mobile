import { IsNotEmpty, IsEmail, MinLength, IsString, IsPhoneNumber, IsDate, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDoadorDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  nome!: string;

  @IsEmail({}, { message: 'O e-mail informado não é válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @IsString({ message: 'O CPF deve ser uma string.' })
  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  cpf!: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  senha!: string;

  @IsString({ message: 'O telefone deve ser uma string.' })
  @IsPhoneNumber('BR', { message: 'O telefone informado não é válido.' })
  @IsOptional()
  telefone?: string;

  @IsOptional()
  @Type(() => Date)  // Converte a string para Date
  @IsDate({ message: 'A data de nascimento deve ser uma data válida.' })
  data_nascimento?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'O peso deve ser um número válido.' })
  peso_kg?: number;

  @IsString({ message: 'O gênero deve ser uma string.' })
  @IsOptional()
  genero?: string;

  @IsString({ message: 'O tipo sanguíneo deve ser uma string.' })
  @IsOptional()
  tipo_sanguineo?: string;
}

export class LoginDoadorDto {
  @IsEmail({}, { message: 'O e-mail informado não é válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email!: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  senha!: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'O refresh token é obrigatório.' })
  refreshToken!: string;
}