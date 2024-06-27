import { validationResult } from 'express-validator';
import HTTP_STATUS from '../constants/httpStatus.js';
import EntityError from './error.js';
import MyLogger from '../loggers/myLogger.js';

const myLogger = new MyLogger();



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
    const message = errors.array().map(i => i.msg).join(', ')
    const status = HTTP_STATUS.UNPROCESSABLE_ENTITY;
 
    const params = [
      req.originalUrl,
      { requestId: req.requestId },
      {message, status}

    ];

    myLogger.error(`Validation Error :: ${req.method}`, params);

   
    res.status(400).json({ errors: errors.array()});
    
  }
}



export default validate;