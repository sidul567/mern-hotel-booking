import User from '../models/UserSchema.js';
import bcrypt from "bcrypt";
import { createError } from '../utilities/error.js';
import { sendToken } from '../utilities/jwtToken.js';
import { v2 as cloudinary } from 'cloudinary';

export const register = async (req, res, next)=>{
    try{
        const hashPassword = bcrypt.hashSync(req.body.password, 10);
        const cloud = await cloudinary.uploader.upload(req.files[0].path, {
            'folder': "avatars",
        });
        const avatar = {
            public_id: cloud.public_id,
            url: cloud.secure_url,
        }
        const user = await new User({...req.body, password: hashPassword, avatar}).save();

        sendToken(res, user);
    }catch(err){
        next(err);
    }
}

export const login = async (req, res, next)=>{
    try{
        const user = await User.findOne({username: req.body.username}).select("+password");
        
        if(!user){
            return next(createError(404, "User not found!"));
        }

        const isValidPassword = bcrypt.compareSync(req.body.password, user.password); 

        if(!isValidPassword){
            return next(createError(404, "Wrong username or password!"));
        }
        sendToken(res, user);
    }catch(err){
        next(err);
    }
}

export const logout = async (req, res, next)=>{
    try{
        res.cookie("token", null, {
            httpOnly: true,
            expires: new Date(Date.now() +  process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            secure: true,
            sameSite: 'none'
        }).status(200).json({
            success: true,
        })
    }catch(err){
        next(err);
    }
}