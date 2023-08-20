import Order from '../models/OrderSchema.js';
import User from '../models/UserSchema.js';
import {v2 as cloudinary} from 'cloudinary';

export const updateUser = async(req, res, next)=>{
    try{
        let user = await User.findById(req.params.id);
        const {userInfo} = req.body;
        
        if(req.files.length !== 0){
            await cloudinary.uploader.destroy(user.avatar.public_id);
            const cloud = await cloudinary.uploader.upload(req.files[0].path, {
                'folder': "avatars",
            });
            userInfo.avatar = {
                'public_id': cloud.public_id,
                'url': cloud.secure_url,
            }
        }

        user = await User.findByIdAndUpdate(req.params.id, userInfo, {
            'new': true,
        })

        res.status(200).json({
            success: true,
            user,
        })
    }catch(err){
        next(err);
    }
}

export const deleteUser = async(req, res, next)=>{
    try{
        const user = await User.findById(req.params.id);
        await cloudinary.uploader.destroy(user.avatar.public_id);
        await User.findByIdAndDelete(req.params.id);
        await Order.deleteMany({'user': req.params.id});
        res.status(200).json({
            success: true,
            message: "User deleted successfully!",
        })
    }catch(err){
        next(err);
    }
}

export const loadUser = async(req, res, next)=>{
    try{
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            user,
        })
    }catch(err){
        next(err)
    }
}

export const getUser = async(req, res, next)=>{
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json({
            success: true,
            user,
        })
    }catch(err){
        next(err);
    }
}

export const getAllUser = async(req, res, next)=>{
    try{
        const users = await User.find();
        res.status(200).json({
            success: true,
            users,
        })
    }catch(err){
        next(err);
    }
}