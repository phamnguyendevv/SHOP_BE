import { validationResult } from 'express-validator';
import HTTP_STATUS from '../constants/httpStatus.js';
import MyLogger from '../loggers/myLogger.js';

const myLogger = new MyLogger();

const validate = validations => async (req, res, next) => {
  await Promise.all(validations.map(validation => validation.run(req)));
  
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const message = errors.array().map(error => error.msg).join(', ');
  const status = HTTP_STATUS.UNPROCESSABLE_ENTITY;

  myLogger.error('Validation Error', {
    method: req.method,
    url: req.originalUrl,
    requestId: req.requestId,
    message,
    status
  });

  res.status(status).json({ message, status });
};

export default validate;