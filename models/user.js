const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('node:crypto');
const { createTokenForUser,validateToken } = require('../services/authentication');

//Schema::
const userSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true
	},email: {
		type: String,
		required: true,
		unique: true
	},salt: {
		type: String
	},password: {
		type: String,
        required: true,
	},
    profileImageUrl: {
		type: String,
        default: '/images/default.png'
	},
    role: {
		type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
	}

},{timestamps: true});

userSchema.pre('save', function(next){
    const user = this;

    if( !user.isModified('password') ){
        return;
    }

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPassword;

    return next();
});


userSchema.static('matchPasswordAndGenerateToken', async function(email, password){
    const user = await this.findOne({email});
    
    if(!user){
        throw new Error('User Not Found');
    }

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt).update(password).digest('hex');
    
    if(hashedPassword === userProvidedHash){
        const token = createTokenForUser(user);
        return token;
    }else{
        throw new Error('Incorrect Password');
    }
    //return hashedPassword === userProvidedHash;

});


//Model
const User = mongoose.model('user',userSchema);

module.exports = User;