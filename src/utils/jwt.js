import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY


const generateToken = async (user) => {
    return jwt.sign(
        { id: user.id, role: user.role_id },
        JWT_ACCESS_KEY,
        {
            expiresIn: "2h",
        }
    );
}

//REFRESH TOKEN
const refreshTokens = async (user) => {
    return jwt.sign(
        { id: user.id, role: user.role_id },
        JWT_ACCESS_KEY,
        {
            expiresIn: "14d",
        }
    );
}


const getTokenExpiration = (token) => {
    const decoded = jwt.decode(token);
    if (!decoded) {
        return null;
    }
    // Lấy thời gian hết hạn từ thuộc tính "exp" của payload
    const expirationTime = decoded.exp;
    // Chuyển đổi thời gian hết hạn từ dạng timestamp sang đối tượng Date
    return new Date(expirationTime * 1000); // Nhân 1000 để chuyển đổi sang milliseconds
};





export { generateToken ,refreshTokens,getTokenExpiration};