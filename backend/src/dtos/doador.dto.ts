/**
 * Data Transfer Objects para operações de Doador
 * 
 * Cada DTO é especializado para um caso de uso específico:
 * - RegisterDoadorDto: Criação de conta
 * - LoginDoadorDto: Autenticação
 * - UpdateDoadorDto: Atualização de perfil
 * - RefreshTokenDto: Renovação de token
 */

import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsString,
  IsPhoneNumber,
  IsDate,
  IsOptional,
  IsNumber,
  Matches,
  MaxLength,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  IsCPF,
  IsValidDonorAge,
  IsValidDonorWeight,
  IsValidBloodType,
} from '../utils/validators';

/**
 * DTO para registro de novo doador
 */
export class RegisterDoadorDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres.' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
  @Matches(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/, {
    message: 'O nome deve conter apenas letras e espaços.',
  })
  nome!: string;

  @IsEmail({}, { message: 'O e-mail informado não é válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @MaxLength(100, { message: 'O e-mail deve ter no máximo 100 caracteres.' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @IsString({ message: 'O CPF deve ser uma string.' })
  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  @IsCPF({ message: 'O CPF informado é inválido.' })
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  cpf!: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  @MaxLength(128, { message: 'A senha deve ter no máximo 128 caracteres.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message:
        'A senha deve conter: uma letra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&).',
    }
  )
  senha!: string;

  @IsString({ message: 'O telefone deve ser uma string.' })
  @IsPhoneNumber('BR', { message: 'O telefone informado não é válido.' })
  @IsOptional()
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  telefone?: string;

  @IsString({ message: 'A cidade deve ser uma string.' })
  @IsOptional()
  @MinLength(2, { message: 'O nome da cidade deve ter no mínimo 2 caracteres.' })
  @MaxLength(50, { message: 'O nome da cidade deve ter no máximo 50 caracteres.' })
  cidade?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'A data de nascimento deve ser uma data válida.' })
  @IsValidDonorAge()
  data_nascimento?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'O peso deve ser um número válido.' })
  @Min(50, { message: 'O peso mínimo é 50 kg.' })
  @Max(150, { message: 'O peso máximo é 150 kg.' })
  @IsValidDonorWeight()
  peso_kg?: number;

  @IsString({ message: 'O gênero deve ser uma string.' })
  @IsOptional()
  @IsEnum(['M', 'F', 'Outro'], { message: 'O gênero deve ser M, F ou Outro.' })
  genero?: string;

  @IsString({ message: 'O tipo sanguíneo deve ser uma string.' })
  @IsOptional()
  @IsValidBloodType()
  tipo_sanguineo?: string;
}

/**
 * DTO para login de doador
 */
export class LoginDoadorDto {
  @IsEmail({}, { message: 'O e-mail informado não é válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  senha!: string;
}

/**
 * DTO para refresh de token
 */
export class RefreshTokenDto {
  @IsString({ message: 'O refresh token deve ser uma string.' })
  @IsNotEmpty({ message: 'O refresh token é obrigatório.' })
  refreshToken!: string;
}

/**
 * DTO para atualização de perfil de doador
 * Todos os campos são opcionais pois é para atualização parcial
 */
export class UpdateDoadorDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsOptional()
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres.' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
  nome?: string;

  @IsEmail({}, { message: 'O e-mail informado não é válido.' })
  @IsOptional()
  @MaxLength(100, { message: 'O e-mail deve ter no máximo 100 caracteres.' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  @IsString({ message: 'O telefone deve ser uma string.' })
  @IsPhoneNumber('BR', { message: 'O telefone informado não é válido.' })
  @IsOptional()
  @Transform(({ value }) => value?.replace(/\D/g, ''))
  telefone?: string;

  @IsString({ message: 'A cidade deve ser uma string.' })
  @IsOptional()
  @MinLength(2, { message: 'O nome da cidade deve ter no mínimo 2 caracteres.' })
  @MaxLength(50, { message: 'O nome da cidade deve ter no máximo 50 caracteres.' })
  cidade?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'A data de nascimento deve ser uma data válida.' })
  @IsValidDonorAge()
  data_nascimento?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'O peso deve ser um número válido.' })
  @Min(50, { message: 'O peso mínimo é 50 kg.' })
  @Max(150, { message: 'O peso máximo é 150 kg.' })
  @IsValidDonorWeight()
  peso_kg?: number;

  @IsString({ message: 'O gênero deve ser uma string.' })
  @IsOptional()
  @IsEnum(['M', 'F', 'Outro'], { message: 'O gênero deve ser M, F ou Outro.' })
  genero?: string;

  @IsString({ message: 'O tipo sanguíneo deve ser uma string.' })
  @IsOptional()
  @IsValidBloodType()
  tipo_sanguineo?: string;
}

/**
 * DTO para formulário de elegibilidade de doação
 * Contém questões médicas para determinar se o doador pode doar
 */
export class CreateFormularioElegibilidadeDto {
  @IsOptional()
  @Type(() => Boolean)
  teve_resfriado?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'A data deve ser válida.' })
  data_fim_sintomas_resfriado?: Date;

  @IsOptional()
  @Type(() => Boolean)
  esta_gravida?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'A data deve ser válida.' })
  data_parto?: Date;

  @IsOptional()
  @Type(() => Boolean)
  esta_amamentando?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  fez_tatuagem?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'A data deve ser válida.' })
  data_tatuagem?: Date;

  @IsOptional()
  @Type(() => Boolean)
  fez_piercing?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'A data deve ser válida.' })
  data_piercing?: Date;

  @IsOptional()
  @Type(() => Boolean)
  esteve_area_malaria?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'A data deve ser válida.' })
  data_retorno_area_malaria?: Date;

  @IsOptional()
  @Type(() => Boolean)
  teve_hepatite?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'A data deve ser válida.' })
  data_diagnostico_hepatite?: Date;

  @IsString({ message: 'O tipo de hepatite deve ser uma string.' })
  @IsOptional()
  @MaxLength(50, { message: 'O tipo de hepatite deve ter no máximo 50 caracteres.' })
  tipo_hepatite?: string;

  @IsOptional()
  @Type(() => Boolean)
  usou_drogas_injetaveis?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  teve_malaria?: boolean;
}

/**
 * DTO para atualização de formulário de elegibilidade
 */
export class UpdateFormularioElegibilidadeDto extends CreateFormularioElegibilidadeDto {}
