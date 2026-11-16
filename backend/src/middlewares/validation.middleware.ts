import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/errors';

function validationMiddleware<T>(type: new () => T): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(type, req.body);
      const errors = await validate(dto as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      });
      if (errors.length > 0) {
        const errorMessages = errors.map(error =>
          Object.values(error.constraints || {})
        ).flat();

        // Lança um BadRequestError com as mensagens de validação
        return next(new BadRequestError(errorMessages.join(', ')));
      } else {
        req.body = dto;
        return next();
      }
    } catch (error) {
      return next(error);
    }
  };
}
export default validationMiddleware;
