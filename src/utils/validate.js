import { validationResult } from 'express-validator';
import HTTP_STATUS from '../constants/httpStatus.js';
import EntityError from './error.js';

const validate = validations => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array()});
    
  }
}



export default validate;

