
import HTTP_STATUS from '../constants/httpStatus.js';
import ErrorWithStatus from '../utils/error.js';
import _ from 'lodash';
import MyLogger from '../loggers/myLogger.js';

const myLogger = new MyLogger();


const defaultErrorHandler = (err, req, res, next) => {

    if (err instanceof ErrorWithStatus) {
        return res.status(err.status).json(_.omit(err, ['status']))
    }

    Object.getOwnPropertyNames(err).forEach((key) => {
        // Kiểm tra xem key có phải là "length" hay không
        if (key !== 'length') {
            Object.defineProperty(err, key, { enumerable: true });
        }
    });
    
    const message = err.message || 'Something went wrong';
    const params = [
        req.path,
        { requestId: req.requestId },
        message
  
      ];
  
    myLogger.error(` Error        :: ${req.method}`, params);



    return res.status(err.status || HTTP_STATUS.INTERNAL_SERVER).json(
        {
            message: err.message || 'Something went wrong',
            status: err.status || HTTP_STATUS.INTERNAL_SERVER,
        }
    )
}


export default defaultErrorHandler;
