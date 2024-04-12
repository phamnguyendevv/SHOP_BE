import RoleModel from '../models/roleModel.js';
import connection from '../db/configMysql.js';
import USERS_MESSAGES from '../constants/messages.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import ErrorWithStatus from '../utils/error.js';

let rolesServices = {
    addRoleService: async (data) => {
        const { name } = data;
        try {
            const rows = await RoleModel.addRole(connection, name);
        } catch (err) {
            throw new Error("Không thêm được role mới")
        }
    },
    getRolesService: async () => {
        try {
            const roles = await RoleModel.getRoles(connection);
            return roles;


        } catch (error) {
            throw new Error("Không lấy được role");
        }
    },
    updateRoleService: async (data) => {
        try {
            const { id, name } = data;
            const result = await RoleModel.updateRole(connection, id, name);
        } catch (error) {
            throw new Error("Không cập nhật được role")
        }
    },
}

export default rolesServices;

