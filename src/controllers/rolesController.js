import rolesServices from '../services/rolesServices.js'

let rolesController = {
    async addRoleController(req, res) {
       
        const role = await rolesServices.addRoleService(req.body);
        return res.status(200).json({ message: 'Role created', role });

    },

    async getRolesController(req, res) {
        const roles = await rolesServices.getRolesService();
        return res.json({
            message: "Danh sách role",
            roles
        })

    },

    async updateRoleController(req, res) {
            const role = await rolesServices.updateRoleService( req.body);
            return res.status(200).json({ message: 'Role updated', role });
       
    },

    


}

export default rolesController;