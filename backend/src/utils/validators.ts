import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Valida CPF brasileiro (formato XX.XXX.XXX-XX ou XXXXXXXXXXX)
 */
@ValidatorConstraint({ name: 'isCPF', async: false })
export class IsCPFConstraint implements ValidatorConstraintInterface {
  validate(cpf: string): boolean {
    if (!cpf || typeof cpf !== 'string') return false;

    // Remove pontuação
    const cleanCPF = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cleanCPF.length !== 11) return false;

    // Verifica se todos os dígitos são iguais (inválido)
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

    // Valida primeiro dígito verificador
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

    // Valida segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

    return true;
  }

  defaultMessage(): string {
    return 'O CPF informado é inválido.';
  }
}

/**
 * Decorator para validar CPF
 */
export function IsCPF(validationOptions?: ValidationOptions) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCPFConstraint,
    });
  };
}

/**
 * Valida se a idade está entre o mínimo e máximo permitido
 */
@ValidatorConstraint({ name: 'isValidDonorAge', async: false })
export class IsValidDonorAgeConstraint implements ValidatorConstraintInterface {
  validate(birthDate: Date): boolean {
    if (!birthDate || !(birthDate instanceof Date)) return false;

    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 16 && age - 1 <= 69;
    }

    return age >= 16 && age <= 69;
  }

  defaultMessage(): string {
    return 'O doador deve ter entre 16 e 69 anos.';
  }
}

/**
 * Decorator para validar idade de doador
 */
export function IsValidDonorAge(validationOptions?: ValidationOptions) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDonorAgeConstraint,
    });
  };
}

/**
 * Valida peso dentro dos limites permitidos
 */
@ValidatorConstraint({ name: 'isValidDonorWeight', async: false })
export class IsValidDonorWeightConstraint implements ValidatorConstraintInterface {
  validate(weight: number): boolean {
    if (typeof weight !== 'number') return false;
    return weight >= 50 && weight <= 150;
  }

  defaultMessage(): string {
    return 'O peso deve estar entre 50 kg e 150 kg.';
  }
}

/**
 * Decorator para validar peso de doador
 */
export function IsValidDonorWeight(validationOptions?: ValidationOptions) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDonorWeightConstraint,
    });
  };
}

/**
 * Valida tipo sanguíneo
 */
@ValidatorConstraint({ name: 'isValidBloodType', async: false })
export class IsValidBloodTypeConstraint implements ValidatorConstraintInterface {
  validate(bloodType: string): boolean {
    const validTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'NDA'];
    return validTypes.includes(bloodType?.toUpperCase());
  }

  defaultMessage(): string {
    return 'O tipo sanguíneo deve ser um dos: O+, O-, A+, A-, B+, B-, AB+, AB-, NDA.';
  }
}

/**
 * Decorator para validar tipo sanguíneo
 */
export function IsValidBloodType(validationOptions?: ValidationOptions) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidBloodTypeConstraint,
    });
  };
}

/**
 * Trim automático de strings
 */
export function Trim() {
  return function (target: any, propertyName: string) {
    let value: string;

    const getter = () => value;
    const setter = (newVal: string) => {
      value = typeof newVal === 'string' ? newVal.trim() : newVal;
    };

    Object.defineProperty(target, propertyName, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}
