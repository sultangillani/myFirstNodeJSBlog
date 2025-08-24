const jwt = require('jsonwebtoken');
const secret = 'Sultan>123...';

function createTokenForUser(user){
    //setCurrentUser(user); 
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role
    };

    const token =  jwt.sign(payload,secret);
    return token;
}

function validateToken(token){
    if(!token){
        return null;
    }
    
    try{   
        const payload = jwt.verify(token,secret);
        return payload;
    }catch(error){
        return null;
    }
    
}

module.exports = {
	createTokenForUser,
    validateToken
};