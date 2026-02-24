import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/errors';

function validationMiddleware<T>(type: any): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    validate(dto).then((errors: ValidationError[]) => {

      if (errors.length > 0) {
        const errorMessages = errors.map(error =>
          Object.values(error.constraints || {})
        ).flat();

        // Lança um BadRequestError com as mensagens de validação
        next(new BadRequestError(errorMessages.join(', ')));
        
      } else {
        req.body = dto;
        next();
      }
    });
  };
}
export default validationMiddleware;
