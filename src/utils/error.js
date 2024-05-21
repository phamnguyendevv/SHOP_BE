import USERS_MESSAGES from '../constants/messages.js'
import HTTP_STATUS from '../constants/httpStatus.js';




class ErrorWithStatus {
  constructor( _message_,_status_) {
    this.message = _message_;
    this.status = _status_;
  }
}

// class EntityError extends ErrorWithStatus {
//   constructor({ _message_ = USERS_MESSAGES.VALIDATION_ERROR, _errors_ }) {
//     super(_message_, HTTP_STATUS.UNPROCESSABLE_ENTITY);
//     this.errors = _errors_;
//   }
// }

export default ErrorWithStatus;

