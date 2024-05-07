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


const decoToken = async (token) => {
    return jwt.verify(token, JWT_ACCESS_KEY)
};






export { generateToken, refreshTokens, decoToken };