import statusModel from '../models/statusModel.js';
import connection from '../db/configMysql.js';  
import USERS_MESSAGES from  '../constants/messages.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import ErrorWithStatus from '../utils/error.js';

let statusService = {
    addStatus: async (status) => {
        try {
            const rows = await statusModel.addStatus(connection, status);
        } catch (err) {
            throw new Error("Không thêm được trạng thái mới")
        }
    },
    getStatus: async (status) => {
        try {
            const statuses = await statusModel.getStatus(connection, status);
        
            return statuses[0];
        } catch (error) {
            throw new ErrorWithStatus({ message: USERS_MESSAGES.NOT_GET_STATUS, status: HTTP_STATUS.NOT_FOUND });
          
        }
    },
    updateStatus: async (status) => {
        try {
            const result = await statusModel.updateStatus(connection, status);
        } catch (error) {
            throw new Error("Không cập nhật được trạng thái")
        }
    },
    deleteStatus: async (body) => {
        console.log(body)
        try {
            const result = await statusModel.deleteStatus(connection, body);
            return result;
        } catch (error) {
            throw new Error("Không xóa được trạng thái")
        }
    }
}

export default statusService;