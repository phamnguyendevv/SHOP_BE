import HTTP_STATUS from '../constants/httpStatus.js';
import ErrorWithStatus from '../utils/error.js';
import _ from 'lodash';


const defaultErrorHandler = (err, req, res, next) => {
    if (err instanceof ErrorWithStatus) {
        return res.status(err.status).json(_.omit(err, ['status']))
    }

    Object.getOwnPropertyNames(err).forEach((key) => {
        Object.defineProperty(err, key, { enumerable: true });
      });

    return res.status(err.status || HTTP_STATUS.INTERNAL_SERVER).json(
        {
            message: err.message || 'Something went wrong',
            status: err.status || HTTP_STATUS.INTERNAL_SERVER,
        }
    )
}


export default defaultErrorHandler;

