
require('dotenv').config()
const jwt = require('jsonwebtoken');
// privatekey tao co dinh 


const createTokenPair = async (payload ,privateKey) => {  
    const {user_id,verify,exp} = payload
    if(exp){
        payload = {user_id,verify,exp}
        try{
            const accessToken = await jwt.sign({user_id,verify}, privateKey, {
                expiresIn: '3 days',
            });
            const refreshToken = await jwt.sign(payload, privateKey, {
            });
            return {accessToken, refreshToken};
        }catch(error){
            console.log('error create token pair',error)
            throw error;
        }
    }else{
        payload = {user_id,verify}
        try{
            const accessToken = await jwt.sign(payload, privateKey, {
                expiresIn: '3 days',
            });
            const refreshToken = await jwt.sign(payload, privateKey, {
                expiresIn: '7 days',
            });
            return {accessToken, refreshToken};
        }catch(error){
            throw error;
        }
    }
    
}



module.exports = {
    createTokenPair
}
