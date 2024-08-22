import USERS_MESSAGES from '../constants/messages.js'
import HTTP_STATUS from '../constants/httpStatus.js';

class ErrorWithStatus {
  constructor( _message_,_status_) {
    this.message = _message_;
    this.status = _status_;
  }
}
export default ErrorWithStatus;

