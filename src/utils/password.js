import bcrypt from 'bcryptjs';

let passwordhandler = {

    hashPassword: async (password) => {
        try {
            const genSalt = await bcrypt.genSalt(10);
            return bcrypt.hash(password, genSalt);
        } catch (error) {
            // Xử lý lỗi ở đây
            console.error('Error in hashPassword:', error);
            throw error;
        }
    },


    //compare password
    comparePassword: async (password, hashedPassword) => {
        try {
            return bcrypt.compare(password, hashedPassword);
        } catch (error) {
            // Xử lý lỗi ở đây
            console.error('Error in comparePassword:', error);
            throw error;
        }
    }



}
export default passwordhandler;

