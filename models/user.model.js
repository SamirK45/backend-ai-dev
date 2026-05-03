import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        select: false
    },
    otp: {
        type: String,
        select: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},{timestamps:true});

userSchema.statics.hashPassword =async function(password){
    return await bcrypt.hash(password, 10)
}

userSchema.methods.validatePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = function(){
    return jwt.sign({email: this.email}, process.env.JWT_SECRET,{expiresIn: '5h'})
}

userSchema.methods.generateVerificationToken = function(){
    this.verificationToken = crypto.randomBytes(32).toString('hex');
};


const User = mongoose.model('user', userSchema);

export default User;