import USERS_MESSAGES from '../constants/messages.js'
import HTTP_STATUS from '../constants/httpStatus.js';




class ErrorWithStatus {
  constructor(_status_, _message_) {
    this.status = _status_;
    this.message = _message_;
  }
}

class EntityError extends ErrorWithStatus {
  constructor({ _message_ = USERS_MESSAGES.VALIDATION_ERROR, _errors_ }) {
    super(HTTP_STATUS.UNPROCESSABLE_ENTITY, _message_);
    this.errors = _errors_;
  }
}

export default EntityError;