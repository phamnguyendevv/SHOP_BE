import statusProductModel from '../models/statusProductModel.js';
// import Connection from "../db/configMysql.js";
// const connection = await Connection.getConnection();

import USERS_MESSAGES from  '../constants/messages.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import ErrorWithStatus from '../utils/error.js';


let statusProductService = {
    addStatus: async (status) => {
        try {
            const rows = await statusProductModel.addStatus(connection, status);
        } catch (err) {
            throw new Error("Không thêm được trạng thái mới")
        }
    },
    getStatus: async (status) => {
        try {
            const statuses = await statusProductModel.getStatus(connection, status);
            
            return statuses;    
        } catch (error) {
            throw new ErrorWithStatus({ message: USERS_MESSAGES.NOT_GET_STATUS, status: HTTP_STATUS.NOT_FOUND });
          
        }
    },
    updateStatus: async (status) => {
        try {
            const result = await statusProductModel.updateStatus(connection, status);
        } catch (error) {
            throw new Error("Không cập nhật được trạng thái")
        }
    },
    deleteStatus: async (id) => {
  
        try {
            const result = await statusProductModel.deleteStatus(connection, id);
            return result;
        } catch (error) {
            throw new Error("Không xóa được trạng thái")
        }
    }
}

export default statusProductService;